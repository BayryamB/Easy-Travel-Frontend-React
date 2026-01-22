import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { propertyService } from "../services/propertyService";
import "./Home.css";

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data = await propertyService.getRecentNormalStays();
                setProperties(data);
            } catch (err) {
                setError("Failed to load properties");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Find Your Perfect Getaway</h1>
                    <p>Discover amazing places to stay around the world</p>

                    {/* Search Bar */}
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Where would you like to go?"
                            className="search-input"
                        />
                        <button className="btn btn-primary">Search</button>
                    </div>
                </div>
            </section>

            {/* Featured Properties Section */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Featured Stays</h2>

                    {loading && (
                        <div className="loading-state">
                            <p>Loading properties...</p>
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}

                    {!loading && properties.length === 0 && (
                        <div className="empty-state">
                            <p>No properties available yet</p>
                            <Link to="/properties" className="btn btn-primary">
                                Browse All Properties
                            </Link>
                        </div>
                    )}

                    {!loading && properties.length > 0 && (
                        <div className="properties-grid">
                            {properties.map((property) => (
                                <Link
                                    key={property._id}
                                    to={`/property/${property._id}`}
                                    className="property-link"
                                >
                                    <div className="property-item">
                                        <div className="property-image">
                                            <img
                                                src={
                                                    property.cover ||
                                                    "https://via.placeholder.com/300x200"
                                                }
                                                alt={property.title}
                                            />
                                            <span className="property-price">
                                                ${property.price}/night
                                            </span>
                                        </div>
                                        <div className="property-info">
                                            <h3>{property.title}</h3>
                                            <p className="property-location">
                                                {property.location?.city},{" "}
                                                {property.location?.country}
                                            </p>
                                            <div className="property-details">
                                                <span>
                                                    ⭐{" "}
                                                    {property.rating || "New"}
                                                </span>
                                                <span>
                                                    👥 {property.maxGuests}{" "}
                                                    guests
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="section-footer">
                        <Link to="/properties" className="btn btn-secondary">
                            View All Properties
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why Choose Easy Travel</h2>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🏠</div>
                            <h3>Wide Selection</h3>
                            <p>Choose from thousands of properties worldwide</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">💰</div>
                            <h3>Best Prices</h3>
                            <p>Competitive prices and special deals for you</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>Secure Booking</h3>
                            <p>Safe and secure payment and booking process</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">⭐</div>
                            <h3>Verified Reviews</h3>
                            <p>Read genuine reviews from real travelers</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📞</div>
                            <h3>24/7 Support</h3>
                            <p>Our team is always ready to help you</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">✨</div>
                            <h3>Unique Experiences</h3>
                            <p>Discover unique places and create memories</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Start Your Journey?</h2>
                        <p>Join thousands of travelers who trust Easy Travel</p>
                        <div className="cta-buttons">
                            <Link
                                to="/properties"
                                className="btn btn-primary btn-lg"
                            >
                                Browse Properties
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-outline btn-lg"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
