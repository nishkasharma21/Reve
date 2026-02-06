from flask import Flask
from extensions import db, migrate
from saml import saml_bp
import os
from routes.waitlist import waitlist_bp ## route for waitlist
import models

def create_app():
    app = Flask(__name__)

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

    # Import models AFTER db is initialized
    with app.app_context():
        # from backend import models
        import models

    @app.route("/")
    def home():
        return "Hello, Flask!"

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
