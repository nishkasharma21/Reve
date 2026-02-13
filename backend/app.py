from flask import Flask
from flask_cors import CORS
from backend.extensions import db, migrate
from backend.saml import saml_bp
from backend.routes.waitlist import waitlist_bp
from flask_session import Session
import redis
import os

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

    # Get Redis URL and configure SSL properly for Heroku
    redis_url = os.environ.get('REDIS_URL')

    # Parse and configure Redis with SSL settings
    if redis_url and redis_url.startswith('rediss://'):
        # For SSL connections, disable certificate verification
        app.config['SESSION_REDIS'] = redis.from_url(
            redis_url,
            ssl_cert_reqs=None,
            decode_responses=False
        )
    else:
        app.config['SESSION_REDIS'] = redis.from_url(
            redis_url or 'redis://localhost:6379'
        )

    app.config['SESSION_TYPE'] = 'redis'
    app.config['SESSION_PERMANENT'] = True
    app.config['SESSION_USE_SIGNER'] = True
    app.config['SESSION_KEY_PREFIX'] = 'saml_session:'
    app.config['PERMANENT_SESSION_LIFETIME'] = 3600
    app.config['SESSION_COOKIE_SECURE'] = True
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

    Session(app)

    CORS(app, 
         supports_credentials=True, 
         origins=['http://localhost:3000', 'http://localhost:5173', 'https://goreve.store'])

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
