from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Inky pinky ponky!"

if __name__ == "__main__":
    app.run(debug=True)
