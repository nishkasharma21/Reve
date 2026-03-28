from backend.extensions import db
from sqlalchemy import func
from datetime import datetime
import random
import string


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    
    email = db.Column(db.String(120), unique=True, nullable=False)
    firstName = db.Column(db.String(100), nullable=False)
    lastName = db.Column(db.String(100), nullable=False)
    profile_pic = db.Column(db.String(255))
    dorm_location = db.Column(db.String(100))
    stripe_account_id = db.Column(db.String(64), nullable=True)
    
    created_at = db.Column(db.DateTime, server_default=func.now())
    
    # Onboarding Fields 
    topStyle = db.Column(db.String(100), nullable=True)
    bottomStyle = db.Column(db.String(100), nullable=True)
    height = db.Column(db.String(50), nullable=True)
    weight = db.Column(db.String(50), nullable=True)
    
    # Relationships
    items = db.relationship('Item', backref='owner', lazy=True)
    rentals_as_borrower = db.relationship('Rental', foreign_keys='Rental.borrower_id', lazy=True)
    rentals_as_owner = db.relationship('Rental', foreign_keys='Rental.owner_id', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'


class Item(db.Model):
    __tablename__ = 'items'
    
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False)
    size = db.Column(db.String(20), nullable=False)
    images = db.Column(db.JSON, nullable=False)
    available = db.Column(db.Boolean, default=True)
    brand = db.Column(db.String(50))
    condition = db.Column(db.String(50), nullable=False)
    price_per_day = db.Column(db.Integer, nullable=False)
    link = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=func.now())

    unavailability_blocks = db.relationship('ItemUnavailability', backref='item', lazy=True)  # NEW

    def __repr__(self):
        return f'<Item {self.item_name}>'


class ItemUnavailability(db.Model):  # NEW
    __tablename__ = 'item_unavailability'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())


class Rental(db.Model):
    __tablename__ = 'rentals'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign keys
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    borrower_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Status: pending_pickup, in_use, returned, cancelled
    status = db.Column(db.String(20), default='pending_pickup')
    
    # Pickup code — borrower shows to lender to confirm handoff
    # Return code — lender shows to borrower to confirm return
    pickup_code = db.Column(db.String(4), nullable=True)
    return_code = db.Column(db.String(4), nullable=True)
    
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, server_default=func.now())

    # Relationships
    borrower = db.relationship('User', foreign_keys=[borrower_id])
    owner = db.relationship('User', foreign_keys=[owner_id])
    item = db.relationship('Item', foreign_keys=[item_id])

    @staticmethod
    def generate_code():
        return ''.join(random.choices(string.digits, k=4))

    def update_status(self, new_status):
        self.status = new_status
        if new_status in ('returned', 'cancelled'):
            self.item.available = True

    def __repr__(self):
        return f'<Rental {self.id} - {self.status}>'


class Conversation(db.Model):
    __tablename__ = 'conversations'
    
    id = db.Column(db.Integer, primary_key=True)
    
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'))
    participant1_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    participant2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    last_message_at = db.Column(db.DateTime)
    
    messages = db.relationship('Message', backref='conversation', lazy=True)

    def __repr__(self):
        return f'<Conversation {self.id}>'


class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())

    def __repr__(self):
        return f'<Message {self.id}>'


class Waitlist(db.Model):
    __tablename__ = 'waitlist'
    
    id = db.Column(db.Integer, primary_key=True)
    
    firstName = db.Column(db.String(100), nullable=False)
    lastName = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    
    created_at = db.Column(db.DateTime, server_default=func.now())

    def __repr__(self):
        return f'<Waitlist {self.id}>'


class WaitlistEmail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)

    def __repr__(self):
        return f"<WaitlistEmail {self.email}>"