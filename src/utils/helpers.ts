// Format price to currency
export const formatPrice = (
    price: number,
    currency: string = "USD",
): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(price);
};

// Format date to readable format
export const formatDate = (date: string | Date): string => {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date));
};

// Format date to input format (YYYY-MM-DD)
export const formatDateToInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// Calculate number of nights between two dates
export const calculateNights = (checkIn: Date, checkOut: Date): number => {
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Calculate total price
export const calculateTotal = (
    pricePerNight: number,
    nights: number,
    serviceFee: number = 0,
    cleaningFee: number = 0,
    tax: number = 0,
): number => {
    const subtotal = pricePerNight * nights;
    return subtotal + serviceFee + cleaningFee + tax;
};

// Truncate text
export const truncateText = (text: string, length: number): string => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
};

// Get initials from name
export const getInitials = (name: string): string => {
    return name
        .split(" ")
        .map((word) => word[0].toUpperCase())
        .join("");
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("token");
};

// Get stored token
export const getToken = (): string | null => {
    return localStorage.getItem("token");
};

// Get user ID from storage
export const getUserId = (): string | null => {
    return localStorage.getItem("userId");
};

// Format error message from API
export const getErrorMessage = (error: any): string => {
    if (error.response?.data?.error) {
        return error.response.data.error;
    }
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return "An error occurred. Please try again.";
};

// Calculate average rating
export const calculateAverageRating = (ratings: number[]): number => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
};

// Check if date is in the past
export const isPastDate = (date: Date): boolean => {
    return date < new Date();
};

// Get time ago string (e.g., "2 days ago")
export const getTimeAgo = (date: string | Date): string => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDate(past);
};
