import { useState, useEffect } from "react";
import { likesService } from "../services/likesService";
import "./LikeButton.css";
import { authService } from "../services/authService";

/**
 * Like Button Component
 * Allows users to like/unlike properties
 * Shows heart icon that toggles between filled and empty
 */
const LikeButton = ({ propertyId, size = "medium", showCount = false }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const userId = authService.getUserId();

    // Check if property is liked on mount
    useEffect(() => {
        const checkLikeStatus = async () => {
            if (!userId) return;

            try {
                const liked = await likesService.isPropertyLiked(
                    userId,
                    propertyId,
                );
                setIsLiked(liked);
            } catch (error) {
                console.error("Error checking like status:", error);
            }
        };

        checkLikeStatus();
    }, [userId, propertyId]);

    // Fetch like count if enabled
    useEffect(() => {
        const fetchLikeCount = async () => {
            if (!showCount) return;

            try {
                const count =
                    await likesService.getPropertyLikeCount(propertyId);
                setLikeCount(count);
            } catch (error) {
                console.error("Error fetching like count:", error);
            }
        };

        fetchLikeCount();
    }, [propertyId, showCount]);

    // Handle like/unlike
    const handleLikeToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userId) {
            alert("Please log in to like properties");
            return;
        }

        try {
            setLoading(true);

            await likesService.toggleLike(userId, propertyId, isLiked);

            // Update local state
            setIsLiked(!isLiked);

            // Update like count
            if (showCount) {
                setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            alert("Failed to update like status. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`like-button like-button-${size} ${
                isLiked ? "liked" : ""
            }`}
            onClick={handleLikeToggle}
            disabled={loading || !userId}
            title={isLiked ? "Unlike" : "Like"}
        >
            <span className="heart-icon">{isLiked ? "❤️" : "🤍"}</span>
            {showCount && <span className="like-count">{likeCount}</span>}
        </button>
    );
};

export default LikeButton;
