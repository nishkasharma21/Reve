from functools import wraps
from flask import session, jsonify


def login_required(f):
    """Decorator that returns 401 if the user is not logged in."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('user_id'):
            return jsonify({"error": "You must be logged in"}), 401
        return f(*args, **kwargs)
    return decorated


def serialize_item(item):
    """Serialize an Item model to a dict. Used across items and browse routes."""
    return {
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
        "created_at": item.created_at.isoformat(),
    }

def is_item_available_on_date(item_id, check_date):
    rental_conflict = Rental.query.filter(
        Rental.item_id == item_id,
        Rental.status.in_(['pending_pickup', 'in_use']),
        Rental.start_date <= check_date,
        Rental.end_date >= check_date
    ).first()

    block_conflict = ItemUnavailability.query.filter(
        ItemUnavailability.item_id == item_id,
        ItemUnavailability.start_date <= check_date,
        ItemUnavailability.end_date >= check_date
    ).first()

    return rental_conflict is None and block_conflict is None