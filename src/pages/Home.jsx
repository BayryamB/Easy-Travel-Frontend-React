import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { propertyService } from "../services/propertyService";
import "./Home.css";

const Home = () => {
    const [shortTermStays, setShortTermStays] = useState([]);
    const [longTermStays, setLongTermStays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [searchData, setSearchData] = useState({
        location: "",
        checkIn: null,
        checkOut: null,
        guests: "",
    });

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const [shortTerm, longTerm] = await Promise.all([
                    propertyService.getRecentNormalStays(),
                    propertyService.getRecentLongTermStays(),
                ]);
                setShortTermStays(shortTerm);
                setLongTermStays(longTerm);
            } catch (err) {
                setError("Failed to load properties");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching with:", searchData);
        // Handle search logic here
    };

    const handleDateRangeChange = (dates) => {
        const [start, end] = dates;
        setSearchData((prev) => ({
            ...prev,
            checkIn: start,
            checkOut: end,
        }));
    };

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Find your next home away from home.</h1>
                    <p>
                        Discover unique stays for any duration, from weekend
                        getaways to monthly luxury villas.
                    </p>

                    {/* Search Bar */}
                    <form className="search-bar" onSubmit={handleSearch}>
                        <div className="search-field">
                            <label>LOCATION</label>
                            <input
                                type="text"
                                placeholder="Where are you going?"
                                className="search-input"
                                value={searchData.location}
                                onChange={(e) =>
                                    setSearchData({
                                        ...searchData,
                                        location: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="search-field">
                            <label>DATES</label>
                            <DatePicker
                                selectsRange={true}
                                startDate={searchData.checkIn}
                                endDate={searchData.checkOut}
                                onChange={handleDateRangeChange}
                                placeholderText="Add dates"
                                className="search-input date-picker-input"
                                dateFormat="MMM d"
                                minDate={new Date()}
                                isClearable={true}
                            />
                        </div>

                        <div className="search-field">
                            <label>GUESTS</label>
                            <select
                                className="search-input"
                                value={searchData.guests}
                                onChange={(e) =>
                                    setSearchData({
                                        ...searchData,
                                        guests: e.target.value,
                                    })
                                }
                            >
                                <option value="">Add guests</option>
                                <option value="1">1 guest</option>
                                <option value="2">2 guests</option>
                                <option value="3">3 guests</option>
                                <option value="4">4 guests</option>
                                <option value="5">5 guests</option>
                                <option value="6">6 guests</option>
                                <option value="7+">7+ guests</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary search-btn"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* Filter Tabs */}
            <section className="filter-section">
                <div className="container">
                    <div className="filter-tabs">
                        <button
                            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                            onClick={() => setActiveTab("all")}
                        >
                            All Stays
                        </button>
                        <button
                            className={`tab-btn ${activeTab === "unique" ? "active" : ""}`}
                            onClick={() => setActiveTab("unique")}
                        >
                            Unique
                        </button>
                        <button
                            className={`tab-btn ${activeTab === "monthly" ? "active" : ""}`}
                            onClick={() => setActiveTab("monthly")}
                        >
                            Monthly
                        </button>
                    </div>
                </div>
            </section>

            {/* Short-term Getaways Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Short-term Getaways</h2>
                    </div>

                    {loading && (
                        <div className="loading-state">
                            <p>Loading properties...</p>
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}

                    {!loading && shortTermStays.length === 0 && (
                        <div className="empty-state">
                            <p>No short-term properties available yet</p>
                        </div>
                    )}

                    {!loading && shortTermStays.length > 0 && (
                        <div className="properties-grid">
                            {shortTermStays.map((property) => (
                                <Link
                                    key={property._id}
                                    to={`/property/${property._id}`}
                                    className="property-link"
                                >
                                    <div className="property-card">
                                        <div className="property-image">
                                            <img
                                                src={
                                                    property.cover ||
                                                    "https://via.placeholder.com/300x200"
                                                }
                                                alt={property.title}
                                            />
                                            <button
                                                className="like-btn"
                                                type="button"
                                            >
                                                ♡
                                            </button>
                                            <span className="property-badge">
                                                Book now
                                            </span>
                                        </div>
                                        <div className="property-info">
                                            <div className="property-header">
                                                <h3>{property.title}</h3>
                                                <div className="property-rating">
                                                    <span className="star">
                                                        ★
                                                    </span>
                                                    <span>
                                                        {property.rating ||
                                                            "New"}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="property-location">
                                                {property.location?.city},{" "}
                                                {property.location?.country}
                                            </p>
                                            <p className="property-description">
                                                {property.description?.substring(
                                                    0,
                                                    50,
                                                )}
                                                ...
                                            </p>
                                            <div className="property-price">
                                                <strong>
                                                    ${property.price}
                                                </strong>
                                                <span>/night</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Long-term Stays Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Long-term Stays</h2>
                        <Link to="/properties" className="view-all-link">
                            View all
                        </Link>
                    </div>

                    {!loading && longTermStays.length > 0 && (
                        <div className="properties-grid">
                            {longTermStays.map((property) => (
                                <Link
                                    key={property._id}
                                    to={`/property/${property._id}`}
                                    className="property-link"
                                >
                                    <div className="property-card">
                                        <div className="property-image">
                                            <img
                                                src={
                                                    property.cover ||
                                                    "https://via.placeholder.com/300x200"
                                                }
                                                alt={property.title}
                                            />
                                            <button
                                                className="like-btn"
                                                type="button"
                                            >
                                                ♡
                                            </button>
                                            <span className="property-badge">
                                                Rentals
                                            </span>
                                        </div>
                                        <div className="property-info">
                                            <div className="property-header">
                                                <h3>{property.title}</h3>
                                                <div className="property-rating">
                                                    <span className="star">
                                                        ★
                                                    </span>
                                                    <span>
                                                        {property.rating ||
                                                            "New"}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="property-location">
                                                {property.location?.city},{" "}
                                                {property.location?.country}
                                            </p>
                                            <p className="property-description">
                                                {property.description?.substring(
                                                    0,
                                                    50,
                                                )}
                                                ...
                                            </p>
                                            <div className="property-price">
                                                <strong>
                                                    ${property.price}
                                                </strong>
                                                <span>/month</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
