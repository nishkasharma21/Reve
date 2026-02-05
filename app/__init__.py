from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from flask_session import Session
from dotenv import load_dotenv
load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Database config
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or 'sqlite:///dev.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    # Configure session
    app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
    app.config['SESSION_TYPE'] = 'filesystem'
    Session(app)
    
    # Register SAML blueprint
    from app.saml import saml_bp
    app.register_blueprint(saml_bp, url_prefix='/saml')
    
    # Your other blueprints/routes
    from app.routes import main_bp
    app.register_blueprint(main_bp)

    return app
