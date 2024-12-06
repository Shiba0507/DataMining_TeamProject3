from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from db_utils import get_db_connection
import sqlite3


# Tạo Blueprint cho auth
auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()
jwt = JWTManager()

# API đăng ký tài khoản
@auth_bp.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
        conn.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username is already taken"}), 400
    finally:
        conn.close()

# API đăng nhập
@auth_bp.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()

    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity=user['id'])
        return jsonify({"access_token": access_token, "username": username}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

# API kiểm tra trạng thái đăng nhập
@auth_bp.route('/api/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    user_id = get_jwt_identity()
    return jsonify({"message": "Token is valid", "user_id": user_id}), 200
