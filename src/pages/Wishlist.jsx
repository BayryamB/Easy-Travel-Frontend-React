import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Wishlist.css";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading] = useState(false);

    useEffect(() => {}, []);

    const removeFromWishlist = (id) => {
        setWishlist(wishlist.filter((item) => item._id !== id));
    };

    return (
        <div className="wishlist-container">
            <div className="container">
                <h1>My Wishlist</h1>

                {loading && (
                    <div className="loading-state">
                        <p>Loading your wishlist...</p>
                    </div>
                )}

                {!loading && wishlist.length === 0 && (
                    <div className="empty-state">
                        <p>Your wishlist is empty</p>
                        <Link to="/properties" className="btn btn-primary">
                            Explore Properties
                        </Link>
                    </div>
                )}

                {!loading && wishlist.length > 0 && (
                    <div className="wishlist-grid">
                        {wishlist.map((property) => (
                            <div key={property._id} className="wishlist-item">
                                <div className="wishlist-image">
                                    <img
                                        src={property.cover}
                                        alt={property.title}
                                    />
                                </div>
                                <div className="wishlist-info">
                                    <h3>{property.title}</h3>
                                    <p>
                                        {property.location?.city},{" "}
                                        {property.location?.country}
                                    </p>
                                    <div className="wishlist-actions">
                                        <Link
                                            to={`/property/${property._id}`}
                                            className="btn btn-sm btn-primary"
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() =>
                                                removeFromWishlist(property._id)
                                            }
                                            className="btn btn-sm btn-outline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
