from flask import Flask
from flask_cors import CORS
from backend.extensions import db, migrate
from backend.saml import saml_bp
from backend.routes.waitlist import waitlist_bp
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

    @app.route("/")
    def home():
        return "Hello, Flask!"
        
    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
