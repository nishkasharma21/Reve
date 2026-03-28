from flask import Blueprint, request, jsonify, session
from backend.models import Item, Rental, ItemUnavailability
from backend.extensions import db
from backend.utils import login_required
from datetime import datetime

item_blocks_bp = Blueprint('item_blocks', __name__)


@item_blocks_bp.route('/items/<int:item_id>/block', methods=['POST'])
@login_required
def block_dates(item_id):
    user_id = session.get('user_id')
    item = Item.query.get_or_404(item_id)
    if item.owner_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    start = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
    end = datetime.strptime(data['end_date'], '%Y-%m-%d').date()

    conflict = Rental.query.filter(
        Rental.item_id == item_id,
        Rental.status.in_(['pending_pickup', 'in_use']),
        Rental.start_date <= end,
        Rental.end_date >= start
    ).first()

    if conflict:
        return jsonify({'error': f'Item is rented from {conflict.start_date} to {conflict.end_date}'}), 409

    db.session.add(ItemUnavailability(item_id=item_id, start_date=start, end_date=end))
    db.session.commit()
    return jsonify({'message': 'Dates blocked'}), 201


@item_blocks_bp.route('/items/block/<int:block_id>', methods=['PATCH'])
@login_required
def update_block(block_id):
    user_id = session.get('user_id')
    block = ItemUnavailability.query.get_or_404(block_id)
    item = Item.query.get(block.item_id)
    if item.owner_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    start = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
    end = datetime.strptime(data['end_date'], '%Y-%m-%d').date()

    conflict = Rental.query.filter(
        Rental.item_id == block.item_id,
        Rental.status.in_(['pending_pickup', 'in_use']),
        Rental.start_date <= end,
        Rental.end_date >= start
    ).first()

    if conflict:
        return jsonify({'error': f'Item is rented from {conflict.start_date} to {conflict.end_date}'}), 409

    block.start_date = start
    block.end_date = end
    db.session.commit()
    return jsonify({'message': 'Block updated', 'id': block.id}), 200


@item_blocks_bp.route('/items/block/<int:block_id>', methods=['DELETE'])
@login_required
def unblock_dates(block_id):
    user_id = session.get('user_id')
    block = ItemUnavailability.query.get_or_404(block_id)
    item = Item.query.get(block.item_id)
    if item.owner_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(block)
    db.session.commit()
    return jsonify({'message': 'Dates unblocked'}), 200