import api from "./api";

export interface ReviewData {
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

export interface Review extends ReviewData {
    _id: string;
    verified?: boolean;
    helpful: number;
    createdAt: string;
    updatedAt: string;
}

export const reviewService = {
    // Get all reviews
    getAllReviews: async (): Promise<Review[]> => {
        try {
            const response = await api.get<Review[]>("/reviews");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get reviews by property ID
    getPropertyReviews: async (propertyId: string): Promise<Review[]> => {
        try {
            const response = await api.get<Review[]>(
                `/reviews/property/${propertyId}`,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get reviews by user ID
    getUserReviews: async (userId: string): Promise<Review[]> => {
        try {
            const response = await api.get<Review[]>(`/reviews/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single review
    getReview: async (reviewId: string): Promise<Review> => {
        try {
            const response = await api.get<Review>(`/reviews/${reviewId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create review
    createReview: async (data: ReviewData): Promise<Review> => {
        try {
            const response = await api.post<Review>("/reviews", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update review
    updateReview: async (
        reviewId: string,
        data: Partial<ReviewData>,
    ): Promise<Review> => {
        try {
            const response = await api.put<Review>(
                `/reviews/${reviewId}`,
                data,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete review
    deleteReview: async (reviewId: string): Promise<void> => {
        try {
            await api.delete(`/reviews/${reviewId}`);
        } catch (error) {
            throw error;
        }
    },

    // Mark review as helpful
    markHelpful: async (reviewId: string): Promise<Review> => {
        try {
            const response = await api.post<Review>(
                `/reviews/${reviewId}/helpful`,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
