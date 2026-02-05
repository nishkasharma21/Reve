from flask import Blueprint, request, redirect, session, url_for, make_response, Response
from onelogin.saml2.auth import OneLogin_Saml2_Auth
from onelogin.saml2.utils import OneLogin_Saml2_Utils
import json
import os

saml_bp = Blueprint('saml', __name__)

# def init_saml_auth(req):

#     settings_file = os.path.join(os.path.dirname(__file__), '..', 'saml_settings.json')
    
#     # Load the SAML configuration from the JSON file
#     with open(settings_file) as f:
#         settings = json.load(f)

#     auth = OneLogin_Saml2_Auth(req, settings)
#     return auth

# def prepare_flask_request(request):
#     # for requests coming into flask
#     url_data = {
#         'https': 'on' if request.scheme == 'https' else 'off',
#         'http_host': request.host,
#         'server_port': int(request.environ.get('SERVER_PORT', 443)),
#         'script_name': request.path,
#         'get_data': request.args.copy(),
#         'post_data': request.form.copy(),
#         'query_string': request.query_string
#     }
#     return url_data

@saml_bp.route('/metadata')
def saml_metadata():
    metadata_xml = """<?xml version="1.0"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     validUntil="2026-02-07T10:12:55Z"
                     cacheDuration="PT604800S"
                     entityID="https://goreve-d2e7c1150e3c.herokuapp.com/saml/metadata">
    <md:SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
        <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
        <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
                                     Location="https://goreve-d2e7c1150e3c.herokuapp.com/saml/acs"
                                     index="1" />
    </md:SPSSODescriptor>
</md:EntityDescriptor>"""
    return Response(metadata_xml, mimetype='application/xml')

@saml_bp.route('/acs', methods=['POST'])
def saml_acs():
    data = request.data  # raw POST body
    return Response("ACS endpoint hit", status=200)
    # req = prepare_flask_request(request)
    # auth = init_saml_auth(req)
    # auth.process_response()
    # errors = auth.get_errors()

    # if errors:
    #     return f"Error: {', '.join(errors)}", 400

    # if not auth.is_authenticated():
    #     return "Authentication failed", 401
    
    # if len(errors) == 0:
    #     session['samlUserdata'] = auth.get_attributes()
    #     session['samlNameId'] = auth.get_nameid()
    #     session['samlSessionIndex'] = auth.get_session_index()
        
    #     self_url = OneLogin_Saml2_Utils.get_self_url(req)
        
    #     if 'RelayState' in request.form and self_url != request.form['RelayState']:
    #         relay_state = request.form.get('RelayState')
    #         if relay_state and relay_state.startswith('/'):
    #             return redirect(relay_state)
    #     else:
    #         return redirect(url_for('main.index'))
    # else:
    #     return f"Error: {', '.join(errors)}", 400
    

# @saml_bp.route('/login')
# def saml_login():
#     req = prepare_flask_request(request)
#     auth = init_saml_auth(req)
#     return redirect(auth.login(return_to=url_for('main.index', _external=True)))



# @saml_bp.route('/logout')
# def saml_logout():
#     req = prepare_flask_request(request)
#     auth = init_saml_auth(req)
#     name_id = session.get('samlNameId')
#     session_index = session.get('samlSessionIndex')
#     return redirect(
#         auth.logout(
#             name_id=name_id,
#             session_index=session_index,
#             return_to=url_for('main.index', _external=True)
#         )
#     )


# @saml_bp.route('/sls')
# def saml_sls():
#     req = prepare_flask_request(request)
#     auth = init_saml_auth(req)
#     url = auth.process_slo()
#     errors = auth.get_errors()
    
#     if len(errors) == 0:
#         session.clear()
        
#         if url is not None:
#             return redirect(url)
#         else:
#             return redirect(url_for('main.index'))
#     else:
#         return f"Error: {', '.join(errors)}", 400