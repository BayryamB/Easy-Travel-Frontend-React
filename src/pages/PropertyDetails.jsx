import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PropertyDetails.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BookingSection from "../components/Bookingsection";

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState(null);
    const [host, setHost] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
    const [showMoreDescription, setShowMoreDescription] = useState(false);

    const BACKEND_URL =
        import.meta.env.VITE_API_URL ||
        "https://easy-travel-backend-nodejs.onrender.com/api";

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                setLoading(true);

                // Fetch property (try normal-stays first, then long-term-stays)
                let propertyResponse = await fetch(
                    `${BACKEND_URL}/normal-stays/${id}`,
                );

                if (!propertyResponse.ok) {
                    propertyResponse = await fetch(
                        `${BACKEND_URL}/long-term-stays/${id}`,
                    );
                }

                if (!propertyResponse.ok) {
                    throw new Error("Property not found");
                }

                const propertyData = await propertyResponse.json();
                const actualProperty = propertyData.data || propertyData;

                console.log("Property Data:", actualProperty); // Debug log
                console.log("HostId:", actualProperty.hostId); // Debug log

                setProperty(actualProperty);

                // Fetch host information - handle both string ID and object
                const hostId =
                    typeof actualProperty.hostId === "string"
                        ? actualProperty.hostId
                        : actualProperty.hostId?._id ||
                          actualProperty.hostId?.id;

                if (hostId) {
                    try {
                        const hostResponse = await fetch(
                            `${BACKEND_URL}/users/${hostId}`,
                        );
                        if (hostResponse.ok) {
                            const hostData = await hostResponse.json();
                            setHost(hostData);
                        }
                    } catch (err) {
                        console.error("Error fetching host:", err);
                    }
                }

                // Fetch reviews
                try {
                    const reviewsResponse = await fetch(
                        `${BACKEND_URL}/reviews?propertyId=${id}`,
                    );
                    if (reviewsResponse.ok) {
                        const reviewsData = await reviewsResponse.json();
                        setReviews(reviewsData.data || reviewsData || []);
                    }
                } catch (err) {
                    console.error("Error fetching reviews:", err);
                }

                setError("");
            } catch (err) {
                setError(err.message || "Failed to load property");
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyDetails();
    }, [id, BACKEND_URL]);

    if (loading) {
        return (
            <div className="property-loading">Loading property details...</div>
        );
    }

    if (error || !property) {
        return (
            <div className="property-error">
                <h2>Oops!</h2>
                <p>{error || "Property not found"}</p>
                <button
                    onClick={() => navigate("/")}
                    className="btn btn-primary"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    const photos =
        property.photos && property.photos.length > 0
            ? property.photos
            : [property.cover || "https://via.placeholder.com/800x600"];

    const currentPhoto = photos[selectedPhotoIndex];
    const amenities = property.options || {};
    const amenityList = [
        { key: "wifi", label: "WiFi", icon: "🌐" },
        { key: "parking", label: "Parking", icon: "🚗" },
        { key: "breakfast", label: "Breakfast", icon: "🍳" },
        { key: "pets", label: "Pets Allowed", icon: "🐾" },
        { key: "smoking", label: "Smoking Allowed", icon: "🚬" },
    ];

    const activeAmenities = amenityList.filter((a) => amenities[a.key]);
    const avgRating =
        reviews.length > 0
            ? (
                  reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                  reviews.length
              ).toFixed(1)
            : 0;

    const descriptionPreview = property.description?.substring(0, 300) || "";
    const fullDescription = property.description || "";
    return (
        <div className="property-details">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <button onClick={() => navigate("/")}>Home</button>
                <span>/</span>
                <button onClick={() => navigate("/")}>Stays</button>
                <span>/</span>
                <span>{property.location?.country}</span>
            </div>

            {/* Header */}
            <div className="property-header">
                <div className="header-content">
                    <h1>{property.title}</h1>
                    <div className="header-meta">
                        <span className="rating">
                            ⭐ {avgRating} ({reviews.length} reviews)
                        </span>
                        <span className="location">
                            📍 {property.location?.city},{" "}
                            {property.location?.country}
                        </span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn-icon">❤️ Save</button>
                    <button className="btn-icon">📤 Share</button>
                </div>
            </div>

            <div className="property-container">
                {/* Photo Gallery */}
                <div className="photo-section">
                    <div className="main-photo">
                        <img src={currentPhoto} alt="Property" />
                    </div>
                    <div className="photo-grid">
                        {photos.map((photo, index) => (
                            <div
                                key={index}
                                className={`photo-thumbnail ${index === selectedPhotoIndex ? "active" : ""}`}
                                onClick={() => setSelectedPhotoIndex(index)}
                            >
                                <img src={photo} alt={`Photo ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="property-content">
                    {/* Left Column */}
                    <div className="left-column">
                        {/* Property Info */}
                        <div className="info-section">
                            <h2>
                                Entire {property.propertyType || "property"}{" "}
                                hosted by {host?.username || "Host"}
                            </h2>
                            <div className="property-specs">
                                <div className="spec">
                                    <span className="spec-icon">🛏️</span>
                                    <div>
                                        <p className="spec-label">
                                            {property.bedroomCount} Bedrooms
                                        </p>
                                    </div>
                                </div>
                                <div className="spec">
                                    <span className="spec-icon">🚿</span>
                                    <div>
                                        <p className="spec-label">
                                            {property.bathroomCount} Bathrooms
                                        </p>
                                    </div>
                                </div>
                                <div className="spec">
                                    <span className="spec-icon">👥</span>
                                    <div>
                                        <p className="spec-label">
                                            Max {property.maxGuests} Guests
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="description-section">
                            <h3>About this property</h3>
                            <p>
                                {showMoreDescription
                                    ? fullDescription
                                    : descriptionPreview}
                                {fullDescription.length > 300 && (
                                    <button
                                        className="show-more-btn"
                                        onClick={() =>
                                            setShowMoreDescription(
                                                !showMoreDescription,
                                            )
                                        }
                                    >
                                        {showMoreDescription
                                            ? "Show less"
                                            : "Show more"}
                                    </button>
                                )}
                            </p>
                        </div>

                        {/* Amenities */}
                        {activeAmenities.length > 0 && (
                            <div className="amenities-section">
                                <h3>What this place offers</h3>
                                <div className="amenities-list">
                                    {activeAmenities.map((amenity) => (
                                        <div
                                            key={amenity.key}
                                            className="amenity-item"
                                        >
                                            <span className="amenity-icon">
                                                {amenity.icon}
                                            </span>
                                            <span className="amenity-label">
                                                {amenity.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Host Guide */}
                        {property.guide && (
                            <div className="guide-section">
                                <h3>Host Guide</h3>
                                <p>{property.guide}</p>
                            </div>
                        )}

                        {/* Reviews Section */}
                        {reviews.length > 0 && (
                            <div className="reviews-section">
                                <h3>Reviews ({reviews.length})</h3>
                                <div className="rating-summary">
                                    <div className="rating-number">
                                        {avgRating}
                                    </div>
                                    <div className="rating-text">
                                        ⭐ {avgRating} out of 5
                                    </div>
                                </div>
                                <div className="reviews-list">
                                    {reviews
                                        .slice(0, 5)
                                        .map((review, index) => (
                                            <div
                                                key={index}
                                                className="review-item"
                                            >
                                                <div className="review-header">
                                                    <div className="reviewer-info">
                                                        <p className="reviewer-name">
                                                            {review.userId
                                                                ?.username ||
                                                                "Guest"}
                                                        </p>
                                                        <p className="review-date">
                                                            {new Date(
                                                                review.createdAt,
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <p className="review-rating">
                                                        ⭐ {review.rating}
                                                    </p>
                                                </div>
                                                <p className="review-text">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="right-column">
                        <BookingSection property={property} />
                    </div>
                    {/* Host Card */}
                    {host && (
                        <div className="host-card">
                            <h3>Meet your Host</h3>
                            <div className="host-info">
                                <div className="host-avatar">
                                    <div className="avatar-placeholder">👤</div>
                                </div>
                                <div className="host-details">
                                    <p className="host-name">{host.username}</p>
                                    <p className="host-type">Superhost</p>
                                    <p className="host-rating">
                                        ⭐ 4.9 • 128 reviews
                                    </p>
                                </div>
                            </div>
                            <p className="host-description">
                                Superhosts are experienced, highly-rated hosts
                                who are committed to providing great stays for
                                guests.
                            </p>
                            <button className="btn btn-outline btn-full">
                                Contact Host
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
