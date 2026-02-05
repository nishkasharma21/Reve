# from flask import Flask

# app = Flask(__name__)

# @app.route("/")
# def home():
#     return "Inky pinky ponky!"

# if __name__ == "__main__":
#     app.run(debug=True)


from flask import Flask, session
from saml_routes import saml_bp  # the file where your blueprint lives
import os

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY")

# Register the blueprint
app.register_blueprint(saml_bp, url_prefix='/saml')  # optional prefix

@app.route("/")
def home():
    return "Hello, Flask!"

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
