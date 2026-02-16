/**
 * Like Service - TypeScript Version
 * Manages user property likes/favorites
 * Uses User model's likes: [String] array to store property IDs
 */

// Type Definitions
interface LikeResponse {
    success: boolean;
    message: string;
    likes?: string[];
}

interface LikeCheckResponse {
    isLiked: boolean;
}

interface LikedProperty {
    _id: string;
    title: string;
    description?: string;
    price: number;
    location?: string;
    city?: string;
    country?: string;
    cover?: string;
    photos?: string[];
    rating?: number;
    bedroomCount?: number;
    bathroomCount?: number;
    [key: string]: unknown;
}

interface LikedPropertiesResponse {
    likedProperties: LikedProperty[];
}

interface LikeCountResponse {
    likeCount: number;
    propertyId: string;
}

interface ServiceError {
    message: string;
    status?: number;
}

const API_URL = import.meta.env.VITE_API_URL as string;

/**
 * Like Service Class
 * All methods are async and return Promise types
 */
class LikesService {
    /**
     * Add a property to user's likes
     * @param userId - User ID
     * @param propertyId - Property ID to like
     * @returns Updated user likes array
     * @throws ServiceError
     */
    async addLike(userId: string, propertyId: string): Promise<string[]> {
        try {
            const response = await fetch(`${API_URL}/users/${userId}/likes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ propertyId }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw {
                    message: error.message || "Failed to like property",
                    status: response.status,
                } as ServiceError;
            }

            const data = (await response.json()) as LikeResponse;
            return data.likes || [];
        } catch (error) {
            console.error("Error adding like:", error);
            throw error;
        }
    }

    /**
     * Remove a property from user's likes
     * @param userId - User ID
     * @param propertyId - Property ID to unlike
     * @returns Updated user likes array
     * @throws ServiceError
     */
    async removeLike(userId: string, propertyId: string): Promise<string[]> {
        try {
            const response = await fetch(
                `${API_URL}/users/${userId}/likes/${propertyId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                const error = await response.json();
                throw {
                    message: error.message || "Failed to unlike property",
                    status: response.status,
                } as ServiceError;
            }

            const data = (await response.json()) as LikeResponse;
            return data.likes || [];
        } catch (error) {
            console.error("Error removing like:", error);
            throw error;
        }
    }

    /**
     * Toggle like/unlike for a property
     * @param userId - User ID
     * @param propertyId - Property ID
     * @param isLiked - Current like status
     * @returns Updated user likes array
     * @throws ServiceError
     */
    async toggleLike(
        userId: string,
        propertyId: string,
        isLiked: boolean,
    ): Promise<string[]> {
        if (isLiked) {
            return this.removeLike(userId, propertyId);
        } else {
            return this.addLike(userId, propertyId);
        }
    }

    /**
     * Check if user likes a property
     * @param userId - User ID
     * @param propertyId - Property ID
     * @returns True if liked, false otherwise
     */
    async isPropertyLiked(
        userId: string,
        propertyId: string,
    ): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/users/${userId}/likes`);

            const userLikes = (await response.json()) as string[];
            if (!userLikes) {
                return false;
            }
            console.log("User likes", userLikes);

            const isLiked: boolean = userLikes?.includes(propertyId) ?? false;

            if (!response.ok) {
                return false;
            }
            console.log("isLiked:", isLiked);
            return isLiked;
        } catch (error) {
            console.error("Error checking like status:", error);
            return false;
        }
    }

    /**
     * Get all liked property IDs for a user
     * @param userId - User ID
     * @returns Array of liked property IDs
     */
    async getUserLikes(userId: string): Promise<string[]> {
        try {
            const response = await fetch(`${API_URL}/users/${userId}/likes`);

            if (!response.ok) {
                throw {
                    message: "Failed to fetch likes",
                    status: response.status,
                } as ServiceError;
            }

            const data = (await response.json()) as string[];
            return data || [];
        } catch (error) {
            console.error("Error fetching user likes:", error);
            return [];
        }
    }

    /**
     * Get all liked properties with full details
     * @param userId - User ID
     * @returns Array of full property objects
     */
    async getLikedProperties(userId: string): Promise<LikedProperty[]> {
        try {
            const response = await fetch(
                `${API_URL}/users/${userId}/liked-properties`,
            );

            if (!response.ok) {
                throw {
                    message: "Failed to fetch liked properties",
                    status: response.status,
                } as ServiceError;
            }

            const data = (await response.json()) as LikedPropertiesResponse;
            return data.likedProperties || [];
        } catch (error) {
            console.error("Error fetching liked properties:", error);
            return [];
        }
    }

    /**
     * Get like count for a property
     * @param propertyId - Property ID
     * @returns Number of likes for the property
     */
    async getPropertyLikeCount(propertyId: string): Promise<number> {
        try {
            const response = await fetch(
                `${API_URL}/properties/${propertyId}/like-count`,
            );

            if (!response.ok) {
                return 0;
            }

            const data = (await response.json()) as LikeCountResponse;
            return data.likeCount || 0;
        } catch (error) {
            console.error("Error fetching like count:", error);
            return 0;
        }
    }

    /**
     * Batch check like status for multiple properties
     * @param userId - User ID
     * @param propertyIds - Array of property IDs
     * @returns Map of propertyId -> isLiked status
     */
    async checkMultipleLikes(
        userId: string,
        propertyIds: string[],
    ): Promise<Map<string, boolean>> {
        const likeMap = new Map<string, boolean>();

        try {
            const likes = await this.getUserLikes(userId);
            const likeSet = new Set(likes);

            propertyIds.forEach((id) => {
                likeMap.set(id, likeSet.has(id));
            });

            return likeMap;
        } catch (error) {
            console.error("Error checking multiple likes:", error);
            // Return all as false on error
            propertyIds.forEach((id) => {
                likeMap.set(id, false);
            });
            return likeMap;
        }
    }

    /**
     * Get like statistics
     * @param userId - User ID
     * @returns Statistics object
     */
    async getLikeStats(userId: string): Promise<{
        totalLikes: number;
        likeIds: string[];
    }> {
        try {
            const likes = await this.getUserLikes(userId);
            return {
                totalLikes: likes.length,
                likeIds: likes,
            };
        } catch (error) {
            console.error("Error fetching like stats:", error);
            return {
                totalLikes: 0,
                likeIds: [],
            };
        }
    }
}

// Export singleton instance
export const likesService = new LikesService();

// Export type definitions for use in components
export type {
    LikeResponse,
    LikeCheckResponse,
    LikedProperty,
    LikedPropertiesResponse,
    LikeCountResponse,
    ServiceError,
};

export default likesService;
