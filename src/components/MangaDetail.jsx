import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function MangaDetail({ user }) {
  const { title } = useParams();  // Lấy tiêu đề manga từ URL
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);  // Cuộn trang về đầu khi trang tải lại

    const fetchMangaDetails = async () => {
      setLoading(true);
      try {
        const mangaResponse = await fetch(
          `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&includes[]=cover_art`
        );
        const mangaData = await mangaResponse.json();
    
        if (mangaData.data && mangaData.data.length > 0) {
          // Tìm manga có tiêu đề khớp chính xác
          const selectedManga = mangaData.data.find((manga) => 
            manga.attributes?.title?.en?.toLowerCase() === title.toLowerCase()
          ) || mangaData.data[0]; // Nếu không khớp, lấy kết quả đầu tiên
    
          setManga(selectedManga);
    
          const chaptersResponse = await fetch(
            `https://api.mangadex.org/chapter?manga=${selectedManga.id}&limit=20`
          );
          const chaptersData = await chaptersResponse.json();
          setChapters(chaptersData.data || []);
        } else {
          setManga(null);
        }
      } catch (error) {
        console.error("Error fetching manga details:", error);
        alert("Failed to load manga details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    

    if (title) {
      fetchMangaDetails();
    }
  }, [title]);

  const handleAddToRead = async () => {
    if (!user) {
      alert("Please log in to track manga.");
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/add-manga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          manga_title: manga.attributes?.title?.en || "Unknown Title",
          cover_image: getCoverImage(),
          content: manga.attributes?.description?.en || "No description available.",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Manga added successfully!");
      } else {
        alert(data.error || "Failed to add manga.");
      }
    } catch (error) {
      console.error("Error adding manga:", error);
      alert("An error occurred while adding manga to your history.");
    } finally {
      setIsAdding(false);
    }
  };

  const getCoverImage = () => {
    const coverArt = manga?.relationships?.find(
      (rel) => rel.type === "cover_art"
    );
    return coverArt
      ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt?.attributes?.fileName}`
      : "https://via.placeholder.com/150"; // Ảnh mặc định nếu không có
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen transition-all">
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="spinner-border text-green-500" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : manga ? (
        <>
          <div className="flex flex-col md:flex-row items-start mb-12 space-y-4 md:space-y-0">
            <img
              src={getCoverImage()}
              alt={manga.attributes?.title?.en || "Unknown Title"}
              className="w-64 h-96 object-cover rounded-lg shadow-lg mb-4 md:mb-0 md:mr-8 transition-transform transform hover:scale-105"
            />
            <div className="md:w-full">
              <h1 className="text-4xl font-bold text-green-400">{manga.attributes?.title?.en || "Unknown Title"}</h1>
              <p className="mt-6 text-lg leading-relaxed text-gray-300 max-w-full">
                {manga.attributes?.description?.en || "No description available."}
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddToRead}
                  className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition-all duration-300 ease-in-out"
                  disabled={isAdding}
                >
                  {isAdding ? "Adding..." : "Add to Read"}
                </button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-semibold mb-6">Chapters</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters.length > 0 ? (
                chapters.map((chapter) => (
                  <li key={chapter.id} className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors">
                    <a
                      href={`https://mangadex.org/chapter/${chapter.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:underline text-xl"
                    >
                      {chapter.attributes?.title ||
                        `Chapter ${chapter.attributes?.chapter}`}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No chapters available</li>
              )}
            </ul>
          </div>
        </>
      ) : (
        <p className="text-red-500 text-lg">Manga not found.</p>
      )}
    </div>
  );
}

MangaDetail.propTypes = {
  user: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }),
};

export default MangaDetail;
