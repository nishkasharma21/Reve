from flask import Blueprint, request, jsonify, session, current_app
from backend.models import Item, User, Rental
from backend.extensions import db
from backend.utils import login_required
import os
import stripe

stripe.api_key = os.getenv('STRIPE_SECRET_KEY', '').strip()

rental_bp = Blueprint('rental', __name__)


def send_borrower_return_email(borrower_email, borrower_name, item_name, rental_id, lender_name):
    try:
        mail = current_app.extensions.get('mail')
        if not mail:
            return False
        from flask_mail import Message
        msg = Message(
            subject=f"Your rental of {item_name} has started",
            recipients=[borrower_email],
            html=f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Pickup confirmed</h2>
                <p>Hi {borrower_name},</p>
                <p>Your rental of <strong>{item_name}</strong> from <strong>{lender_name}</strong> is now active.</p>
                <p>When you return the item, tap the button below to enter the lender's return code and confirm the return.</p>
                <a href="{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/rentals/{rental_id}/confirm-return"
                style="display: inline-block; background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; font-size: 16px;">
                    Confirm Return
                </a>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    This is an automated message from Reve. Please do not reply to this email.
                </p>
            </div>
            """
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"❌ Failed to send borrower return email: {e}")
        return False


def send_borrower_confirmation_email(borrower_email, borrower_name, item_name, pickup_code, start_date, end_date, lender_name):
    try:
        mail = current_app.extensions.get('mail')
        if not mail:
            return False
        from flask_mail import Message
        msg = Message(
            subject=f"Your rental of {item_name} is confirmed",
            recipients=[borrower_email],
            html=f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Rental confirmed</h2>
                <p>Hi {borrower_name},</p>
                <p>Your rental of <strong>{item_name}</strong> from <strong>{lender_name}</strong> is confirmed.</p>
                <p><strong>Dates:</strong> {start_date} → {end_date}</p>
                <p>Show this pickup code to the lender when you meet:</p>
                <div style="background: #000; color: #fff; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                    <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Pickup Code</p>
                    <p style="margin: 0; font-size: 48px; font-weight: bold; letter-spacing: 12px;">{pickup_code}</p>
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    This is an automated message from Reve. Please do not reply to this email.
                </p>
            </div>
            """
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"❌ Failed to send borrower confirmation email: {e}")
        return False


def send_rental_email(lender_email, lender_name, borrower_name, item_name, rental_id):
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
                <p>When you meet for pickup, tap the button below to enter the borrower's code and confirm the handoff.</p>
                <a href="{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/rentals/{rental_id}/confirm-pickup"
                style="display: inline-block; background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; font-size: 16px;">
                    Confirm Pickup
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


def _calculate_days(start_date_str, end_date_str):
    from datetime import date
    start = date.fromisoformat(start_date_str)
    end = date.fromisoformat(end_date_str)
    return max((end - start).days, 1)


@rental_bp.route('/rentals', methods=['POST'])
@login_required
def create_rental():
    user_id = session.get('user_id')
    data = request.get_json()
    item_id = data.get('item_id')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    item = db.session.get(Item, item_id)
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    if item.owner_id == user_id:
        return jsonify({'error': 'Cannot rent your own item'}), 400
    if not item.available:
        return jsonify({'error': 'Item is not available'}), 400

    days = _calculate_days(start_date, end_date)
    total_cents = days * item.price_per_day * 100  # price_per_day is in dollars

    # Create a PaymentIntent with manual capture so the card is authorized now
    # and charged only when the lender confirms pickup.
    try:
        borrower = db.session.get(User, user_id)
        lender = db.session.get(User, item.owner_id)
        intent_params = dict(
            amount=total_cents,
            currency='usd',
            capture_method='manual',
            metadata={
                'item_id': item_id,
                'borrower_id': user_id,
                'owner_id': item.owner_id,
                'start_date': start_date,
                'end_date': end_date,
                'item_name': item.item_name,
                'borrower_email': borrower.email,
            },
            description=f"Reve rental: {item.item_name} ({start_date} to {end_date})",
        )
        if lender.stripe_account_id:
            try:
                acct = stripe.Account.retrieve(lender.stripe_account_id)
                if acct.charges_enabled:
                    intent_params['transfer_data'] = {'destination': lender.stripe_account_id}
                    intent_params['application_fee_amount'] = 0  # platform takes no cut for now
            except stripe.StripeError:
                pass  # fall through and charge to platform account
        intent = stripe.PaymentIntent.create(**intent_params)
    except stripe.StripeError as e:
        return jsonify({'error': str(e)}), 400

    pickup_code = Rental.generate_code()
    return_code = Rental.generate_code()

    rental = Rental(
        item_id=item_id,
        borrower_id=user_id,
        owner_id=item.owner_id,
        status='pending_pickup',
        pickup_code=pickup_code,
        return_code=return_code,
        start_date=start_date,
        end_date=end_date,
        payment_intent_id=intent.id,
        total_amount=total_cents,
    )

    item.available = False
    db.session.add(rental)
    db.session.commit()

    send_rental_email(
        lender_email=lender.email,
        lender_name=lender.firstName,
        borrower_name=f"{borrower.firstName} {borrower.lastName}",
        item_name=item.item_name,
    )
    send_borrower_confirmation_email(
        borrower_email=borrower.email,
        borrower_name=borrower.firstName,
        item_name=item.item_name,
        pickup_code=pickup_code,
        start_date=start_date,
        end_date=end_date,
        lender_name=lender.firstName,
    )

    return jsonify({
        'success': True,
        'id': rental.id,
        'pickup_code': pickup_code,
        'client_secret': intent.client_secret,
        'total_amount': total_cents,
    }), 201


