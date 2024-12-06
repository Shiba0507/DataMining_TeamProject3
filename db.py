def get_manga_by_emotion(emotion):
    # Mock data
    manga_emotion_map = {
        'happy': [{'title': 'One Piece', 'cover_image': 'link1.jpg', 'description': 'Adventure manga.'}],
        'sad': [{'title': 'Your Lie in April', 'cover_image': 'link2.jpg', 'description': 'Emotional drama.'}],
    }
    return manga_emotion_map.get(emotion.lower(), [])
