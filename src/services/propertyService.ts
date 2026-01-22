import api from "./api";

export interface Property {
    _id: string;
    hostId: string;
    title: string;
    location: {
        country: string;
        city: string;
        address?: string;
    };
    bedroomCount: number;
    bathroomCount: number;
    maxGuests: number;
    propertyType: string;
    price: number;
    pricePerNight?: number;
    rating?: number;
    cover?: string;
    photos?: string[];
    description?: string;
    likes?: string[];
    createdAt?: string;
}

export const propertyService = {
    // Get all short-term stays
    getNormalStays: async (): Promise<Property[]> => {
        try {
            const response = await api.get<Property[]>("/normal-stays");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get recent short-term stays
    getRecentNormalStays: async (): Promise<Property[]> => {
        try {
            const response = await api.get<Property[]>("/normal-stays/recent");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single short-term stay
    getNormalStay: async (id: string): Promise<Property> => {
        try {
            const response = await api.get<Property>(`/normal-stays/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get all long-term stays
    getLongTermStays: async (): Promise<Property[]> => {
        try {
            const response = await api.get<Property[]>("/long-term-stays");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get recent long-term stays
    getRecentLongTermStays: async (): Promise<Property[]> => {
        try {
            const response = await api.get<Property[]>(
                "/long-term-stays/recent",
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single long-term stay
    getLongTermStay: async (id: string): Promise<Property> => {
        try {
            const response = await api.get<Property>(`/long-term-stays/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get all destinations
    getDestinations: async (): Promise<Property[]> => {
        try {
            const response = await api.get<Property[]>("/destinations");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single destination
    getDestination: async (id: string): Promise<Property> => {
        try {
            const response = await api.get<Property>(`/destinations/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Like a property
    likeProperty: async (
        propertyId: string,
        type: "normal" | "long",
    ): Promise<void> => {
        try {
            const endpoint =
                type === "normal" ? "/normal-stays" : "/long-term-stays";
            await api.post(`${endpoint}/${propertyId}/like`, {
                userId: localStorage.getItem("userId"),
            });
        } catch (error) {
            throw error;
        }
    },

    // Unlike a property
    unlikeProperty: async (
        propertyId: string,
        userId: string,
        type: "normal" | "long",
    ): Promise<void> => {
        try {
            const endpoint =
                type === "normal" ? "/normal-stays" : "/long-term-stays";
            await api.delete(`${endpoint}/${propertyId}/unlike/${userId}`);
        } catch (error) {
            throw error;
        }
    },
};