@rental_bp.route('/rentals/<int:rental_id>', methods=['GET'])
@login_required
def get_rental(rental_id):
    user_id = session.get('user_id')
    rental = db.session.get(Rental, rental_id)
    if not rental:
        return jsonify({'error': 'Rental not found'}), 404
    if rental.borrower_id != user_id and rental.owner_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    return jsonify({
        'id': rental.id,
        'item_name': rental.item.item_name,
        'item_image': rental.item.images[0] if rental.item.images else None,
        'owner_name': f"{rental.owner.firstName} {rental.owner.lastName}",
        'borrower_name': f"{rental.borrower.firstName} {rental.borrower.lastName}",
        'status': rental.status,
        'pickup_code': rental.pickup_code if rental.borrower_id == user_id else None,
        'start_date': rental.start_date.isoformat() if rental.start_date else None,
        'end_date': rental.end_date.isoformat() if rental.end_date else None,
        'total_amount': rental.total_amount,
    }), 200


@rental_bp.route('/rentals', methods=['GET'])
@login_required
def get_rentals():
    user_id = session.get('user_id')

    borrowed = Rental.query.filter_by(borrower_id=user_id).order_by(Rental.created_at.desc()).all()
    lent = Rental.query.filter_by(owner_id=user_id).order_by(Rental.created_at.desc()).all()

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
            'total_amount': r.total_amount,
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
            'total_amount': r.total_amount,
            'created_at': r.created_at.isoformat(),
        }

    return jsonify({
        'borrowed': [serialize_borrowed(r) for r in borrowed],
        'lent': [serialize_lent(r) for r in lent],
    }), 200


@rental_bp.route('/rentals/<int:rental_id>/confirm-pickup', methods=['POST'])
@login_required
def confirm_pickup(rental_id):
    user_id = session.get('user_id')
    rental = db.session.get(Rental, rental_id)
    if not rental:
        return jsonify({'error': 'Rental not found'}), 404
    if rental.owner_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    if rental.status != 'pending_pickup':
        return jsonify({'error': 'Rental is not pending pickup'}), 400

    code = request.get_json().get('code')
    if code != rental.pickup_code:
        return jsonify({'error': 'Incorrect pickup code'}), 400

    # Capture the Stripe PaymentIntent — this is when the borrower's card is charged
    if rental.payment_intent_id:
        try:
            stripe.PaymentIntent.capture(rental.payment_intent_id)
        except stripe.StripeError as e:
            return jsonify({'error': f'Payment capture failed: {str(e)}'}), 400

    rental.update_status('in_use')
    db.session.commit()
    send_borrower_return_email(
        borrower_email=rental.borrower.email,
        borrower_name=rental.borrower.firstName,
        item_name=rental.item.item_name,
        rental_id=rental_id,
        lender_name=rental.owner.firstName,
    )
    return jsonify({'success': True, 'status': 'in_use'}), 200


@rental_bp.route('/rentals/<int:rental_id>/confirm-return', methods=['POST'])
@login_required
def confirm_return(rental_id):
    user_id = session.get('user_id')
    rental = db.session.get(Rental, rental_id)
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
    db.session.commit()
    return jsonify({'success': True, 'status': 'returned'}), 200


@rental_bp.route('/rentals/<int:rental_id>/cancel', methods=['PATCH'])
@login_required
def cancel_rental(rental_id):
    user_id = session.get('user_id')
    rental = db.session.get(Rental, rental_id)
    if not rental:
        return jsonify({'error': 'Rental not found'}), 404
    if rental.owner_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    if rental.status not in ('pending_pickup', 'in_use'):
        return jsonify({'error': 'Cannot cancel this rental'}), 400

    # Cancel the PaymentIntent so the authorization is released (no charge)
    if rental.payment_intent_id and rental.status == 'pending_pickup':
        try:
            stripe.PaymentIntent.cancel(rental.payment_intent_id)
        except stripe.StripeError as e:
            print(f"⚠️  Could not cancel PaymentIntent: {e}")

    rental.update_status('cancelled')
    db.session.commit()
    return jsonify({'success': True, 'status': 'cancelled'}), 200
