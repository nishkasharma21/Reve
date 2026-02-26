
from flask import Blueprint, request, jsonify, session
from backend.models import Item, User, BorrowRequest
from backend.extensions import db
from datetime import datetime

items_bp = Blueprint('items', __name__)

@items_bp.route('/items', methods=['POST', 'GET'])
def create_item():
    # GET
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

    # POST
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
        print(f"Error creating item: {str(e)}")
        return jsonify({"error": "Could not create item. Check all fields."}), 400
    
@items_bp.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = Item.query.get(item_id)
    if not item:
        return jsonify({'error': 'Not found'}), 404
    
    owner = User.query.get(item.owner_id)
    return jsonify({
        'id': item.id,
        'item_name': item.item_name,
        'description': item.description,
        'category': item.category,
        'size': item.size,
        'images': item.images,
        'available': item.available,
        "link": item.link,
        'brand': item.brand,
        'condition': item.condition,
        'price_per_day': item.price_per_day,
        'owner_id': item.owner_id,
        'owner_name': f"{owner.firstName} {owner.lastName}",
    }), 200

@items_bp.route('/my-items', methods=['GET'])
def get_my_items():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "You must be logged in"}), 401
    
    # Get all items where owner_id matches the current user
    items = Item.query.filter_by(owner_id=user_id).order_by(Item.created_at.desc()).all()
    
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
    
    # Get IDs of items that are currently being borrowed (approved status)
    # borrowed_item_ids = db.session.query(BorrowRequest.item_id).filter(
    #     BorrowRequest.status == 'approved'
    # ).distinct().all()
    # borrowed_item_ids = [item_id[0] for item_id in borrowed_item_ids]
    
    # Get all available items NOT owned by current user and NOT currently borrowed
    if user_id:
        items = Item.query.filter(
            Item.available == True,
            Item.owner_id != user_id,
            #~Item.id.in_(borrowed_item_ids)  # Exclude borrowed items
        ).order_by(Item.created_at.desc()).all()
    else:
        # If not logged in, show all items except borrowed ones
        items = Item.query.filter(
            Item.available == True,
            ~Item.id.in_(borrowed_item_ids)  # Exclude borrowed items
        ).order_by(Item.created_at.desc()).all()
    
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