from flask import Blueprint, request, redirect, session, url_for, make_response, Response
from onelogin.saml2.auth import OneLogin_Saml2_Auth
from onelogin.saml2.utils import OneLogin_Saml2_Utils
import json
import os
from backend.models import User
from backend.extensions import db

SAML_DEV_FRONTEND_URL = os.getenv('SAML_DEV_FRONTEND_URL', 'http://localhost:3000')
SAML_PROD_FRONTEND_URL = os.getenv('SAML_PROD_FRONTEND_URL', 'https://goreve.store')

saml_bp = Blueprint('saml', __name__)

def process_saml_login(email, first_name, last_name):
    """Shared logic used by both real ACS and mock login"""
    session['samlNameId'] = email
    session['firstName'] = first_name
    session['lastName'] = last_name
    
    user = User.query.filter_by(email=email).first()
    print(f"[DEBUG] SAML login for {email}, user found: {user}")
    
    if user:
        session['user_id'] = user.id
        print(f"[DEBUG] session after login: {dict(session)}")
        return redirect(f"{SAML_PROD_FRONTEND_URL}/home")
    else:
        return redirect(f"{SAML_PROD_FRONTEND_URL}/onboard")

def init_saml_auth(req):
    settings_file = os.path.join(os.path.dirname(__file__), '..', 'saml_settings.json')
    
    # Load the SAML configuration from the JSON file
    with open(settings_file) as f:
        settings = json.load(f)
    
    # Inject credentials from environment variables
    settings['sp']['x509cert'] = os.environ.get('SAML_CERT', '')
    settings['sp']['privateKey'] = os.environ.get('SAML_KEY', '')
    
    auth = OneLogin_Saml2_Auth(req, settings)
    return auth

def prepare_flask_request(request):
    # for requests coming into flask
    url_data = {
        'https': 'on' if request.headers.get('X-Forwarded-Proto', 'http') == 'https' else 'off',
        'http_host': request.host,
        'server_port': request.environ.get('SERVER_PORT', 443),
        'script_name': request.path,
        'get_data': request.args.copy(),
        'post_data': request.form.copy(),
        'query_string': request.query_string.decode('utf-8') if request.query_string else ''
    }
    return url_data

@saml_bp.route('/metadata')
def saml_metadata():
    # Read certificate from environment variable
    cert_content = os.environ.get('SAML_CERT')
    
    if not cert_content:
        return Response("SAML certificate not configured", status=500)
    
    # Handle escaped newlines from environment variable
    cert_content = cert_content.replace('\\n', '\n')
    
    # Extract just the certificate data (remove BEGIN/END lines)
    cert_data = ''.join([line for line in cert_content.split('\n') 
                        if not line.startswith('-----')])
    
    metadata_xml = f"""<?xml version="1.0"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                    validUntil="2027-02-06T10:12:55Z"
                    cacheDuration="PT604800S"
                    entityID="https://goreve-d2e7c1150e3c.herokuapp.com/saml/metadata">
    <md:SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
        <md:KeyDescriptor use="encryption">
            <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                <ds:X509Data>
                    <ds:X509Certificate>{cert_data}</ds:X509Certificate>
                </ds:X509Data>
            </ds:KeyInfo>
        </md:KeyDescriptor>
        <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
        <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
                                    Location="https://goreve-d2e7c1150e3c.herokuapp.com/saml/acs"
                                    index="1" />
    </md:SPSSODescriptor>
</md:EntityDescriptor>"""
    
    return Response(metadata_xml, mimetype='application/xml')


@saml_bp.route('/acs', methods=['POST'])
def saml_acs():
    req = prepare_flask_request(request)
    auth = init_saml_auth(req)
    auth.process_response()
    errors = auth.get_errors()

    if errors:
        # Print detailed error info
        error_reason = auth.get_last_error_reason()
        print(f"SAML Errors: {errors}")
        print(f"Error Reason: {error_reason}")
        return f"Error: {', '.join(errors)}<br>Reason: {error_reason}", 400

    if not auth.is_authenticated():
        return "Authentication failed", 401
    
    # Save user data to session
    session['samlUserdata'] = auth.get_attributes()
    session['samlNameId'] = auth.get_nameid()
    session['samlSessionIndex'] = auth.get_session_index()
    
    attributes = session['samlUserdata']
    print(attributes.keys())

    first_name = attributes.get('urn:oid:2.5.4.42', [''])[0]
    last_name = attributes.get('urn:oid:2.5.4.4', [''])[0]
    email = attributes.get('urn:oid:0.9.2342.19200300.100.1.3', [''])[0]
    
    # USE SHARED FUNCTION
    return process_saml_login(email, first_name, last_name)

    # Store name in session for use during onboarding
    # session['firstName'] = attributes.get('urn:oid:2.5.4.42', [''])[0]
    # session['lastName'] = attributes.get('urn:oid:2.5.4.4', [''])[0]

    # # Check if user exists
    # user = User.query.filter_by(email=email).first()
    
    # if user:
    #     return redirect(f"{SAML_PROD_FRONTEND_URL}/home")
    # else:
    #     return redirect(f"{SAML_PROD_FRONTEND_URL}/onboard")

@saml_bp.route('/mock-login')
def mock_login():
    if not os.getenv('ENABLE_MOCK_LOGIN'):
        return "Not allowed", 403
    
    email = request.args.get('email', 'test@stanford.edu')
    first_name = request.args.get('firstName', 'Test')
    last_name = request.args.get('lastName', 'User')
    
    # USE SAME LOGIC AS REAL ACS
    return process_saml_login(email, first_name, last_name)
    
@saml_bp.route('/login')
def saml_login():
    req = prepare_flask_request(request)
    auth = init_saml_auth(req)
    return redirect(auth.login(return_to=SAML_PROD_FRONTEND_URL))


@saml_bp.route('/logout')
def saml_logout():
    req = prepare_flask_request(request)
    auth = init_saml_auth(req)
    
    # 1. Get identifiers needed for a global logout
    name_id = session.get('samlNameId')
    session_index = session.get('samlSessionIndex')
    
    # 2. Clear your local session first
    session.clear()
    
    # 3. Trigger the SAML Global Logout
    # This sends the user to the Stanford page in your screenshot
    return redirect(
        auth.logout(
            name_id=name_id,
            session_index=session_index,
            return_to=SAML_PROD_FRONTEND_URL
        )
    )


@saml_bp.route('/sls')
def saml_sls():
    req = prepare_flask_request(request)
    auth = init_saml_auth(req)
    url = auth.process_slo()
    errors = auth.get_errors()
    
    if len(errors) == 0:
        session.clear()
        
        if url is not None:
            return redirect(url)
        else:
            return redirect(url_for('home'))
    else:
        return f"Error: {', '.join(errors)}", 400
    
@saml_bp.route('/status')
def saml_status():
    if 'samlUserdata' in session:
        return {
            'authenticated': True,
            'user': {
                'email': session.get('samlNameId'),
                'attributes': session.get('samlUserdata')
            }
        }, 200
    else:
        return {'authenticated': False}, 200