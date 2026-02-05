import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditListing.css";

const EditListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const BACKEND_URL =
        import.meta.env.VITE_API_URL ||
        "https://easy-travel-backend-nodejs.onrender.com/api";

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Form data - matching BecomeHost structure
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        country: "",
        city: "",
        price: 0,
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 1,
        propertyType: "apartment",
        wifi: false,
        breakfast: false,
        smokingAllowed: false,
        parking: false,
        petsAllowed: false,
        images: [],
        hostGuide: "",
    });

    // Amenities list matching BecomeHost
    const amenitiesList = [
        { id: "wifi", label: "WiFi", icon: "📶" },
        { id: "breakfast", label: "Breakfast", icon: "🍳" },
        { id: "smokingAllowed", label: "Smoking Allowed", icon: "🚬" },
        { id: "parking", label: "Parking", icon: "🅿️" },
        { id: "petsAllowed", label: "Pets Allowed", icon: "🐕" },
    ];

    const propertyTypes = [
        "Apartment",
        "House",
        "Villa",
        "Cabin",
        "Condo",
        "Townhouse",
        "Bungalow",
    ];

    // Fetch property data
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                setError("");

                let response = await fetch(`${BACKEND_URL}/normal-stays/${id}`);
                let data;

                if (!response.ok) {
                    response = await fetch(
                        `${BACKEND_URL}/long-term-stays/${id}`,
                    );
                }

                if (!response.ok) {
                    throw new Error("Property not found");
                }

                data = await response.json();
                setProperty(data);

                // Extract country and city from location if it's a string
                let country = "";
                let city = "";
                if (typeof data.location === "string") {
                    const parts = data.location.split(",").map((p) => p.trim());
                    city = parts[0] || "";
                    country = parts[1] || "";
                } else if (data.location && typeof data.location === "object") {
                    city = data.location.city || "";
                    country = data.location.country || "";
                }

                // Pre-fill form with property data
                setFormData((prevState) => ({
                    ...prevState,
                    title: data.title || "",
                    description: data.description || "",
                    country: country,
                    city: city,
                    price: data.price || 0,
                    bedrooms: data.bedrooms || 1,
                    bathrooms: data.bathrooms || 1,
                    maxGuests: data.maxGuests || 1,
                    propertyType: data.propertyType || data.type || "Apartment",
                    wifi: data.wifi || false,
                    breakfast: data.breakfast || false,
                    smokingAllowed: data.smokingAllowed || false,
                    parking: data.parking || false,
                    petsAllowed: data.petsAllowed || false,
                    images: data.images || [],
                    hostGuide: data.hostGuide || "",
                }));
            } catch (err) {
                setError("Failed to load property. " + err.message);
                console.error("Error fetching property:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id, BACKEND_URL]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "number"
                      ? parseInt(value)
                      : value,
        }));
    };

    // Handle amenity toggle
    const handleAmenityToggle = (amenityId) => {
        setFormData((prevState) => ({
            ...prevState,
            [amenityId]: !prevState[amenityId],
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.title ||
            !formData.description ||
            !formData.country ||
            !formData.city ||
            !formData.price
        ) {
            setError("Please fill in all required fields");
            return;
        }

        setIsSaving(true);
        setError("");
        setSuccess("");

        try {
            // Combine country and city into location
            const location = `${formData.city}, ${formData.country}`;

            const updateData = {
                ...formData,
                location: location,
                type: formData.propertyType,
            };

            const endpoint =
                property.type === "long-term"
                    ? `${BACKEND_URL}/long-term-stays/${id}`
                    : `${BACKEND_URL}/normal-stays/${id}`;

            const response = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error("Failed to update listing");
            }

            const updatedProperty = await response.json();
            setProperty(updatedProperty);
            setSuccess("✓ Listing updated successfully!");

            setTimeout(() => {
                navigate("/host-dashboard");
            }, 2000);
        } catch (err) {
            setError("Error updating listing: " + err.message);
            console.error("Error:", err);
        } finally {
            setIsSaving(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="edit-listing">
                <div className="loading">
                    <p>Loading property...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !property) {
        return (
            <div className="edit-listing">
                <div className="error-state">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate(-1)}>Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-listing">
            <div className="edit-listing-container">
                {/* Header */}
                <div className="edit-header">
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                    <h1>Edit Listing</h1>
                    <div></div>
                </div>

                {/* Error/Success Messages */}
                {error && <div className="alert alert-error">{error}</div>}
                {success && (
                    <div className="alert alert-success">{success}</div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="listing-form">
                    {/* Basic Information */}
                    <section className="form-section">
                        <h2>Basic Information</h2>

                        <div className="form-group">
                            <label htmlFor="title">Property Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Cozy Beachfront Apartment"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your property in detail."
                                rows="5"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="country">Country *</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    placeholder="e.g., USA"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="city">City *</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="e.g., New York"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Price per Night *</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="e.g., 150"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </section>

                    {/* Property Details */}
                    <section className="form-section">
                        <h2>Property Details</h2>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="bedrooms">Bedrooms *</label>
                                <input
                                    type="number"
                                    id="bedrooms"
                                    name="bedrooms"
                                    value={formData.bedrooms}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 2"
                                    min="1"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="bathrooms">Bathrooms *</label>
                                <input
                                    type="number"
                                    id="bathrooms"
                                    name="bathrooms"
                                    value={formData.bathrooms}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 1"
                                    min="1"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="maxGuests">Max Guests *</label>
                                <input
                                    type="number"
                                    id="maxGuests"
                                    name="maxGuests"
                                    value={formData.maxGuests}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 4"
                                    min="1"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Property Type */}
                    <section className="form-section">
                        <h2>Property Type</h2>
                        <div className="form-group">
                            <label htmlFor="propertyType">
                                What type of property is this? *
                            </label>
                            <select
                                id="propertyType"
                                name="propertyType"
                                value={formData.propertyType}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select property type</option>
                                {propertyTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </section>

                    {/* Amenities */}
                    <section className="form-section">
                        <h2>Amenities</h2>
                        <p className="amenities-subtitle">
                            Select the amenities your property offers.
                        </p>
                        <div className="amenities-grid">
                            {amenitiesList.map((amenity) => (
                                <div
                                    key={amenity.id}
                                    className="checkbox-group"
                                >
                                    <input
                                        type="checkbox"
                                        id={amenity.id}
                                        name={amenity.id}
                                        checked={formData[amenity.id]}
                                        onChange={() =>
                                            handleAmenityToggle(amenity.id)
                                        }
                                    />
                                    <label htmlFor={amenity.id}>
                                        <span className="amenity-icon">
                                            {amenity.icon}
                                        </span>
                                        {amenity.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Additional Information */}
                    <section className="form-section">
                        <h2>Additional Information</h2>

                        <div className="form-group">
                            <label htmlFor="hostGuide">
                                Host Guide (Optional)
                            </label>
                            <textarea
                                id="hostGuide"
                                name="hostGuide"
                                value={formData.hostGuide}
                                onChange={handleInputChange}
                                placeholder="Tips for guests, house rules, checkout times, etc."
                                rows="4"
                            />
                        </div>
                    </section>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditListing;
