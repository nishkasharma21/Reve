from flask import Flask, session, jsonify, request
from flask_cors import CORS
from backend.extensions import db, migrate
from backend.saml import saml_bp
from backend.routes.waitlist import waitlist_bp
from backend.routes.user import user_bp
from backend.models import User, Item, BorrowRequest
from backend.routes.borrowrequest import borrow_bp
from flask_mail import Mail, Message
import os
from datetime import datetime

SAML_PROD_FRONTEND_URL = os.getenv('SAML_PROD_FRONTEND_URL', 'http://localhost:3000')

def create_app():
    app = Flask(__name__)
    
    is_prod = os.environ.get('FLASK_ENV') == 'production'

    # ── CORS ──────────────────────────────────────────────────────────────────
    CORS(app, 
         supports_credentials=True, 
         origins=['http://localhost:3000', 'http://localhost:5173', 'https://goreve.store'])

    # Session configurations
    app.config['SESSION_COOKIE_SECURE'] = True  # Required for HTTPS
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Critical for cross-origin
    app.config['SESSION_COOKIE_DOMAIN'] = None  # Let Flask handle it

    # Email configuration
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY') or os.environ.get('SECRET_KEY')
    uri = os.environ.get("DATABASE_URL")
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = uri or "sqlite:///app.db"    
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ── Extensions ────────────────────────────────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)
    mail = Mail(app)  # Initialize Mail with app

    # ── Blueprints ────────────────────────────────────────────────────────────
    app.register_blueprint(saml_bp, url_prefix="/saml")
    app.register_blueprint(waitlist_bp, url_prefix="/api")
    app.register_blueprint(user_bp, url_prefix="/api/user")
    app.register_blueprint(borrow_bp, url_prefix='/api')

    # ── Email Function ────────────────────────────────────────────────────────
    def send_borrow_request_email(lender_email, lender_name, borrower_name, item_name, start_date, end_date):
        """Send email notification to lender about new borrow request"""
        try:
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
                        <p>{start_date} to {end_date}</p>
                    </div>
                    
                    <p>You can approve or reject this request in your profile:</p>
                    <a href="{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/profile" 
                    style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                        View Request
                    </a>
                    
                    <p style="color: #666; font-size: 14px; margin-top: 30px;">
                        This is an automated message from Campus Closet. Please do not reply to this email.
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

    @app.route('/api/items', methods=['POST', 'GET'])
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
        
    @app.route('/api/items/<int:item_id>', methods=['GET'])
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
            'brand': item.brand,
            'condition': item.condition,
            'price_per_day': item.price_per_day,
            'owner_id': item.owner_id,
            'owner_name': f"{owner.firstName} {owner.lastName}",
        }), 200
    
    @app.route('/api/my-items', methods=['GET'])
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
        
    @app.after_request
    def debug_cors(response):
        print(f"[CORS] {request.method} {request.path} → {response.headers.get('Access-Control-Allow-Origin')}")
        return response
    
    @app.route('/api/borrow-requests', methods=['POST'])
    def create_borrow_request():
        """Create a new borrow request and send email to lender"""
        
        # Check if user is authenticated
        if 'user_id' not in session:
            return jsonify({'error': 'Not authenticated'}), 401
        
        data = request.json
        item_id = data.get('item_id')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        borrower_id = session['user_id']
        
        # Validate data
        if not all([item_id, start_date, end_date]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        try:
            # Get item and lender details using SQLAlchemy
            item = Item.query.get(item_id)
            
            if not item:
                return jsonify({'error': 'Item not found'}), 404
            
            # Check if user is trying to borrow their own item
            if item.owner_id == borrower_id:
                return jsonify({'error': 'Cannot borrow your own item'}), 400
            
            # Get lender (owner) details
            lender = User.query.get(item.owner_id)
            
            # Get borrower details
            borrower = User.query.get(borrower_id)
            borrower_name = f"{borrower.firstName} {borrower.lastName}"
            
            # Create borrow request
            new_request = BorrowRequest(
                item_id=item_id,
                borrower_id=borrower_id,
                start_date=datetime.strptime(start_date, '%Y-%m-%d').date(),
                end_date=datetime.strptime(end_date, '%Y-%m-%d').date(),
                status='pending'
            )
            
            db.session.add(new_request)
            db.session.commit()
            
            # Send email notification (non-blocking - won't fail the request if email fails)
            send_borrow_request_email(
                lender_email=lender.email,
                lender_name=lender.firstName,
                borrower_name=borrower_name,
                item_name=item.item_name,
                start_date=start_date,
                end_date=end_date
            )
            
            return jsonify({
                'message': 'Borrow request created successfully',
                'request_id': new_request.id
            }), 201
            
        except Exception as e:
            db.session.rollback()
            print(f"Error creating borrow request: {e}")
            return jsonify({'error': 'Failed to create borrow request'}), 500
        
    @app.route('/api/test-email')
    def test_email():
        send_borrow_request_email(
            lender_email="your-test-email@gmail.com",  # Change to your email
            lender_name="Test User",
            borrower_name="John Doe",
            item_name="Test Item",
            start_date="2025-03-01",
            end_date="2025-03-05"
        )
        return "Email sent! Check your inbox."

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)