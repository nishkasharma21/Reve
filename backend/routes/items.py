from flask import Blueprint, request, jsonify, session
from backend.models import Item, User, Rental, ItemUnavailability
from backend.extensions import db
from datetime import datetime, date

items_bp = Blueprint('items', __name__)

@items_bp.route('/items', methods=['POST', 'GET'])
def create_item():
    if request.method == 'GET':
        items = Item.query.filter_by(available=True).order_by(Item.created_at.desc()).all()
        return jsonify([{
            "id": item.id,
            "item_name": item.item_name,
            "description": item.description,
            "category": item.category,
            "size": item.size,
            "brand": item.brand,
            "condition": item.condition,
            "price_per_day": item.price_per_day,
            "images": item.images,
            "available": item.available,
            "created_at": item.created_at.isoformat()
        } for item in items])

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "You must be logged in to list an item"}), 401

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        new_item = Item(
            owner_id=user_id,
            item_name=data.get('item_name'),
            description=data.get('description'),
            category=data.get('category'),
            size=data.get('size'),
            brand=data.get('brand'),
            condition=data.get('condition'),
            price_per_day=int(data.get('price_per_day', 0)),
            link=data.get('link'),
            images=data.get('images', []),
            available=True
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"message": "Item listed successfully!", "id": new_item.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Could not create item. Check all fields."}), 400


@items_bp.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = Item.query.get(item_id)
    if not item:
        return jsonify({'error': 'Not found'}), 404

    today = date.today()
    active_block = ItemUnavailability.query.filter(
        ItemUnavailability.item_id == item_id,
        ItemUnavailability.start_date <= today,
        ItemUnavailability.end_date >= today
    ).first()

    item.available = active_block is None
    db.session.commit()

    owner = User.query.get(item.owner_id)
    return jsonify({
        'id': item.id,
        'item_name': item.item_name,
        'description': item.description,
        'category': item.category,
        'size': item.size,
        'images': item.images,
        'available': item.available,
        'link': item.link,
        'brand': item.brand,
        'condition': item.condition,
        'price_per_day': item.price_per_day,
        'owner_id': item.owner_id,
        'owner_name': f"{owner.firstName} {owner.lastName}",
        'unavailability_blocks': [
            {'id': b.id, 'start_date': b.start_date.isoformat(), 'end_date': b.end_date.isoformat()}
            for b in item.unavailability_blocks
        ],
    }), 200


@items_bp.route('/my-items', methods=['GET'])
def get_my_items():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "You must be logged in"}), 401

    today = date.today()
    items = Item.query.filter_by(owner_id=user_id).order_by(Item.created_at.desc()).all()

    for item in items:
        active_block = ItemUnavailability.query.filter(
            ItemUnavailability.item_id == item.id,
            ItemUnavailability.start_date <= today,
            ItemUnavailability.end_date >= today
        ).first()
        item.available = active_block is None

    db.session.commit()

    return jsonify([{
        "id": item.id,
        "owner_id": item.owner_id,
        "item_name": item.item_name,
        "description": item.description,
        "category": item.category,
        "size": item.size,
        "brand": item.brand,
        "condition": item.condition,
        "price_per_day": item.price_per_day,
        "images": item.images,
        "available": item.available,
        "created_at": item.created_at.isoformat()
    } for item in items])


@items_bp.route('/browse-items', methods=['GET'])
def get_browse_items():
    user_id = session.get('user_id')

    # Fetch all candidate items first, then recompute availability before filtering
    if user_id:
        items = Item.query.filter(Item.owner_id != user_id).order_by(Item.created_at.desc()).all()
    else:
        items = Item.query.order_by(Item.created_at.desc()).all()

    # Recompute from blocks so expired blocks flip items back to available
    today = date.today()
    for item in items:
        active_block = ItemUnavailability.query.filter(
            ItemUnavailability.item_id == item.id,
            ItemUnavailability.start_date <= today,
            ItemUnavailability.end_date >= today
        ).first()
        item.available = active_block is None
    db.session.commit()

    available_items = [item for item in items if item.available]

    return jsonify([{
        "id": item.id,
        "owner_id": item.owner_id,
        "item_name": item.item_name,
        "description": item.description,
        "category": item.category,
        "size": item.size,
        "brand": item.brand,
        "condition": item.condition,
        "price_per_day": item.price_per_day,
        "images": item.images,
        "available": item.available,
        "created_at": item.created_at.isoformat()
    } for item in available_items])


@items_bp.route('/items/<int:item_id>/block', methods=['POST'])
def block_dates(item_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401

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


@items_bp.route('/items/block/<int:block_id>', methods=['PATCH'])
def update_block(block_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401

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


@items_bp.route('/items/block/<int:block_id>', methods=['DELETE'])
def unblock_dates(block_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401

    block = ItemUnavailability.query.get_or_404(block_id)
    item = Item.query.get(block.item_id)
    if item.owner_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(block)
    db.session.commit()
    return jsonify({'message': 'Dates unblocked'}), 200