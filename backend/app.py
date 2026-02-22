from flask import Flask, session, jsonify, request
from flask_cors import CORS
from backend.extensions import db, migrate
from backend.saml import saml_bp
from backend.routes.waitlist import waitlist_bp
from backend.routes.user import user_bp
from backend.models import User, Item
import os

SAML_PROD_FRONTEND_URL = os.getenv('SAML_PROD_FRONTEND_URL', 'http://localhost:3000')

def create_app():
    app = Flask(__name__)
    
    is_prod = os.environ.get('FLASK_ENV') == 'production'

    # ── CORS ──────────────────────────────────────────────────────────────────
    CORS(app, 
        supports_credentials=True, 
        origins=['http://localhost:3000', 'http://localhost:5173', 'https://goreve.store'])

    # ADD THESE SESSION CONFIGURATIONS
    app.config['SESSION_COOKIE_SECURE'] = True # Required for HTTPS
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'None' # Critical for cross-origin
    app.config['SESSION_COOKIE_DOMAIN'] = None # Let Flask handle it

    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY') or os.environ.get('SECRET_KEY')
    uri = os.environ.get("DATABASE_URL")
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = uri or "sqlite:///app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ── Database ──────────────────────────────────────────────────────────────
    uri = os.environ.get("DATABASE_URL", "sqlite:///app.db")
    if uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ── Extensions ────────────────────────────────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)

    # ── Blueprints ────────────────────────────────────────────────────────────
    app.register_blueprint(saml_bp, url_prefix="/saml")
    app.register_blueprint(waitlist_bp, url_prefix="/api")
    app.register_blueprint(user_bp, url_prefix="/api/user")

    # ── Routes ────────────────────────────────────────────────────────────────
    @app.route("/")
    def home():
        return "Hello, Flask!"

    @app.route("/api/profile")
    def get_current_user():
        print(f"[DEBUG] session in profile: {dict(session)}")
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Not authenticated"}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "joinDate": user.created_at.isoformat()
        })

    @app.route('/api/items', methods=['POST'])
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

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)