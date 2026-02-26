from flask import Blueprint, request, jsonify, session, current_app
from backend.models import BorrowRequest, Item, User
from backend.extensions import db
from datetime import datetime
from flask_mail import Message, Mail

borrow_bp = Blueprint('borrow', __name__)

def send_borrow_request_email(lender_email, lender_name, borrower_name, item_name, start_date, end_date):
    """Send email notification to lender about new borrow request"""
    try:
        from flask import current_app
        mail = current_app.extensions.get('mail')
        
        if not mail:
            print("❌ Flask-Mail not initialized")
            return False
        
        import os
        msg = Message(
            subject=f"New Borrow Request for {item_name}",
            recipients=[lender_email],
            html=f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">New Borrow Request</h2>
                <p>Hi {lender_name},</p>
                <p><strong>{borrower_name}</strong> has requested to borrow your item:</p>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">{item_name}</h3>
                    <p><strong>Rental Period:</strong></p>
                    <p>{datetime.strptime(start_date, '%Y-%m-%d').strftime('%B %d, %Y')} to {datetime.strptime(end_date, '%Y-%m-%d').strftime('%B %d, %Y')}</p>
                </div>
                
                <p>You can approve or reject this request in your profile:</p>
                <a href="{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/profile" 
                style="display: inline-block; background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; font-size: 16px; text-align: center;">
                    View Request
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


@borrow_bp.route('/borrow-requests', methods=['POST'])
def create_borrow_request():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.get_json()
    item_id = data.get('item_id')
    
    item = Item.query.get(item_id)
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    if item.owner_id == user_id:
        return jsonify({'error': 'Cannot borrow your own item'}), 400
    
    # Check no pending request already exists
    existing = BorrowRequest.query.filter_by(
        item_id=item_id, 
        borrower_id=user_id, 
        status='pending'
    ).first()
    if existing:
        return jsonify({'error': 'Request already pending'}), 400

    borrow_request = BorrowRequest(
        item_id=item_id,
        borrower_id=user_id,
        status='pending',
        start_date=data.get('start_date'),
        end_date=data.get('end_date')
    )
    db.session.add(borrow_request)
    db.session.commit()
    
    # Get lender and borrower details for email
    lender = User.query.get(item.owner_id)
    borrower = User.query.get(user_id)
    borrower_name = f"{borrower.firstName} {borrower.lastName}"
    
    # Send email notification (won't fail the request if email fails)
    send_borrow_request_email(
        lender_email=lender.email,
        lender_name=lender.firstName,
        borrower_name=borrower_name,
        item_name=item.item_name,
        start_date=data.get('start_date'),
        end_date=data.get('end_date')
    )
    
    return jsonify({'success': True, 'id': borrow_request.id}), 201


@borrow_bp.route('/borrow-requests', methods=['GET'])
def get_borrow_requests():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    
    # Requests user sent
    outgoing = BorrowRequest.query.filter_by(borrower_id=user_id).all()
    
    # Requests for items user owns
    owned_item_ids = [item.id for item in Item.query.filter_by(owner_id=user_id).all()]
    incoming = BorrowRequest.query.filter(
        BorrowRequest.item_id.in_(owned_item_ids)
    ).all() if owned_item_ids else []
    
    def serialize(r):
        return {
            'id': r.id,
            'item_id': r.item_id,
            'item_name': r.item.item_name,
            'borrower_id': r.borrower_id,
            'borrower_name': f"{r.borrower.firstName} {r.borrower.lastName}",
            'status': r.status,
            'start_date': r.start_date.isoformat() if r.start_date else None,
            'end_date': r.end_date.isoformat() if r.end_date else None,
            'created_at': r.created_at.isoformat()
        }
    
    return jsonify({
        'incoming': [serialize(r) for r in incoming],
        'outgoing': [serialize(r) for r in outgoing]
    }), 200


@borrow_bp.route('/borrow-requests/<int:request_id>', methods=['PATCH'])
def update_borrow_request(request_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    
    borrow_request = BorrowRequest.query.get(request_id)
    if not borrow_request:
        return jsonify({'error': 'Request not found'}), 404
    
    item = Item.query.get(borrow_request.item_id)
    new_status = request.get_json().get('status')
    
    # Only item owner can approve/reject, only borrower can cancel
    if new_status in ['approved', 'rejected'] and item.owner_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    if new_status == 'cancelled' and borrow_request.borrower_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    valid_statuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled']
    if new_status not in valid_statuses:
        return jsonify({'error': 'Invalid status'}), 400
    
    borrow_request.status = new_status
    db.session.commit()
    
    return jsonify({'success': True, 'status': new_status}), 200