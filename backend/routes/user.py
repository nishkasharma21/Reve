import traceback
from flask import Blueprint, request, jsonify, session
from backend.models import User
from backend.extensions import db

user_bp = Blueprint('user', __name__)


def _build_user(email, first_name, last_name, data):
    """Construct a User instance from common onboarding fields."""
    return User(
        email=email,
        firstName=first_name,
        lastName=last_name,
        dorm_location=data.get('dorm_location'),
        topStyle=data.get('topStyle'),
        bottomStyle=data.get('bottomStyle'),
        height=data.get('height'),
        weight=data.get('weight'),
        profile_pic=data.get('profile_pic'),
    )


def _get_user_by_email(email):
    return User.query.filter_by(email=email).first()


@user_bp.route('/complete-onboarding', methods=['POST'])
def complete_onboarding():
    email = session.get('samlNameId')
    if not email:
        return jsonify({'error': 'Not authenticated'}), 401

    existing = _get_user_by_email(email)
    if existing:
        session['user_id'] = existing.id
        return jsonify({'success': True}), 200

    data = request.get_json()
    try:
        new_user = _build_user(
            email=email,
            first_name=session.get('firstName'),
            last_name=session.get('lastName'),
            data=data,
        )
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        return jsonify({'success': True}), 200

    except Exception as e:
        db.session.rollback()
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500