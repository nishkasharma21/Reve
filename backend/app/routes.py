from flask import Blueprint, session, redirect, url_for, jsonify
from functools import wraps

main = Blueprint('main', __name__)

def login_required(f):
# decorator for a route that requires the user to be logged in
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'samlUserdata' not in session:
            return redirect(url_for('saml.saml_login'))

        return f(*args, **kwargs)

    return decorated_function

@main.route('/')
def index():
    return jsonify({"message": "Hello from Flask!"})
