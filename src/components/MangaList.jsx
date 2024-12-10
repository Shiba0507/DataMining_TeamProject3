import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import PropTypes from "prop-types";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 2000, min: 1500 }, items: 5 },
  desktop: { breakpoint: { max: 1500, min: 1000 }, items: 3 },
  tablet: { breakpoint: { max: 1000, min: 500 }, items: 2 },
  mobile: { breakpoint: { max: 500, min: 0 }, items: 1 },
};

function MangaList({ title, manga }) {
  const getCoverImage = (item) => {
    const coverArt = item.relationships.find((rel) => rel.type === "cover_art");
    return coverArt
      ? `https://uploads.mangadex.org/covers/${item.id}/${coverArt.attributes?.fileName}.256.jpg`
      : "https://via.placeholder.com/256x384.png?text=No+Image";
  };

  const getSanitizedTitle = (title) => {
    // Replace spaces with dashes and encode URI to make it safe for URLs
    return encodeURIComponent(title.replace(/\s+/g, "-").toLowerCase());
  };

  return (
    <div className="text-white p-6 mb-6 bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-xl shadow-lg">
      <h2 className="uppercase text-3xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-300">
        {title}
      </h2>
      <div className="relative">
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          transitionDuration={500}
          className="flex space-x-6 overflow-x-auto pb-4 overflow-y-hidden"
        >
          {manga.map((item, index) => {
            const coverArt = getCoverImage(item);
            const mangaTitle = item.attributes?.title?.en || "Unknown Title";
            const sanitizedTitle = getSanitizedTitle(mangaTitle);

            return (
              <Link to={`/manga/${sanitizedTitle}`} key={index}>
                <div className="relative flex-shrink-0 w-64 transform hover:scale-105 transition-all duration-300 ease-in-out group">
                  <img
                    src={coverArt}
                    alt={mangaTitle}
                    className="w-64 h-96 object-cover rounded-lg transition-all duration-300 transform group-hover:scale-105 group-hover:rotate-3"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <h3 className="text-center text-green-500 text-lg font-semibold px-2 py-4 bg-opacity-75 w-full">
                      {mangaTitle}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
}

MangaList.propTypes = {
  title: PropTypes.string.isRequired,
  manga: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      relationships: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          attributes: PropTypes.shape({
            fileName: PropTypes.string,
          }),
        })
      ),
      attributes: PropTypes.shape({
        title: PropTypes.shape({
          en: PropTypes.string,
        }),
      }),
    })
  ).isRequired,
};

export default MangaList;
