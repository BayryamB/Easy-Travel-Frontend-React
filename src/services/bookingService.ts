import api from "./api";

export interface BookingData {
    propertyId: string;
    propertyType: "long-term" | "short-term";
    guestId: string;
    hostId: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    pricing: {
        pricePerNight: number;
        numberOfNights: number;
        subtotal: number;
        serviceFee: number;
        cleaningFee: number;
        tax: number;
        total: number;
    };
    specialRequests?: string;
}

export interface Booking extends BookingData {
    _id: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    createdAt: string;
    updatedAt: string;
}

export const bookingService = {
    // Get all bookings
    getAllBookings: async (): Promise<Booking[]> => {
        try {
            const response = await api.get<Booking[]>("/bookings");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get guest's bookings
    getGuestBookings: async (guestId: string): Promise<Booking[]> => {
        try {
            const response = await api.get<Booking[]>(
                `/bookings/guest/${guestId}`,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get host's bookings
    getHostBookings: async (hostId: string): Promise<Booking[]> => {
        try {
            const response = await api.get<Booking[]>(
                `/bookings/host/${hostId}`,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get single booking
    getBooking: async (bookingId: string): Promise<Booking> => {
        try {
            const response = await api.get<Booking>(`/bookings/${bookingId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create booking
    createBooking: async (data: BookingData): Promise<Booking> => {
        try {
            const response = await api.post<Booking>("/bookings", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update booking
    updateBooking: async (
        bookingId: string,
        data: Partial<BookingData>,
    ): Promise<Booking> => {
        try {
            const response = await api.put<Booking>(
                `/bookings/${bookingId}`,
                data,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Confirm booking
    confirmBooking: async (bookingId: string): Promise<Booking> => {
        try {
            const response = await api.post<Booking>(
                `/bookings/${bookingId}/confirm`,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Complete booking
    completeBooking: async (bookingId: string): Promise<Booking> => {
        try {
            const response = await api.post<Booking>(
                `/bookings/${bookingId}/complete`,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Cancel booking
    cancelBooking: async (
        bookingId: string,
        reason: string,
        refundAmount: number,
    ): Promise<Booking> => {
        try {
            const response = await api.post<Booking>(
                `/bookings/${bookingId}/cancel`,
                {
                    cancellationReason: reason,
                    refundAmount,
                },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete booking
    deleteBooking: async (bookingId: string): Promise<void> => {
        try {
            await api.delete(`/bookings/${bookingId}`);
        } catch (error) {
            throw error;
        }
    },
};
