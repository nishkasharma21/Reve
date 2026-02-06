from flask import Flask, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from saml import saml_bp  # the file where your blueprint lives
import os

app = Flask(__name__)
# app.secret_key = os.environ.get("FLASK_SECRET_KEY")

uri = os.environ.get('DATABASE_URL')
if uri and uri.startswith('postgres://'):
    uri = uri.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = uri or 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from models import User, Item, BorrowRequest, Conversation, Message
# Register the blueprint
app.register_blueprint(saml_bp, url_prefix='/saml')  # optional prefix

@app.route("/")
def home():
    return "Hello, Flask!"

if __name__ == "__main__":
    app.run(debug=True)
