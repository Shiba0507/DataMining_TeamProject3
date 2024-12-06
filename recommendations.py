from flask import Blueprint, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sqlite3

# Tạo blueprint
recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/<int:user_id>', methods=['GET'])
def recommend_manga(user_id):
    conn = sqlite3.connect('user_manga.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Fetch user history
    cursor.execute('SELECT manga_title, content FROM manga_reading_history WHERE user_id = ?', (user_id,))
    user_history = cursor.fetchall()

    if not user_history:
        return jsonify({"message": "No reading history found for this user."}), 404

    # Process data
    user_read_contents = [item['content'] for item in user_history]
    read_titles = {item['manga_title'] for item in user_history}

    cursor.execute('SELECT id, title, content, cover_image FROM manga')
    all_manga = cursor.fetchall()
    conn.close()

    if not all_manga:
        return jsonify({"message": "No manga found in the database."}), 404

    manga_titles = [manga['title'] for manga in all_manga]
    manga_contents = [manga['content'] for manga in all_manga]

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(user_read_contents + manga_contents)

    user_vector = tfidf_matrix[:len(user_read_contents)]
    manga_vectors = tfidf_matrix[len(user_read_contents):]

    similarities = cosine_similarity(user_vector, manga_vectors)

    recommended = []
    for idx, manga in enumerate(all_manga):
        if manga['title'] not in read_titles:
            similarity_score = max(similarities[:, idx])
            if similarity_score > 0.05:
                recommended.append({
                    "manga_title": manga['title'],
                    "cover_image": manga['cover_image'],
                    "content": manga['content'],
                    "similarity_score": similarity_score
                })

    recommended = sorted(recommended, key=lambda x: x['similarity_score'], reverse=True)
    return jsonify(recommended[:5]), 200 if recommended else jsonify({"message": "No recommendations found."}), 404
