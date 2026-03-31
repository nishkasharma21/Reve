from flask import Blueprint, request, jsonify, session
from backend.models import Item, User, Rental
from backend.extensions import db
from backend.utils import login_required, serialize_item, is_item_available_on_date
from datetime import date

items_bp = Blueprint('items', __name__)


@items_bp.route('/items', methods=['POST', 'GET'])
def handle_items():
    if request.method == 'GET':
        items = Item.query.order_by(Item.created_at.desc()).all()
        today = date.today()
        available = [item for item in items if is_item_available_on_date(item.id, today)]
        return jsonify([serialize_item(item) for item in available])

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
    item = db.session.get(Item, item_id)
    if not item:
        return jsonify({'error': 'Not found'}), 404

    today = date.today()
    owner = db.session.get(User, item.owner_id)
    return jsonify({
        **serialize_item(item),
        'available': is_item_available_on_date(item.id, today),
        'link': item.link,
        'owner_name': f"{owner.firstName} {owner.lastName}",
        'unavailability_blocks': [
            {'id': b.id, 'start_date': b.start_date.isoformat(), 'end_date': b.end_date.isoformat()}
            for b in item.unavailability_blocks
        ],
        'active_rentals': [
            {'start_date': r.start_date.isoformat(), 'end_date': r.end_date.isoformat()}
            for r in Rental.query.filter(
                Rental.item_id == item_id,
                Rental.status.in_(['pending_pickup', 'in_use']),
                Rental.start_date != None,
                Rental.end_date != None,
            ).all()
        ],
    }), 200


@items_bp.route('/my-items', methods=['GET'])
@login_required
def get_my_items():
    user_id = session.get('user_id')
    today = date.today()
    items = Item.query.filter_by(owner_id=user_id).order_by(Item.created_at.desc()).all()
    return jsonify([
        {**serialize_item(item), 'available': is_item_available_on_date(item.id, today)}
        for item in items
    ])


@items_bp.route('/browse-items', methods=['GET'])
def get_browse_items():
    user_id = session.get('user_id')
    today = date.today()

    query = Item.query
    if user_id:
        query = query.filter(Item.owner_id != user_id)

    items = query.order_by(Item.created_at.desc()).all()
    available = [item for item in items if is_item_available_on_date(item.id, today)]
    return jsonify([serialize_item(item) for item in available])