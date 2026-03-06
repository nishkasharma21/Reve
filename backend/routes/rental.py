from flask import Blueprint, request, jsonify, session, current_app
from backend.models import Item, User, Rental, ItemUnavailability
from backend.extensions import db
from datetime import datetime
import os

rental_bp = Blueprint('rental', __name__)


def send_rental_email(lender_email, lender_name, borrower_name, item_name):
    try:
        mail = current_app.extensions.get('mail')
        if not mail:
            print("❌ Flask-Mail not initialized")
            return False
        
        from flask_mail import Message
        msg = Message(
            subject=f"{borrower_name} has rented your {item_name}",
            recipients=[lender_email],
            html=f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Your item has been rented</h2>
                <p>Hi {lender_name},</p>
                <p><strong>{borrower_name}</strong> has rented your item <strong>{item_name}</strong>.</p>
                <p>Head to your messages to arrange a pickup time and location.</p>
                <a href="{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/messages" 
                style="display: inline-block; background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; font-size: 16px;">
                    Go to Messages
                </a>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    This is an automated message from Reve. Please do not reply to this email.
                </p>
            </div>
            """
        )
        mail.send(msg)
        print(f"✅ Email sent to {lender_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False


@rental_bp.route('/rentals', methods=['POST'])
def create_rental():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401

    data = request.get_json()
    item_id = data.get('item_id')

    item = Item.query.get(item_id)
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    if item.owner_id == user_id:
        return jsonify({'error': 'Cannot rent your own item'}), 400
    if not item.available:
        return jsonify({'error': 'Item is not available'}), 400

    pickup_code = Rental.generate_code()
    return_code = Rental.generate_code()

    start_date = data.get('start_date')
    end_date = data.get('end_date')

    rental = Rental(
        item_id=item_id,
        borrower_id=user_id,
        owner_id=item.owner_id,
        status='pending_pickup',
        pickup_code=pickup_code,
        return_code=return_code,
        start_date=start_date,
        end_date=end_date,
    )

    item.available = False
    db.session.add(rental)

    # Create an unavailability block for the rental period so the
    # block-based availability check in items.py stays in sync
    if start_date and end_date:
        start = datetime.strptime(start_date, '%Y-%m-%d').date()
        end   = datetime.strptime(end_date,   '%Y-%m-%d').date()
        db.session.add(ItemUnavailability(item_id=item_id, start_date=start, end_date=end))

    db.session.commit()

    # Send email to lender
    lender = User.query.get(item.owner_id)
    borrower = User.query.get(user_id)
    send_rental_email(
        lender_email=lender.email,
        lender_name=lender.firstName,
        borrower_name=f"{borrower.firstName} {borrower.lastName}",
        item_name=item.item_name,
    )

    return jsonify({
        'success': True,
        'id': rental.id,
        'pickup_code': pickup_code,
    }), 201


@rental_bp.route('/rentals', methods=['GET'])
def get_rentals():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401

    borrowed = Rental.query.filter_by(borrower_id=user_id)\
        .order_by(Rental.created_at.desc()).all()

    lent = Rental.query.filter_by(owner_id=user_id)\
        .order_by(Rental.created_at.desc()).all()

    def serialize_borrowed(r):
        return {
            'id': r.id,
            'item_id': r.item_id,
            'item_name': r.item.item_name,
            'item_image': r.item.images[0] if r.item.images else None,
            'owner_name': f"{r.owner.firstName} {r.owner.lastName}",
            'status': r.status,
            'pickup_code': r.pickup_code,
            'start_date': r.start_date.isoformat() if r.start_date else None,
            'end_date': r.end_date.isoformat() if r.end_date else None,
            'created_at': r.created_at.isoformat(),
        }

    def serialize_lent(r):
        return {
            'id': r.id,
            'item_id': r.item_id,
            'item_name': r.item.item_name,
            'item_image': r.item.images[0] if r.item.images else None,
            'borrower_name': f"{r.borrower.firstName} {r.borrower.lastName}",
            'status': r.status,
            'return_code': r.return_code if r.status == 'in_use' else None,
            'start_date': r.start_date.isoformat() if r.start_date else None,
            'end_date': r.end_date.isoformat() if r.end_date else None,
            'created_at': r.created_at.isoformat(),
        }

    return jsonify({
        'borrowed': [serialize_borrowed(r) for r in borrowed],
        'lent': [serialize_lent(r) for r in lent],
    }), 200


@rental_bp.route('/rentals/<int:rental_id>/confirm-pickup', methods=['POST'])
def confirm_pickup(rental_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401

    rental = Rental.query.get(rental_id)
    if not rental:
        return jsonify({'error': 'Rental not found'}), 404
    if rental.owner_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    if rental.status != 'pending_pickup':
        return jsonify({'error': 'Rental is not pending pickup'}), 400

    code = request.get_json().get('code')
    if code != rental.pickup_code:
        return jsonify({'error': 'Incorrect pickup code'}), 400

    rental.update_status('in_use')
    db.session.commit()

    return jsonify({'success': True, 'status': 'in_use'}), 200


@rental_bp.route('/rentals/<int:rental_id>/confirm-return', methods=['POST'])
def confirm_return(rental_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401

    rental = Rental.query.get(rental_id)
    if not rental:
        return jsonify({'error': 'Rental not found'}), 404
    if rental.borrower_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    if rental.status != 'in_use':
        return jsonify({'error': 'Rental is not in use'}), 400

    code = request.get_json().get('code')
    if code != rental.return_code:
        return jsonify({'error': 'Incorrect return code'}), 400

    rental.update_status('returned')

    # Remove the rental's unavailability block and restore item availability
    if rental.start_date and rental.end_date:
        ItemUnavailability.query.filter_by(
            item_id=rental.item_id,
            start_date=rental.start_date,
            end_date=rental.end_date,
        ).delete()

    rental.item.available = True
    db.session.commit()

    return jsonify({'success': True, 'status': 'returned'}), 200


@rental_bp.route('/rentals/<int:rental_id>/cancel', methods=['PATCH'])
def cancel_rental(rental_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401

    rental = Rental.query.get(rental_id)
    if not rental:
        return jsonify({'error': 'Rental not found'}), 404
    if rental.owner_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    if rental.status not in ('pending_pickup', 'in_use'):
        return jsonify({'error': 'Cannot cancel this rental'}), 400

    rental.update_status('cancelled')

    # Remove the rental's unavailability block and restore item availability
    if rental.start_date and rental.end_date:
        ItemUnavailability.query.filter_by(
            item_id=rental.item_id,
            start_date=rental.start_date,
            end_date=rental.end_date,
        ).delete()

    rental.item.available = True
    db.session.commit()

    return jsonify({'success': True, 'status': 'cancelled'}), 200