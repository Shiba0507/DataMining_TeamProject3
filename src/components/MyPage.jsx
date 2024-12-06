import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

function Mypage({ user, setUser }) {
    const [mangaHistory, setMangaHistory] = useState([]);
    const [recommendedManga, setRecommendedManga] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchMangaHistory = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/manga-history/${user.user_id}`);
            if (response.status === 200) {
                const sortedHistory = response.data.sort((a, b) => new Date(b.last_read_at) - new Date(a.last_read_at));
                setMangaHistory(sortedHistory);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load manga history. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const fetchRecommendations = useCallback(async () => {
        if (!user) return;

        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/recommend-manga/${user.user_id}`);
            if (response.status === 200) {
                setRecommendedManga(response.data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load recommendations. Please try again.');
        }
    }, [user]);

    useEffect(() => {
        let storedUser = user;
        if (!storedUser) {
            const userData = localStorage.getItem('user');
            if (userData) {
                storedUser = JSON.parse(userData);
                setUser(storedUser);
            } else {
                navigate('/login');
                return;
            }
        }
        fetchMangaHistory();
        fetchRecommendations();
    }, [user, setUser, fetchMangaHistory, fetchRecommendations, navigate]);

    const handleDeleteFromHistory = async (mangaTitle) => {
        if (!user) {
            alert("Please log in to manage your history.");
            return;
        }

        try {
            const response = await axios.delete('http://127.0.0.1:5000/api/delete-manga-history', {
                data: {
                    user_id: user.user_id,
                    manga_title: mangaTitle
                }
            });
            if (response.status === 200) {
                setMangaHistory(mangaHistory.filter(item => item.manga_title !== mangaTitle));
                alert('Manga removed from history!');
            } else {
                alert('Failed to remove manga.');
            }
        } catch (err) {
            console.error(err);
            alert('Error removing manga from history.');
        }
    };

    const handleReadManga = (mangaTitle) => {
        navigate(`/manga/${mangaTitle}`);
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
            {user ? (
                <>
                    <h2 className="text-3xl font-bold mb-6 text-center text-green-500">
                        Welcome, {user.username}!
                    </h2>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-green-400 mb-4">Your Manga Reading History</h3>
                        {loading ? (
                            <p>Loading your history...</p>
                        ) : mangaHistory.length > 0 ? (
                            <div className="overflow-y-auto space-y-6">
                                {mangaHistory.map((item, index) => {
                                    const coverArt = item.cover_image || null;
                                    return (
                                        <div key={index} className="flex items-center bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                                            {coverArt ? (
                                                <img
                                                    src={coverArt}
                                                    alt={item.manga_title}
                                                    className="w-24 h-32 object-cover rounded-lg mr-4"
                                                />
                                            ) : (
                                                <div className="w-24 h-32 bg-gray-600 rounded-lg mr-4" />
                                            )}
                                            <div>
                                                <h4 className="text-xl font-semibold text-green-400">{item.manga_title}</h4>
                                                <p className="text-sm text-gray-400">Last read: {item.last_read_at}</p>
                                                <div className="mt-2 space-x-4">
                                                    <button
                                                        onClick={() => handleReadManga(item.manga_title)}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                                    >
                                                        Read Manga
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteFromHistory(item.manga_title)}
                                                        className="text-red-400 hover:underline"
                                                    >
                                                        Remove from History
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>You haven`t read any manga yet.</p>
                        )}
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-green-400 mb-4">Recommended Manga</h3>
                        {recommendedManga.length > 0 ? (
                            <div className="flex space-x-6 overflow-x-auto pb-4">
                                {recommendedManga.map((item, index) => {
                                    const coverArt = item.cover_image || null;
                                    return (
                                        <div
                                            key={index}
                                            className="relative flex-shrink-0 bg-gray-800 p-4 rounded-lg shadow-md w-48 hover:scale-105 transition-transform"
                                            onClick={() => handleReadManga(item.manga_title)}
                                        >
                                            {coverArt ? (
                                                <img
                                                    src={coverArt}
                                                    alt={item.manga_title}
                                                    className="w-full h-72 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-72 bg-gray-600 rounded-lg" />
                                            )}
                                            
                                            {/* Title on Hover */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-green-500 text-lg font-semibold opacity-0 transition-opacity hover:opacity-100">
                                                {item.manga_title}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>No recommendations found.</p>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </>
            ) : (
                <p>Loading your profile...</p>
            )}
        </div>
    );
}

// Prop validation for user prop and its properties
Mypage.propTypes = {
    user: PropTypes.shape({
        user_id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired
    }),
    setUser: PropTypes.func.isRequired,
};

export default Mypage;
