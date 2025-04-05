from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ⚠️ Replace with your actual DB credentials
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Greyshin9@localhost/cafe_pos'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# 🧾 Order model
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    items = db.Column(db.JSON, nullable=False)
    total = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'items': self.items,
            'total': self.total,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }

# 🔁 Initialize tables on first request
@app.before_request
def create_tables():
    db.create_all()

# 📨 POST /api/orders - Create a new order
@app.route("/api/orders", methods=["POST"])
def create_order():
    data = request.json
    total = sum(item['price'] for item in data)

    order = Order(items=data, total=total)
    db.session.add(order)
    db.session.commit()

    return jsonify({
        "message": "Order saved!",
        "order": order.to_dict()
    }), 201

# 📬 GET /api/orders - Get all orders
@app.route("/api/orders", methods=["GET"])
def get_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify([order.to_dict() for order in orders])

if __name__ == "__main__":
    app.run(debug=True)
