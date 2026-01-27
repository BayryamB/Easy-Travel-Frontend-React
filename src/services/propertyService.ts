// propertyService.ts - Fixed TypeScript Error Handling

import api from "./api";
import axios from "axios";

export const propertyService = {
    // ===== NORMAL STAYS (Short-term) =====

    // Get all short-term properties
    getNormalStays: async () => {
        try {
            const response = await api.get("/normal-stays");
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Get recent short-term properties
    getRecentNormalStays: async () => {
        try {
            const response = await api.get("/normal-stays/recent");
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Get single short-term property
    getNormalStayById: async (id: string) => {
        try {
            const response = await api.get(`/normal-stays/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Create new short-term property
    createNormalStay: async (propertyData: any) => {
        try {
            const response = await api.post("/normal-stays", propertyData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Update short-term property
    updateNormalStay: async (id: string, propertyData: any) => {
        try {
            const response = await api.put(`/normal-stays/${id}`, propertyData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Delete short-term property
    deleteNormalStay: async (id: string) => {
        try {
            await api.delete(`/normal-stays/${id}`);
            return true;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Like short-term property
    likeNormalStay: async (id: string, userId: string) => {
        try {
            const response = await api.post(`/normal-stays/like/${id}`, {
                userId,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Unlike short-term property
    unlikeNormalStay: async (id: string, userId: string) => {
        try {
            const response = await api.post(`/normal-stays/unlike/${id}`, {
                userId,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // ===== LONG-TERM STAYS =====

    // Get all long-term properties
    getLongTermStays: async () => {
        try {
            const response = await api.get("/long-term-stays");
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Get recent long-term properties
    getRecentLongTermStays: async () => {
        try {
            const response = await api.get("/long-term-stays/recent");
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Get single long-term property
    getLongTermStayById: async (id: string) => {
        try {
            const response = await api.get(`/long-term-stays/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Create new long-term property
    createLongTermStay: async (propertyData: any) => {
        try {
            const response = await api.post("/long-term-stays", propertyData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Update long-term property
    updateLongTermStay: async (id: string, propertyData: any) => {
        try {
            const response = await api.put(
                `/long-term-stays/${id}`,
                propertyData,
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Delete long-term property
    deleteLongTermStay: async (id: string) => {
        try {
            await api.delete(`/long-term-stays/${id}`);
            return true;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Like long-term property
    likeLongTermStay: async (id: string, userId: string) => {
        try {
            const response = await api.post(`/long-term-stays/like/${id}`, {
                userId,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Unlike long-term property
    unlikeLongTermStay: async (id: string, userId: string) => {
        try {
            const response = await api.post(`/long-term-stays/unlike/${id}`, {
                userId,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // ===== DESTINATIONS =====

    // Get all destinations
    getDestinations: async () => {
        try {
            const response = await api.get("/destinations");
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Get single destination
    getDestinationById: async (id: string) => {
        try {
            const response = await api.get(`/destinations/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Create new destination
    createDestination: async (destinationData: any) => {
        try {
            const response = await api.post("/destinations", destinationData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Update destination
    updateDestination: async (id: string, destinationData: any) => {
        try {
            const response = await api.put(
                `/destinations/${id}`,
                destinationData,
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },

    // Delete destination
    deleteDestination: async (id: string) => {
        try {
            await api.delete(`/destinations/${id}`);
            return true;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error.response?.data || error.message;
            }
            throw error;
        }
    },
};
