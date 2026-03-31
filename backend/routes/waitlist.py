from flask import Blueprint, request, jsonify
from backend.extensions import db
from backend.models import Waitlist  # Changed from WaitlistEmail to Waitlist

waitlist_bp = Blueprint("waitlist", __name__)

@waitlist_bp.route("/waitlist", methods=["POST"])
def add_to_waitlist():
    data = request.get_json()
    
    # Get all required fields
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    
    # Validate all fields are present
    if not first_name:
        return jsonify({"error": "First name is required"}), 400
    if not last_name:
        return jsonify({"error": "Last name is required"}), 400
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not email.endswith("@stanford.edu"):
        return jsonify({"error": "Only Stanford email addresses are allowed"}), 400
    
    # Check if email already in database
    existing = Waitlist.query.filter_by(email=email).first()
    if existing:
        return jsonify({"message": "Email already on the waitlist"}), 200
    
    # Create new entry with all fields
    new_entry = Waitlist(
        firstName=first_name,
        lastName=last_name,
        email=email
    )
    
    db.session.add(new_entry)
    db.session.commit()
    
    return jsonify({
        "message": "Successfully added to waitlist",
        "firstName": first_name,
        "lastName": last_name,
        "email": email
    }), 201