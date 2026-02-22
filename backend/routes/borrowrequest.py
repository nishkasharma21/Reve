from flask import Blueprint, request, jsonify, session
from backend.models import BorrowRequest, Item, User
from backend.extensions import db
from datetime import datetime

borrow_bp = Blueprint('borrow', __name__)

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