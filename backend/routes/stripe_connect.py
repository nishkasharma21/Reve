from flask import Blueprint, request, jsonify, session
import stripe, os

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
stripe_bp = Blueprint('stripe', __name__)

@stripe_bp.route('/create-connect-account', methods=['POST'])
def create_connect_account():
    data = request.get_json()
    account = stripe.Account.create(
        type='express',
        email=data.get('email'),
        capabilities={"transfers": {"requested": True}},
    )
    return jsonify({"accountId": account.id})

@stripe_bp.route('/create-account-link', methods=['POST'])
def create_account_link():
    data = request.get_json()
    link = stripe.AccountLink.create(
        account=data['accountId'],
        refresh_url='http://localhost:3000/seller/dashboard',
        return_url='http://localhost:3000/seller/done',
        type='account_onboarding',
    )
    return jsonify({"url": link.url})

@stripe_bp.route('/account-status/<account_id>', methods=['GET'])
def account_status(account_id):
    account = stripe.Account.retrieve(account_id)
    return jsonify({
        "id": account.id,
        "chargesEnabled": account.charges_enabled,
        "payoutsEnabled": account.payouts_enabled,
        "detailsSubmitted": account.details_submitted,
    })

@stripe_bp.route('/create-product', methods=['POST'])
def create_product():
    data = request.get_json()
    product = stripe.Product.create(
        name=data['productName'],
        description=data.get('productDescription', ''),
        stripe_account=data['accountId'],
    )
    stripe.Price.create(
        product=product.id,
        unit_amount=data['productPrice'],
        currency='usd',
        stripe_account=data['accountId'],
    )
    return jsonify({"success": True})

@stripe_bp.route('/products/<account_id>', methods=['GET'])
def get_products(account_id):
    prices = stripe.Price.list(expand=['data.product'], stripe_account=account_id, limit=20)
    result = [{"name": p.product.name, "price": p.unit_amount, "priceId": p.id} for p in prices.data]
    return jsonify(result)

@stripe_bp.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    data = request.get_json()
    session_obj = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{"price": data['priceId'], "quantity": 1}],
        mode='payment',
        success_url='http://localhost:3000/seller/done?session_id={CHECKOUT_SESSION_ID}',
        cancel_url='http://localhost:3000/browse',
        stripe_account=data['accountId'],
    )
    return jsonify({"url": session_obj.url})