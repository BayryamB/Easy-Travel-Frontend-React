import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { propertyService } from "../services/propertyService";
import "./PropertyDetail.css";

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                // Try to fetch from both endpoints
                let data;
                try {
                    data = await propertyService.getNormalStay(id);
                } catch {
                    data = await propertyService.getLongTermStay(id);
                }
                setProperty(data);
            } catch (err) {
                setError("Failed to load property details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    if (loading) {
        return (
            <div className="container">
                <p>Loading property details...</p>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="container">
                <div className="error-message">
                    {error || "Property not found"}
                </div>
                <button
                    onClick={() => navigate("/properties")}
                    className="btn btn-primary"
                >
                    Back to Properties
                </button>
            </div>
        );
    }

    return (
        <div className="property-detail-container">
            <div className="container">
                <button
                    onClick={() => navigate("/properties")}
                    className="back-button"
                >
                    ← Back to Properties
                </button>

                <div className="detail-wrapper">
                    {/* Image Gallery */}
                    <div className="image-section">
                        <img
                            src={
                                property.cover ||
                                "https://via.placeholder.com/800x600"
                            }
                            alt={property.title}
                        />
                    </div>

                    {/* Details Section */}
                    <div className="details-section">
                        <h1>{property.title}</h1>

                        <div className="property-meta">
                            <span className="location">
                                📍 {property.location?.city},{" "}
                                {property.location?.country}
                            </span>
                            <span className="rating">
                                ⭐ {property.rating || "New"}
                            </span>
                        </div>

                        <div className="price-section">
                            <h2>${property.price}/night</h2>
                        </div>

                        <div className="description">
                            <h3>About this property</h3>
                            <p>
                                {property.description ||
                                    "No description available"}
                            </p>
                        </div>

                        <div className="amenities">
                            <h3>Amenities</h3>
                            {property.amenities &&
                            property.amenities.length > 0 ? (
                                <ul className="amenities-list">
                                    {property.amenities.map(
                                        (amenity, index) => (
                                            <li key={index}>✓ {amenity}</li>
                                        ),
                                    )}
                                </ul>
                            ) : (
                                <p>No amenities listed</p>
                            )}
                        </div>

                        {/* Booking CTA */}
                        <div className="booking-section">
                            <button className="btn btn-primary btn-lg">
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
