from flask import Blueprint, session, redirect, url_for, jsonify, request
from functools import wraps

main_bp = Blueprint('main', __name__)

def login_required(f):
    """
    Decorator to protect routes that require authentication.
    
    If the user is not logged in, they'll be redirected to the SAML login
    page with a 'next' parameter so they can be returned to the page they
    were trying to access after successful login.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'samlUserdata' not in session:
            # User is not authenticated
            # Save the current URL so we can redirect back after login
            # request.url contains the full URL the user was trying to access
            return redirect(url_for('saml.saml_login', next=request.url))
        
        # User is authenticated - proceed to the route
        return f(*args, **kwargs)
    
    return decorated_function

@main_bp.route('/')
def index():
    """
    Home page - shows auth status and provides links
    """
    if 'samlUserdata' in session:
        user_data = session.get('samlUserdata', {})
        
        # Try to get email from common SAML attribute names
        email = None
        if 'mail' in user_data and user_data['mail']:
            email = user_data['mail'][0]
        elif 'email' in user_data and user_data['email']:
            email = user_data['email'][0]
        elif 'urn:oid:0.9.2342.19200300.100.1.3' in user_data:
            email = user_data['urn:oid:0.9.2342.19200300.100.1.3'][0]
        else:
            email = session.get('samlNameId', 'Unknown User')
        
        return jsonify({
            "message": "Hello from Flask!",
            "authenticated": True,
            "user": email,
            "logout_url": "/saml/logout"
        })
    else:
        return jsonify({
            "message": "Hello from Flask!",
            "authenticated": False,
            "login_url": "/saml/login",
            "login_url_short": "/login"
        })

@main_bp.route('/login')
def login_redirect():
    """
    Convenience route - redirects /login to /saml/login
    Preserves the 'next' parameter if present
    """
    # Get the 'next' parameter if it exists
    next_url = request.args.get('next')
    
    if next_url:
        # Pass the 'next' parameter along to SAML login
        return redirect(url_for('saml.saml_login', next=next_url))
    else:
        # No 'next' parameter, just redirect to SAML login
        return redirect(url_for('saml.saml_login'))

@main_bp.route('/logout')
def logout_redirect():
    """
    Convenience route - redirects /logout to /saml/logout
    """
    return redirect(url_for('saml.saml_logout'))

@main_bp.route('/protected')
@login_required
def protected():
    """
    Example of a protected route that requires authentication.
    
    If you access this without being logged in, you'll be redirected
    to the login page, and after logging in, you'll be brought back here.
    """
    user_data = session.get('samlUserdata', {})
    name_id = session.get('samlNameId', 'Unknown')
    
    return jsonify({
        "message": "This is a protected route - you made it!",
        "user": name_id,
        "attributes": user_data
    })

@main_bp.route('/user-info')
@login_required
def user_info():
    """
    Display all available user information from SAML.
    Useful for debugging - shows what attributes Stanford sends.
    """
    user_data = session.get('samlUserdata', {})
    name_id = session.get('samlNameId', 'Not available')
    session_index = session.get('samlSessionIndex', 'Not available')
    
    return jsonify({
        "nameId": name_id,
        "sessionIndex": session_index,
        "attributes": user_data,
        "availableAttributeKeys": list(user_data.keys()) if user_data else []
    })

@main_bp.route('/public')
def public():
    """
    Public route that doesn't require authentication.
    """
    return jsonify({
        "message": "This page is public - no login required!",
        "login_url": "/saml/login"
    })