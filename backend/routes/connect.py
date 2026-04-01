from flask import Blueprint, request, jsonify, session
from backend.models import User
from backend.extensions import db
from backend.utils import login_required
import stripe
import os

connect_bp = Blueprint('connect', __name__)

stripe.api_key = os.getenv('STRIPE_SECRET_KEY', '').strip()

FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')


@connect_bp.route('/connect/account', methods=['POST'])
@login_required
def create_connected_account():
    user_id = session.get('user_id')
    user = db.session.get(User, user_id)

    if user.stripe_account_id:
        return jsonify({'account_id': user.stripe_account_id}), 200

    try:
        account = stripe.Account.create(
            type='express',
            country='US',
            email=user.email,
            capabilities={
                'card_payments': {'requested': True},
                'transfers': {'requested': True},
            },
        )
        user.stripe_account_id = account.id
        db.session.commit()
        return jsonify({'account_id': account.id}), 201
    except stripe.StripeError as e:
        return jsonify({'error': str(e)}), 400


@connect_bp.route('/connect/account-link', methods=['POST'])
@login_required
def create_account_link():
    user_id = session.get('user_id')
    user = db.session.get(User, user_id)

    if not user.stripe_account_id:
        return jsonify({'error': 'No connected account. Create one first.'}), 400

    try:
        link = stripe.AccountLink.create(
            account=user.stripe_account_id,
            refresh_url=f'{FRONTEND_URL}/stripe-return?status=refresh',
            return_url=f'{FRONTEND_URL}/stripe-return?status=success',
            type='account_onboarding',
        )
        return jsonify({'url': link.url}), 200
    except stripe.StripeError as e:
        return jsonify({'error': str(e)}), 400


@connect_bp.route('/connect/status', methods=['GET'])
@login_required
def account_status():
    user_id = session.get('user_id')
    user = db.session.get(User, user_id)

    if not user.stripe_account_id:
        return jsonify({'connected': False}), 200

    try:
        account = stripe.Account.retrieve(user.stripe_account_id)
        return jsonify({
            'connected': True,
            'charges_enabled': account.charges_enabled,
            'payouts_enabled': account.payouts_enabled,
            'details_submitted': account.details_submitted,
        }), 200
    except stripe.StripeError as e:
        return jsonify({'error': str(e)}), 400
