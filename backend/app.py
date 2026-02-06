from flask import Flask, session
from backend.saml import saml_bp  # the file where your blueprint lives
import os

app = Flask(__name__)
# app.secret_key = os.environ.get("FLASK_SECRET_KEY")

# Register the blueprint
app.register_blueprint(saml_bp, url_prefix='/saml')  # optional prefix

@app.route("/")
def home():
    return "Hello, Flask!"

if __name__ == "__main__":
    app.run(debug=True)
