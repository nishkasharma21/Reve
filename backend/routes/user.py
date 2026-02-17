from flask import Blueprint, request, jsonify, session
from backend.models import User
from backend.extensions import db
import os

user_bp = Blueprint('user', __name__)

@user_bp.route('/complete-onboarding', methods=['POST'])
def complete_onboarding():
    email = session.get('samlNameId')
    first_name = session.get('firstName')
    last_name = session.get('lastName')
    
    if not email:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.get_json()
    
    try:
        new_user = User(
            email=email,
            firstName=first_name,
            lastName=last_name,
            dorm_location=data.get('dorm_location'),
            topStyle=data.get('topStyle'),
            bottomStyle=data.get('bottomStyle'),
            height=data.get('height'),
            weight=data.get('weight'),
            profile_pic=data.get('profile_pic')
        )
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({'success': True}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
        
@user_bp.route('/test-onboarding', methods=['POST'])
def test_onboarding():
    if not os.getenv('ENABLE_MOCK_LOGIN'):
        return jsonify({'error': 'Not allowed'}), 403
    
    # Get email from request instead of session
    data = request.get_json()
    email = data.get('test_email', 'test@stanford.edu')
    first_name = data.get('firstName', 'Test')
    last_name = data.get('lastName', 'User')
    
    try:
        # Check if user already exists
        existing = User.query.filter_by(email=email).first()
        if existing:
            return jsonify({'error': 'User already exists', 'user': {
                'email': existing.email,
                'firstName': existing.firstName
            }}), 400
        
        new_user = User(
            email=email,
            firstName=first_name,
            lastName=last_name,
            dorm_location=data.get('dorm_location'),
            topStyle=data.get('topStyle'),
            bottomStyle=data.get('bottomStyle'),
            height=data.get('height'),
            weight=data.get('weight'),
            profile_pic=data.get('profile_pic')
        )
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'user': {
                'id': new_user.id,
                'email': new_user.email,
                'firstName': new_user.firstName,
                'lastName': new_user.lastName,
                'dorm_location': new_user.dorm_location,
                'topStyle': new_user.topStyle,
            }
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500