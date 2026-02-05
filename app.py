from flask import Flask

app = Flask(__name__)  # Create a Flask app

# Define a route
@app.route("/")
def home():
    return "Hello, Flask!"

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
