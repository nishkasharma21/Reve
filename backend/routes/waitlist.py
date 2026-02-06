from flask import Blueprint, request, jsonify
from extensions import db
from models import WaitlistEmail  # make sure you have this model

waitlist_bp = Blueprint("waitlist", __name__)

@waitlist_bp.route("/waitlist", methods=["POST"])
def add_to_waitlist():
    data = request.get_json()

    # check if email exists in request
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    # check if email already in database
    existing = WaitlistEmail.query.filter_by(email=email).first()
    if existing:
        return jsonify({"message": "Email already on the waitlist"}), 200

    # create new entry
    new_entry = WaitlistEmail(email=email)
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({"message": "Email added to waitlist", "email": email}), 201
