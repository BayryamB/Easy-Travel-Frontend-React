import { useState, useEffect } from "react";
import { reviewService } from "../services/reviewService";
import ReviewCard from "./ReviewCard";
import "./ReviewList.css";

const ReviewList = ({ propertyId, onReviewDeleted }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [avgRating, setAvgRating] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const fetchedReviews =
                    await reviewService.getPropertyReviews(propertyId);
                setReviews(fetchedReviews);
                console.log(fetchedReviews);

                if (fetchedReviews.length > 0) {
                    const avg =
                        reviewService.calculateAverageRating(fetchedReviews);
                    setAvgRating(avg);
                }
                setError(null);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setError("Failed to load reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [propertyId]);

    const handleMarkHelpful = async (reviewId) => {
        try {
            const updated = await reviewService.markAsHelpful(reviewId);
            if (updated) {
                setReviews((prev) =>
                    prev.map((r) =>
                        r._id === reviewId
                            ? { ...r, helpful: updated.helpful }
                            : r,
                    ),
                );
            }
        } catch (err) {
            console.error("Error marking as helpful:", err);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            await reviewService.deleteReview(reviewId);
            setReviews((prev) => prev.filter((r) => r._id !== reviewId));
            onReviewDeleted?.();
        } catch (err) {
            console.error("Error deleting review:", err);
            alert("Failed to delete review");
        }
    };

    const getCurrentUserId = () => {
        try {
            const user = localStorage.getItem("user");
            return user ? JSON.parse(user).id : null;
        } catch {
            return null;
        }
    };

    const userId = getCurrentUserId();

    if (loading) {
        return <div className="reviews-loading">Loading reviews...</div>;
    }

    if (error) {
        return <div className="reviews-error">{error}</div>;
    }

    if (reviews.length === 0) {
        return (
            <div className="reviews-empty">
                No reviews yet. Be the first to review!
            </div>
        );
    }

    return (
        <div className="reviews-list-container">
            {/* Summary */}
            <div className="reviews-summary">
                <div className="rating-summary">
                    <div className="average-rating">
                        <span className="rating-number">{avgRating}</span>
                        <span className="rating-stars">⭐</span>
                    </div>
                    <div className="rating-info">
                        <p className="rating-text">
                            {avgRating} out of 5 ({reviews.length}{" "}
                            {reviews.length === 1 ? "review" : "reviews"})
                        </p>
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div className="reviews-list">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review._id}
                        review={review}
                        onMarkHelpful={handleMarkHelpful}
                        onDelete={handleDelete}
                        canDelete={userId === review.userId._id}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
