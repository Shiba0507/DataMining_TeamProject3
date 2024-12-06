from flask import Blueprint, request, jsonify
from db_utils import get_db_connection
from datetime import datetime

# Tạo Blueprint cho Manga APIs
manga_bp = Blueprint('manga', __name__)

# API thêm manga vào lịch sử đọc
@manga_bp.route('/api/add-manga', methods=['POST'])
def add_manga():
    data = request.json
    user_id = data.get('user_id')
    manga_title = data.get('manga_title')
    cover_image = data.get('cover_image', '')  # Đường dẫn bìa
    content = data.get('content', '')          # Nội dung manga
    last_read_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Thời gian đọc manga

    if not user_id or not manga_title:
        return jsonify({"error": "User ID and manga title are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO manga_reading_history 
        (user_id, manga_title, last_read_at, cover_image, content) 
        VALUES (?, ?, ?, ?, ?)
    ''', (user_id, manga_title, last_read_at, cover_image, content))
    conn.commit()
    conn.close()

    return jsonify({"message": f"'{manga_title}' added to your reading history"}), 201

# API lấy lịch sử đọc manga của người dùng
@manga_bp.route('/api/manga-history/<int:user_id>', methods=['GET'])
def get_manga_history(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT manga_title, last_read_at, cover_image, content 
        FROM manga_reading_history 
        WHERE user_id = ?
    ''', (user_id,))
    history = cursor.fetchall()
    conn.close()

    if history:
        return jsonify([
            {
                "manga_title": row["manga_title"],
                "last_read_at": row["last_read_at"],
                "cover_image": row["cover_image"],
                "content": row["content"]
            } for row in history
        ]), 200
    else:
        return jsonify({"message": "No manga history found"}), 404

# API xóa manga khỏi lịch sử đọc
@manga_bp.route('/api/delete-manga-history', methods=['DELETE'])
def delete_manga_history():
    data = request.json
    user_id = data.get('user_id')
    manga_title = data.get('manga_title')

    if not user_id or not manga_title:
        return jsonify({"error": "User ID and manga title are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM manga_reading_history WHERE user_id = ? AND manga_title = ?', (user_id, manga_title))
    conn.commit()
    conn.close()

    return jsonify({"message": f"'{manga_title}' removed from your history"}), 200

# API lấy chi tiết manga
@manga_bp.route('/api/manga-details/<int:manga_id>', methods=['GET'])
def get_manga_details(manga_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT title, cover_image, content FROM manga WHERE id = ?', (manga_id,))
    manga = cursor.fetchone()
    conn.close()

    if manga:
        return jsonify({
            "title": manga["title"],
            "cover_image": manga["cover_image"],
            "content": manga["content"]
        }), 200
    else:
        return jsonify({"message": "Manga not found"}), 404

# API thêm danh sách manga
@manga_bp.route('/api/add-manga-details', methods=['POST'])
def add_manga_details():
    data = request.json  # Nhận danh sách các manga từ phía client

    if not isinstance(data, list):
        return jsonify({"error": "Invalid data format. Expected a list of manga details."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    query = '''
        INSERT INTO manga (title, cover_image, content) 
        VALUES (?, ?, ?)
    '''
    manga_to_insert = [
        (
            manga.get('title'),
            manga.get('cover_image', ''),
            manga.get('content', '')  # Mặc định nội dung là rỗng nếu không có
        )
        for manga in data
    ]

    try:
        cursor.executemany(query, manga_to_insert)
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        conn.close()

    return jsonify({"message": f"{len(manga_to_insert)} manga(s) added successfully!"}), 201
