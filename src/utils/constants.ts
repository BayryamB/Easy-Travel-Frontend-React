// API Configuration
export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3030/api";

// Local Storage Keys
export const STORAGE_KEYS = {
    TOKEN: "token",
    USER_ID: "userId",
    USERNAME: "username",
    USER_EMAIL: "email",
};

// API Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: "Network error. Please check your connection.",
    AUTH_FAILED: "Authentication failed. Please try again.",
    TOKEN_EXPIRED: "Session expired. Please login again.",
    INVALID_INPUT: "Invalid input. Please check your data.",
    NOT_FOUND: "Resource not found.",
    SERVER_ERROR: "Server error. Please try again later.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: "Login successful!",
    REGISTER_SUCCESS: "Registration successful! Please log in.",
    LOGOUT_SUCCESS: "Logged out successfully.",
    BOOKING_CREATED: "Booking created successfully!",
    REVIEW_POSTED: "Review posted successfully!",
    PROFILE_UPDATED: "Profile updated successfully!",
};

// Routes
export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    PROPERTIES: "/properties",
    PROPERTY_DETAIL: "/property/:id",
    BOOKINGS: "/bookings",
    PROFILE: "/profile",
    WISHLIST: "/wishlist",
    NOT_FOUND: "/not-found",
};

// Property Types
export const PROPERTY_TYPES = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "villa", label: "Villa" },
    { value: "condo", label: "Condo" },
    { value: "room", label: "Room" },
];

// Booking Status
export const BOOKING_STATUS = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
};

// Cancellation Policies
export const CANCELLATION_POLICIES = [
    { value: "flexible", label: "Flexible" },
    { value: "moderate", label: "Moderate" },
    { value: "strict", label: "Strict" },
];

// Amenity Categories
export const AMENITY_CATEGORIES = [
    "wifi",
    "parking",
    "kitchen",
    "entertainment",
    "comfort",
    "safety",
    "cleaning",
    "outdoor",
];
