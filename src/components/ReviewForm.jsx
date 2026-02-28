import { useState } from "react";
import { reviewService } from "../services/reviewService";
import "./ReviewForm.css";
import { authService } from "../services/authService";

const ReviewForm = ({ propertyId, propertyType, hostId, onSubmit }) => {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        rating: 5,
        title: "",
        comment: "",
        cleanliness: 5,
        communication: 5,
        location: 5,
        accuracy: 5,
    });

    const CurrentUserId = authService.getUserId();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: [
                "rating",
                "cleanliness",
                "communication",
                "location",
                "accuracy",
            ].includes(name)
                ? parseInt(value)
                : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = CurrentUserId;
        if (!userId) {
            setError("Please log in to submit a review");
            return;
        }

        if (!formData.rating || !formData.comment.trim()) {
            setError("Please provide a rating and comment");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const payload = {
                propertyId,
                propertyType,
                userId,
                hostId,
                rating: formData.rating,
                title: formData.title || undefined,
                comment: formData.comment,
                cleanliness: formData.cleanliness || undefined,
                communication: formData.communication || undefined,
                location: formData.location || undefined,
                accuracy: formData.accuracy || undefined,
            };
            console.log(payload);

            await reviewService.createReview(payload);

            setSuccess(true);
            setFormData({
                rating: 5,
                title: "",
                comment: "",
                cleanliness: 5,
                communication: 5,
                location: 5,
                accuracy: 5,
            });
            setShowForm(false);

            setTimeout(() => setSuccess(false), 3000);
            onSubmit?.();
        } catch (err) {
            console.error("Error submitting review:", err);
            setError("Failed to submit review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderStarRating = (name, label, value) => (
        <div className="rating-field">
            <label>{label}</label>
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <input
                        key={star}
                        type="radio"
                        name={name}
                        value={star}
                        checked={value === star}
                        onChange={handleChange}
                        className="star-input"
                        id={`${name}-${star}`}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="review-form-container">
            {success && (
                <div className="success-message">
                    ✓ Thank you! Your review has been posted.
                </div>
            )}

            {!showForm ? (
                <button
                    className="write-review-btn"
                    onClick={() => setShowForm(true)}
                >
                    ✏️ Write a Review
                </button>
            ) : (
                <div className="review-form">
                    <div className="form-header">
                        <h3>Share Your Experience</h3>
                        <button
                            type="button"
                            className="close-btn"
                            onClick={() => setShowForm(false)}
                        >
                            ✕
                        </button>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Overall Rating */}
                        {renderStarRating(
                            "rating",
                            "Overall Rating",
                            formData.rating,
                        )}

                        {/* Title */}
                        <div className="form-group">
                            <label htmlFor="title">Review Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Amazing place to stay"
                                maxLength={100}
                            />
                        </div>

                        {/* Comment */}
                        <div className="form-group">
                            <label htmlFor="comment">Your Review *</label>
                            <textarea
                                id="comment"
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                placeholder="Share your experience..."
                                rows={4}
                                required
                            />
                        </div>

                        {/* Category Ratings */}
                        <div className="category-ratings-form">
                            <h4>Rate These Aspects</h4>
                            {renderStarRating(
                                "cleanliness",
                                "🧹 Cleanliness",
                                formData.cleanliness,
                            )}
                            {renderStarRating(
                                "communication",
                                "💬 Communication",
                                formData.communication,
                            )}
                            {renderStarRating(
                                "location",
                                "📍 Location",
                                formData.location,
                            )}
                            {renderStarRating(
                                "accuracy",
                                "✓ Accuracy",
                                formData.accuracy,
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Post Review"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ReviewForm;
