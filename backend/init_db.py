from app import app  # or whatever your main Flask app file is
from backend.extensions import db

with app.app_context():
    db.create_all()
    print("✅ All tables created successfully!")