import "./ReviewCard.css";

const ReviewCard = ({ review, onMarkHelpful, onDelete, canDelete = false }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const renderStars = (rating) => {
        return (
            <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= rating ? "filled" : ""}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="review-card">
            {/* Header */}
            <div className="review-header">
                <div className="reviewer-info">
                    <h4 className="reviewer-name">
                        {review.userId?.username || "Anonymous"}
                    </h4>
                    {review.verified && (
                        <span className="verified-badge">✓ Verified Stay</span>
                    )}
                </div>
                <div className="review-date">
                    {formatDate(review.createdAt)}
                </div>
            </div>

            {/* Rating */}
            <div className="review-rating">
                {renderStars(review.rating)}
                <span className="rating-text">{review.rating}.0</span>
            </div>

            {/* Title & Comment */}
            {review.title && <h5 className="review-title">{review.title}</h5>}
            {review.comment && (
                <p className="review-comment">{review.comment}</p>
            )}

            {/* Category Ratings */}
            {(review.cleanliness ||
                review.communication ||
                review.location ||
                review.accuracy) && (
                <div className="category-ratings">
                    {review.cleanliness && (
                        <div className="category">
                            <span>🧹 Cleanliness</span>
                            <div className="mini-stars">
                                {renderStars(review.cleanliness)}
                            </div>
                        </div>
                    )}
                    {review.communication && (
                        <div className="category">
                            <span>💬 Communication</span>
                            <div className="mini-stars">
                                {renderStars(review.communication)}
                            </div>
                        </div>
                    )}
                    {review.location && (
                        <div className="category">
                            <span>📍 Location</span>
                            <div className="mini-stars">
                                {renderStars(review.location)}
                            </div>
                        </div>
                    )}
                    {review.accuracy && (
                        <div className="category">
                            <span>✓ Accuracy</span>
                            <div className="mini-stars">
                                {renderStars(review.accuracy)}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Photos */}
            {review.photos && review.photos.length > 0 && (
                <div className="review-photos">
                    {review.photos.map((photo, index) => (
                        <img
                            key={index}
                            src={photo}
                            alt={`Review photo ${index + 1}`}
                            className="review-photo"
                        />
                    ))}
                </div>
            )}

            {/* Footer Actions */}
            <div className="review-footer">
                <button
                    className="helpful-btn"
                    onClick={() => onMarkHelpful?.(review._id)}
                >
                    👍 Helpful ({review.helpful})
                </button>

                {canDelete && (
                    <button
                        className="delete-btn"
                        onClick={() => onDelete?.(review._id)}
                    >
                        🗑️ Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReviewCard;
