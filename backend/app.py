from flask import Flask, session, jsonify, request
from flask_cors import CORS
from backend.extensions import db, migrate
from backend.saml import saml_bp
from backend.routes.waitlist import waitlist_bp
from backend.routes.user import user_bp
from backend.models import User, Item, Rental
from backend.routes.rental import rental_bp
from backend.routes.items import items_bp
from backend.routes.item_blocks import item_blocks_bp
from flask_mail import Mail, Message
import os
from datetime import datetime

SAML_PROD_FRONTEND_URL = os.getenv('SAML_PROD_FRONTEND_URL', 'http://localhost:3000')

def create_app():
    app = Flask(__name__)
    
    is_prod = os.environ.get('FLASK_ENV') == 'production'

    # ── CORS ──────────────────────────────────────────────────────────────────
    CORS(app, 
         supports_credentials=True, 
         origins=['http://localhost:3000', 'http://localhost:5173', 'https://goreve.store'])

    # Session configurations
    app.config['SESSION_COOKIE_SECURE'] = True  # Required for HTTPS
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Critical for cross-origin
    app.config['SESSION_COOKIE_DOMAIN'] = None  # Let Flask handle it

    # Email configuration
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY') or os.environ.get('SECRET_KEY')
    uri = os.environ.get("DATABASE_URL")
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = uri or "sqlite:///app.db"    
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ── Extensions ────────────────────────────────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)
    mail = Mail(app)  # Initialize Mail with app

    # ── Blueprints ────────────────────────────────────────────────────────────
    app.register_blueprint(saml_bp, url_prefix="/saml")
    app.register_blueprint(waitlist_bp, url_prefix="/api")
    app.register_blueprint(user_bp, url_prefix="/api/user")
    app.register_blueprint(rental_bp, url_prefix='/api')
    app.register_blueprint(items_bp, url_prefix='/api')
    app.register_blueprint(item_blocks_bp, url_prefix='/api')


    # ── Routes ────────────────────────────────────────────────────────────────
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
            "id": user_id,
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "joinDate": user.created_at.isoformat()
        })
        
    @app.after_request
    def debug_cors(response):
        print(f"[CORS] {request.method} {request.path} → {response.headers.get('Access-Control-Allow-Origin')}")
        return response
    
    
    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)