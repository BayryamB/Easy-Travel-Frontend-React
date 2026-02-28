/**
 * Review Service - TypeScript Version (ADJUSTED FOR BACKEND)
 * Manages all review-related API calls
 */

// Type Definitions
interface ReviewRatings {
    cleanliness?: number;
    communication?: number;
    location?: number;
    accuracy?: number;
}

interface Review {
    _id: string;
    propertyId: string;
    propertyType: "long-term" | "short-term";
    userId: {
        _id: string;
        username: string;
        avatar?: string;
    };
    hostId: string;
    rating: number;
    title?: string;
    comment?: string;
    cleanliness?: number;
    communication?: number;
    location?: number;
    accuracy?: number;
    photos?: string[];
    verified: boolean;
    helpful: number;
    createdAt: string;
    updatedAt: string;
}

interface CreateReviewPayload {
    propertyId: string;
    propertyType: "long-term" | "short-term";
    userId: string;
    hostId: string;
    rating: number;
    title?: string;
    comment?: string;
    cleanliness?: number;
    communication?: number;
    location?: number;
    accuracy?: number;
}

interface ReviewsResponse {
    data?: Review[];
    [key: string]: any;
}

interface ServiceError {
    message: string;
    status?: number;
}

const API_URL = import.meta.env.VITE_API_URL as string;

/**
 * Review Service Class
 */
class ReviewService {
    /**
     * Get reviews for a specific property
     * Handles both array and wrapped response formats
     * @param propertyId - Property ID
     * @returns Array of reviews for the property
     */
    async getPropertyReviews(propertyId: string): Promise<Review[]> {
        try {
            console.log(`Fetching reviews for property: ${propertyId}`);
            const response = await fetch(
                `${API_URL}/reviews/property/${propertyId}`,
            );

            if (!response.ok) {
                console.log("Reviews endpoint returned not ok status");
                return [];
            }

            const data = await response.json();
            console.log("Raw response from backend:", data);

            // Handle different response formats
            let reviews: Review[] = [];

            if (Array.isArray(data)) {
                // Format: [review1, review2, ...]
                reviews = data;
            } else if (data.data && Array.isArray(data.data)) {
                // Format: { data: [review1, review2, ...] }
                reviews = data.data;
            } else if (data && typeof data === "object" && data._id) {
                // Single review object returned
                reviews = [data];
            }

            console.log("Processed reviews:", reviews);
            return reviews;
        } catch (error) {
            console.error("Error fetching property reviews:", error);
            return [];
        }
    }

    /**
     * Get all reviews
     * @returns Array of all reviews
     */
    async getAllReviews(): Promise<Review[]> {
        try {
            const response = await fetch(`${API_URL}/reviews`);

            if (!response.ok) {
                return [];
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                return data;
            } else if (data.data && Array.isArray(data.data)) {
                return data.data;
            }

            return [];
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return [];
        }
    }

    /**
     * Get reviews by user
     * @param userId - User ID
     * @returns Array of reviews written by the user
     */
    async getUserReviews(userId: string): Promise<Review[]> {
        try {
            const response = await fetch(`${API_URL}/reviews/user/${userId}`);

            if (!response.ok) {
                return [];
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                return data;
            } else if (data.data && Array.isArray(data.data)) {
                return data.data;
            }

            return [];
        } catch (error) {
            console.error("Error fetching user reviews:", error);
            return [];
        }
    }

    /**
     * Get single review by ID
     * @param reviewId - Review ID
     * @returns Review object
     */
    async getReviewById(reviewId: string): Promise<Review | null> {
        try {
            const response = await fetch(`${API_URL}/reviews/${reviewId}`);

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            return data.data || data;
        } catch (error) {
            console.error("Error fetching review:", error);
            return null;
        }
    }

    /**
     * Create a new review
     * @param payload - Review data
     * @returns Created review
     * @throws ServiceError
     */
    async createReview(payload: CreateReviewPayload): Promise<Review> {
        try {
            console.log("Creating review with payload:", payload);

            // Helper function to extract ID from object or string
            const extractId = (value: any): string => {
                if (typeof value === "string") {
                    return value;
                }
                if (value && typeof value === "object" && value._id) {
                    return String(value._id);
                }
                return String(value);
            };

            // Ensure all fields are properly typed
            const cleanPayload = {
                ...payload,
                userId: extractId(payload.userId),
                hostId: extractId(payload.hostId),
                propertyId: extractId(payload.propertyId),
                rating: Number(payload.rating),
            };

            console.log("Cleaned payload:", cleanPayload);

            const response = await fetch(`${API_URL}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cleanPayload),
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Backend error response:", errorData);
                throw {
                    message:
                        errorData.message ||
                        errorData.error ||
                        "Failed to create review",
                    status: response.status,
                } as ServiceError;
            }

            const responseData = await response.json();
            console.log("Review created successfully:", responseData);

            // Properly type the response
            const review: Review = responseData.data
                ? responseData.data
                : responseData;
            return review;
        } catch (error) {
            console.error("Error creating review:", error);
            throw error;
        }
    }

    /**
     * Update an existing review
     * @param reviewId - Review ID
     * @param payload - Updated review data
     * @returns Updated review
     * @throws ServiceError
     */
    async updateReview(
        reviewId: string,
        payload: Partial<CreateReviewPayload>,
    ): Promise<Review> {
        try {
            const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.json();
                throw {
                    message: error.message || "Failed to update review",
                    status: response.status,
                } as ServiceError;
            }

            const data = await response.json();
            return data.data || data;
        } catch (error) {
            console.error("Error updating review:", error);
            throw error;
        }
    }

    /**
     * Delete a review
     * @param reviewId - Review ID
     * @throws ServiceError
     */
    async deleteReview(reviewId: string): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw {
                    message: error.message || "Failed to delete review",
                    status: response.status,
                } as ServiceError;
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            throw error;
        }
    }

    /**
     * Mark review as helpful
     * @param reviewId - Review ID
     * @returns Updated review
     */
    async markAsHelpful(reviewId: string): Promise<Review | null> {
        try {
            const response = await fetch(
                `${API_URL}/reviews/${reviewId}/helpful`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            return data.data || data;
        } catch (error) {
            console.error("Error marking review as helpful:", error);
            return null;
        }
    }

    /**
     * Calculate average rating for a property
     * @param reviews - Array of reviews
     * @returns Average rating
     */
    calculateAverageRating(reviews: Review[]): number {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return parseFloat((sum / reviews.length).toFixed(1));
    }

    /**
     * Calculate average for specific rating category
     * @param reviews - Array of reviews
     * @param category - Rating category (cleanliness, communication, etc.)
     * @returns Average for category
     */
    calculateCategoryAverage(
        reviews: Review[],
        category: keyof ReviewRatings,
    ): number {
        const ratings = reviews
            .filter((review) => review[category])
            .map((review) => review[category] || 0);

        if (ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, rating) => acc + rating, 0);
        return parseFloat((sum / ratings.length).toFixed(1));
    }

    /**
     * Get rating distribution for a property
     * @param reviews - Array of reviews
     * @returns Object with count of each rating (1-5)
     */
    getRatingDistribution(reviews: Review[]): Record<number, number> {
        const distribution: Record<number, number> = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        };

        reviews.forEach((review) => {
            if (review.rating >= 1 && review.rating <= 5) {
                distribution[review.rating]++;
            }
        });

        return distribution;
    }
}

// Export singleton instance
export const reviewService = new ReviewService();

// Export type definitions
export type {
    Review,
    ReviewRatings,
    CreateReviewPayload,
    ReviewsResponse,
    ServiceError,
};

export default reviewService;
