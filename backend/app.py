from flask import Flask, session, jsonify
from flask_cors import CORS
from backend.extensions import db, migrate
from backend.saml import saml_bp
from backend.routes.waitlist import waitlist_bp
from backend.routes.user import user_bp
from backend.models import User
import os

SAML_PROD_FRONTEND_URL = os.getenv('SAML_PROD_FRONTEND_URL', 'http://localhost:3000')

def create_app():
    app = Flask(__name__)
    CORS(app, 
         supports_credentials=True, 
         origins=['http://localhost:3000', 'http://localhost:5173', 'https://goreve.store'])
    
    # ADD THESE SESSION CONFIGURATIONS
    app.config['SESSION_COOKIE_SECURE'] = True  # Required for HTTPS
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Critical for cross-origin
    app.config['SESSION_COOKIE_DOMAIN'] = None  # Let Flask handle it

    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY') or os.environ.get('SECRET_KEY')
    uri = os.environ.get("DATABASE_URL")
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = uri or "sqlite:///app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    app.register_blueprint(saml_bp, url_prefix="/saml")
    app.register_blueprint(waitlist_bp, url_prefix="/api")
    app.register_blueprint(user_bp, url_prefix="/api/user")

    @app.route("/")
    def home():
        return "Hello, Flask!"
    
    @app.route("/api/profile")
    def get_current_user():
        print(f"[DEBUG] session in profile: {dict(session)}")
        user_id = session.get('user_id')

        if not user_id:
            return jsonify({"error": "Not authenticated"}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "joinDate": user.created_at.isoformat()
        })
        
    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
