import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { propertyService } from "../services/propertyService";
import "./BecomeHost.css";

const BecomeHost = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Select type, 2: Fill form
    const [stayDuration, setStayDuration] = useState(null); // 'short' or 'long'
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const BACKEND_URL = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        country: "",
        city: "",
        price: "",
        bedroomCount: "",
        bathroomCount: "",
        maxGuests: "",
        propertyType: "",
        photos: [],
        cover: "",
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false,
        smoking: false,
        guide: "",
    });

    const handleStayDurationSelect = (type) => {
        setStayDuration(type);
        setStep(2);
        setError("");
    };

    // Fixed: Proper event typing
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        if (error) setError("");
    };

    const handleFileInputClick = () => {
        const fileInput = document.getElementById("photo-upload-input");
        if (fileInput) {
            fileInput.click();
        }
    };

    // FIXED: Proper TypeScript typing for file upload
    const handleFileChange = async (e) => {
        const target = e.target;
        const files = target.files ? Array.from(target.files) : [];

        if (files.length === 0) return;

        setUploading(true);
        setError("");

        try {
            const uploadedUrls = [];

            for (const file of files) {
                const url = await uploadPhotoToBackend(file);
                uploadedUrls.push(url);
            }

            setFormData((prev) => ({
                ...prev,
                photos: [...prev.photos, ...uploadedUrls],
                cover: prev.cover || uploadedUrls[0],
            }));

            setSuccess(
                `${uploadedUrls.length} photo(s) uploaded successfully!`,
            );
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Unknown error";
            setError("Failed to upload photos: " + errorMessage);
            console.error(err);
        } finally {
            setUploading(false);
            target.value = "";
        }
    };

    // Upload photo to backend
    const uploadPhotoToBackend = async (file) => {
        const formDataForUpload = new FormData();
        formDataForUpload.append("photo", file);

        try {
            const response = await fetch(`${BACKEND_URL}/upload`, {
                method: "POST",
                body: formDataForUpload,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Upload failed");
            }

            const data = await response.json();

            return data.data.url;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            throw new Error(`Failed to upload ${file.name}: ${errorMessage}`);
        }
    };

    const removePhoto = (index) => {
        setFormData((prev) => {
            const newPhotos = prev.photos.filter((_, i) => i !== index);
            const newCover =
                prev.cover === prev.photos[index]
                    ? newPhotos.length > 0
                        ? newPhotos[0]
                        : ""
                    : prev.cover;

            return {
                ...prev,
                photos: newPhotos,
                cover: newCover,
            };
        });
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError("Please enter a property title");
            return false;
        }
        if (!formData.description.trim()) {
            setError("Please enter a property description");
            return false;
        }
        if (!formData.country.trim()) {
            setError("Please enter a country");
            return false;
        }
        if (!formData.city.trim()) {
            setError("Please enter a city");
            return false;
        }
        if (!formData.price || formData.price < 1) {
            setError("Please enter a valid price");
            return false;
        }
        if (!formData.bedroomCount || formData.bedroomCount < 1) {
            setError("Please enter number of bedrooms");
            return false;
        }
        if (!formData.bathroomCount || formData.bathroomCount < 1) {
            setError("Please enter number of bathrooms");
            return false;
        }
        if (!formData.maxGuests || formData.maxGuests < 1) {
            setError("Please enter maximum guests");
            return false;
        }
        if (!formData.propertyType) {
            setError("Please select a property type");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                setError("Please log in to list a property");
                setLoading(false);
                return;
            }
            const propertyData = {
                hostId: userId,
                propertyType: formData.propertyType,
                title: formData.title,
                description: formData.description,
                location: {
                    country: formData.country,
                    city: formData.city,
                },
                price: parseFloat(formData.price),
                bedroomCount: parseInt(formData.bedroomCount),
                bathroomCount: parseInt(formData.bathroomCount),
                maxGuests: parseInt(formData.maxGuests),
                photos: formData.photos,
                cover: formData.cover || "https://via.placeholder.com/500x300",
                guide: formData.guide,
                options: {
                    wifi: formData.wifi,
                    parking: formData.parking,
                    breakfast: formData.breakfast,
                    pets: formData.pets,
                    smoking: formData.smoking,
                },
            };

            if (stayDuration === "short") {
                await propertyService.createNormalStay(propertyData);
            } else {
                await propertyService.createLongTermStay(propertyData);
            }

            setSuccess("Property listed successfully! Redirecting...");

            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to list property";
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="become-host">
            {/* Step 1: Select Property Type */}
            {step === 1 && (
                <section className="host-step-1">
                    <div className="host-container">
                        <div className="host-header">
                            <h1>Start Earning with Easy Travel</h1>
                            <p>Choose the type of property you want to list</p>
                        </div>

                        <div className="property-type-cards">
                            <div
                                className="property-card-option"
                                onClick={() =>
                                    handleStayDurationSelect("short")
                                }
                            >
                                <div className="card-icon">🏖️</div>
                                <h3>Short-term Stays</h3>
                                <p className="card-subtitle">
                                    Weekends & Vacation Rentals
                                </p>
                                <ul className="card-features">
                                    <li>✓ Perfect for vacation rentals</li>
                                    <li>✓ Weekend getaways</li>
                                    <li>✓ Holiday properties</li>
                                    <li>✓ Weekly bookings</li>
                                </ul>
                                <button className="btn btn-primary btn-full">
                                    Select
                                </button>
                            </div>

                            <div
                                className="property-card-option"
                                onClick={() => handleStayDurationSelect("long")}
                            >
                                <div className="card-icon">🏠</div>
                                <h3>Long-term Stays</h3>
                                <p className="card-subtitle">
                                    Monthly & Annual Rentals
                                </p>
                                <ul className="card-features">
                                    <li>✓ Monthly rentals</li>
                                    <li>✓ Annual leases</li>
                                    <li>✓ Furnished apartments</li>
                                    <li>✓ Long-term tenants</li>
                                </ul>
                                <button className="btn btn-primary btn-full">
                                    Select
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Step 2: Property Details Form */}
            {step === 2 && (
                <section className="host-step-2">
                    <div className="host-container">
                        <button
                            className="back-button"
                            onClick={() => setStep(1)}
                        >
                            ← Back
                        </button>

                        <div className="host-form-header">
                            <h1>
                                List Your{" "}
                                {stayDuration === "short"
                                    ? "Short-term"
                                    : "Long-term"}{" "}
                                Property
                            </h1>
                            <p>Fill in the details about your property</p>
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        {success && (
                            <div className="success-message">{success}</div>
                        )}

                        <form onSubmit={handleSubmit} className="host-form">
                            {/* Basic Information */}
                            <div className="form-section">
                                <h2>Basic Information</h2>

                                <div className="form-group">
                                    <label className="form-label">
                                        Property Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="e.g., Cozy Beachfront Apartment"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Describe your property in detail..."
                                        rows="5"
                                        disabled={loading}
                                    ></textarea>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Country *
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="e.g., USA"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="e.g., New York"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Price per{" "}
                                        {stayDuration === "short"
                                            ? "Night"
                                            : "Month"}{" "}
                                        *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="e.g., 150"
                                        min="1"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            {/* Property Details */}
                            <div className="form-section">
                                <h2>Property Details</h2>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Bedrooms *
                                        </label>
                                        <input
                                            type="number"
                                            name="bedroomCount"
                                            value={formData.bedroomCount}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="e.g., 2"
                                            min="1"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Bathrooms *
                                        </label>
                                        <input
                                            type="number"
                                            name="bathroomCount"
                                            value={formData.bathroomCount}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="e.g., 1"
                                            min="1"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Max Guests *
                                        </label>
                                        <input
                                            type="number"
                                            name="maxGuests"
                                            value={formData.maxGuests}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="e.g., 4"
                                            min="1"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Property Type Selection */}
                            <div className="form-section">
                                <h2>Property Type</h2>

                                <div className="form-group">
                                    <label className="form-label">
                                        What type of property is this? *
                                    </label>
                                    <select
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleChange}
                                        className="form-control"
                                        disabled={loading}
                                    >
                                        <option value="">
                                            Select property type
                                        </option>
                                        <option value="apartment">
                                            Apartment
                                        </option>
                                        <option value="house">House</option>
                                        <option value="villa">Villa</option>
                                        <option value="condo">Condo</option>
                                        <option value="room">Room</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            {/* Amenities */}
                            <div className="form-section">
                                <h2>Amenities</h2>
                                <p className="section-desc">
                                    Select the amenities your property offers
                                </p>

                                <div className="amenities-grid">
                                    <label className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            name="wifi"
                                            checked={formData.wifi}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        <span>🌐 WiFi</span>
                                    </label>

                                    <label className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            name="parking"
                                            checked={formData.parking}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        <span>🚗 Parking</span>
                                    </label>

                                    <label className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            name="breakfast"
                                            checked={formData.breakfast}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        <span>🍳 Breakfast</span>
                                    </label>

                                    <label className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            name="pets"
                                            checked={formData.pets}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        <span>🐾 Pets Allowed</span>
                                    </label>

                                    <label className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            name="smoking"
                                            checked={formData.smoking}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        <span>🚬 Smoking Allowed</span>
                                    </label>
                                </div>
                            </div>

                            {/* Photos */}
                            <div className="form-section">
                                <h2>Photos</h2>
                                <p className="section-desc">
                                    Upload photos of your property
                                </p>

                                <div
                                    className="file-upload"
                                    onClick={handleFileInputClick}
                                >
                                    <input
                                        id="photo-upload-input"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="file-input"
                                        disabled={loading || uploading}
                                    />
                                    <div className="upload-hint">
                                        <span>
                                            📸{" "}
                                            {uploading
                                                ? "Uploading..."
                                                : "Click to upload photos"}
                                        </span>
                                    </div>
                                </div>

                                {/* Photo Preview */}
                                {formData.photos.length > 0 && (
                                    <div className="photo-preview">
                                        <h3>
                                            Uploaded Photos (
                                            {formData.photos.length})
                                        </h3>
                                        <div className="photo-grid">
                                            {formData.photos.map(
                                                (photo, index) => (
                                                    <div
                                                        key={index}
                                                        className="photo-item"
                                                        style={{
                                                            position:
                                                                "relative",
                                                        }}
                                                    >
                                                        <img
                                                            src={photo}
                                                            alt={`Photo ${index + 1}`}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit:
                                                                    "cover",
                                                            }}
                                                        />
                                                        <div
                                                            className="photo-actions"
                                                            style={{
                                                                display: "flex",
                                                            }}
                                                        >
                                                            <span className="photo-badge">
                                                                {index === 0
                                                                    ? "Cover"
                                                                    : `Photo ${index + 1}`}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                className="photo-delete"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    removePhoto(
                                                                        index,
                                                                    );
                                                                }}
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Additional Info */}
                            <div className="form-section">
                                <h2>Additional Information</h2>

                                <div className="form-group">
                                    <label className="form-label">
                                        Host Guide (Optional)
                                    </label>
                                    <textarea
                                        name="guide"
                                        value={formData.guide}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Tips for guests, house rules, checkout times, etc."
                                        rows="4"
                                        disabled={loading}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    disabled={loading || uploading}
                                >
                                    {loading
                                        ? "Publishing Property..."
                                        : "Publish Property"}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            )}
        </div>
    );
};

export default BecomeHost;
