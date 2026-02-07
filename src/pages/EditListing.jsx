import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BecomeHost.css"; // Reusing BecomeHost CSS

const EditListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const BACKEND_URL = import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

    const [propertyType, setPropertyType] = useState(null); // 'short' or 'long'

    // Property type options - LOWERCASE to match backend
    const propertyTypeOptions = [
        "apartment",
        "house",
        "villa",
        "cabin",
        "condo",
        "townhouse",
        "bungalow",
    ];

    // Fetch property data on mount
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                setError("");

                let response = await fetch(`${BACKEND_URL}/normal-stays/${id}`);
                let data;
                let type = "short";

                if (!response.ok) {
                    response = await fetch(
                        `${BACKEND_URL}/long-term-stays/${id}`,
                    );
                    type = "long";
                }

                if (!response.ok) {
                    throw new Error("Property not found");
                }

                data = await response.json();
                setPropertyType(type);

                // Extract country and city from location
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
                const photos = data.photos || [];

                // Normalize propertyType to lowercase
                let normalizedPropertyType = data.propertyType || "";
                if (normalizedPropertyType) {
                    normalizedPropertyType =
                        normalizedPropertyType.toLowerCase();
                }

                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    country: country,
                    city: city,
                    price: data.price || "",
                    bedroomCount: data.bedroomCount || data.bedrooms || "",
                    bathroomCount: data.bathroomCount || data.bathrooms || "",
                    maxGuests: data.maxGuests || "",
                    propertyType: normalizedPropertyType,
                    photos: photos,
                    cover: data.cover || photos[0] || "",
                    wifi: data.wifi || false,
                    parking: data.parking || false,
                    breakfast: data.breakfast || false,
                    pets: data.pets || false,
                    smoking: data.smoking || false,
                    guide: data.guide || "",
                });
            } catch (err) {
                setError(
                    "Failed to load property. " +
                        (err instanceof Error ? err.message : "Unknown error"),
                );
                console.error("Error fetching property:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id, BACKEND_URL]);

    // Handle form input change
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

    // Handle file input click
    const handleFileInputClick = () => {
        const fileInput = document.getElementById("photo-upload-input");
        if (fileInput) {
            fileInput.click();
        }
    };

    // Handle file upload
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

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(""), 3000);
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

    // Remove photo
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

    // Validate form
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
        if (!formData.propertyType.trim()) {
            setError("Please select a property type");
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            // Combine country and city into location
            const location = `${formData.city}, ${formData.country}`;

            // IMPORTANT: Ensure propertyType is lowercase
            const updateData = {
                title: formData.title,
                description: formData.description,
                location: location,
                country: formData.country,
                city: formData.city,
                price: parseFloat(formData.price),
                bedroomCount: parseInt(formData.bedroomCount),
                bathroomCount: parseInt(formData.bathroomCount),
                maxGuests: parseInt(formData.maxGuests),
                propertyType: formData.propertyType.toLowerCase(), // ENSURE LOWERCASE
                photos: formData.photos,
                cover: formData.cover,
                wifi: formData.wifi,
                parking: formData.parking,
                breakfast: formData.breakfast,
                pets: formData.pets,
                smoking: formData.smoking,
                guide: formData.guide,
            };

            console.log("Sending data:", updateData); // Debug log

            const endpoint =
                propertyType === "long"
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
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update property");
            }

            setSuccess("✓ Property updated successfully!");

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate("/host-dashboard");
            }, 2000);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Unknown error";
            setError("Error updating property: " + errorMessage);
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="become-host">
                <section className="container">
                    <div className="loading-state">
                        <p>Loading property...</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="become-host">
            <section className="container">
                <div className="content">
                    {/* Header */}
                    <div className="header-section">
                        <button
                            className="back-button"
                            onClick={() => navigate(-1)}
                        >
                            ← Back
                        </button>
                        <h1>Edit Listing</h1>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="alert alert-error">
                            <span>✕ {error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success">
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="form-container">
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
                                    disabled={submitting}
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
                                    placeholder="Describe your property in detail."
                                    rows="5"
                                    disabled={submitting}
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
                                        disabled={submitting}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="e.g., New York"
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Price per Night *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="e.g., 150"
                                    disabled={submitting}
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
                                        disabled={submitting}
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
                                        disabled={submitting}
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
                                        disabled={submitting}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Property Type */}
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
                                    disabled={submitting}
                                >
                                    <option value="">
                                        Select property type
                                    </option>
                                    {propertyTypeOptions.map((type) => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() +
                                                type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="form-section">
                            <h2>Amenities</h2>
                            <p className="section-desc">
                                Select the amenities your property offers.
                            </p>

                            <div className="checkbox-group-container">
                                <label className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        name="wifi"
                                        checked={formData.wifi}
                                        onChange={handleChange}
                                        disabled={submitting}
                                    />
                                    <span>📶 WiFi</span>
                                </label>

                                <label className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        name="parking"
                                        checked={formData.parking}
                                        onChange={handleChange}
                                        disabled={submitting}
                                    />
                                    <span>🚗 Parking</span>
                                </label>

                                <label className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        name="breakfast"
                                        checked={formData.breakfast}
                                        onChange={handleChange}
                                        disabled={submitting}
                                    />
                                    <span>🍳 Breakfast</span>
                                </label>

                                <label className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        name="pets"
                                        checked={formData.pets}
                                        onChange={handleChange}
                                        disabled={submitting}
                                    />
                                    <span>🐾 Pets Allowed</span>
                                </label>

                                <label className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        name="smoking"
                                        checked={formData.smoking}
                                        onChange={handleChange}
                                        disabled={submitting}
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
                                    disabled={submitting || uploading}
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
                                        {formData.photos.map((photo, index) => (
                                            <div
                                                key={index}
                                                className="photo-item"
                                                style={{
                                                    position: "relative",
                                                }}
                                            >
                                                <img
                                                    src={photo}
                                                    alt={`Photo ${index + 1}`}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
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
                                                            : `Photo ${
                                                                  index + 1
                                                              }`}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="photo-delete"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            removePhoto(index);
                                                        }}
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Information */}
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
                                    disabled={submitting}
                                ></textarea>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate(-1)}
                                disabled={submitting || uploading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={submitting || uploading}
                            >
                                {submitting ? "Updating..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default EditListing;
