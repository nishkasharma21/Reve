from backend.extensions import db
from sqlalchemy import func
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    # Primary key
    id = db.Column(db.Integer, primary_key=True)
    
    # User information
    email = db.Column(db.String(120), unique=True, nullable=False)
    firstName = db.Column(db.String(100), nullable=False)
    lastName = db.Column(db.String(100), nullable=False)
    profile_pic = db.Column(db.String(255))
    dorm_location = db.Column(db.String(100))
    
    # Timestamp
    created_at = db.Column(db.DateTime, server_default=func.now())
    
     # Onboarding Fields 
    topStyle = db.Column(db.String(100), nullable=True)
    bottomStyle = db.Column(db.String(100), nullable=True)
    height = db.Column(db.String(50), nullable=True)
    weight = db.Column(db.String(50), nullable=True)
    
    # Relationships
    items = db.relationship('Item', backref='owner', lazy=True)
    borrow_requests_sent = db.relationship('BorrowRequest', 
                                          foreign_keys='BorrowRequest.borrower_id',
                                          backref='borrower', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'


class Item(db.Model):
    __tablename__ = 'items'
    
    # Primary key
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign key
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Item information
    item_name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False)  # 'tops', 'bottoms', 'dresses', 'shoes', etc.
    size = db.Column(db.String(20), nullable=False)      # 'XS', 'S', 'M', 'L', 'XL', etc.
    images = db.Column(db.JSON, nullable=False)          # Array of image URLs
    available = db.Column(db.Boolean, default=True)
    brand = db.Column(db.String(50))
    condition = db.Column(db.String(50), nullable=False) # heavily used, mildly used, new
    price_per_day = db.Column(db.Integer, nullable=False)
    link = db.Column(db.Text)

    # Timestamp
    created_at = db.Column(db.DateTime, server_default=func.now())
    
    # Relationships
    borrow_requests = db.relationship('BorrowRequest', backref='item', lazy=True)

    def __repr__(self):
        return f'<Item {self.title}>'


class BorrowRequest(db.Model):
    __tablename__ = 'borrow_requests'
    
    # Primary key
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign keys
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    borrower_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Request information
    status = db.Column(db.String(20), default='pending')  # 'pending', 'approved', 'rejected', 'returned'
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    
    # Timestamp
    created_at = db.Column(db.DateTime, server_default=func.now())

    #Relationships
    borrower = db.relationship('User', foreign_keys=[borrower_id])
    item = db.relationship('Item', foreign_keys=[item_id])

    def __repr__(self):
        return f'<BorrowRequest {self.id} - {self.status}>'


class Conversation(db.Model):
    __tablename__ = 'conversations'
    
    # Primary key
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign keys
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'))
    participant1_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    participant2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Conversation metadata
    last_message_at = db.Column(db.DateTime)
    
    # Relationships
    messages = db.relationship('Message', backref='conversation', lazy=True)

    def __repr__(self):
        return f'<Conversation {self.id}>'


class Message(db.Model):
    __tablename__ = 'messages'
    
    # Primary key
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign keys
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Message content
    content = db.Column(db.Text, nullable=False)
    
    # Timestamp
    created_at = db.Column(db.DateTime, server_default=func.now())

    def __repr__(self):
        return f'<Message {self.id}>'

class Waitlist(db.Model):
    __tablename__ = 'waitlist'
    
    # Primary key
    id = db.Column(db.Integer, primary_key=True)
    
    firstName = db.Column(db.String(100), nullable=False)
    lastName = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    
    # Timestamp
    created_at = db.Column(db.DateTime, server_default=func.now())

    def __repr__(self):
        return f'<Waitlist {self.id}>'


class WaitlistEmail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)

    def __repr__(self):
        return f"<WaitlistEmail {self.email}>"