// Validate email
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate password (at least 6 characters)
export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

// Validate username (3-20 characters, alphanumeric and underscore)
export const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
};

// Validate phone number
export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9\-\+\s]{10,}$/;
    return phoneRegex.test(phone);
};

// Validate URL
export const validateUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Validate required field
export const isRequired = (
    value: string | number | null | undefined,
): boolean => {
    return value !== null && value !== undefined && value !== "";
};

// Validate number range
export const isInRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
};

// Validate min length
export const hasMinLength = (value: string, minLength: number): boolean => {
    return value.length >= minLength;
};

// Validate max length
export const hasMaxLength = (value: string, maxLength: number): boolean => {
    return value.length <= maxLength;
};

// Validate text field
export const validateTextField = (
    value: string,
    minLength: number = 1,
    maxLength: number = 255,
): boolean => {
    return hasMinLength(value, minLength) && hasMaxLength(value, maxLength);
};

// Validate number field
export const validateNumberField = (
    value: number,
    min: number = 0,
    max: number = Infinity,
): boolean => {
    return !isNaN(value) && isInRange(value, min, max);
};

// Validate date
export const validateDate = (date: string): boolean => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// Validate dates (check-in before check-out)
export const validateCheckInCheckOut = (
    checkIn: string,
    checkOut: string,
): boolean => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return checkInDate < checkOutDate;
};

// Validate rating
export const validateRating = (rating: number): boolean => {
    return isInRange(rating, 1, 5);
};

// Validate price
export const validatePrice = (price: number): boolean => {
    return price > 0;
};

// Validate number of guests
export const validateNumberOfGuests = (
    guests: number,
    maxGuests: number,
): boolean => {
    return guests > 0 && guests <= maxGuests;
};

// Get error message for validation
export const getValidationError = (field: string, type: string): string => {
    const messages: Record<string, Record<string, string>> = {
        email: {
            required: "Email is required",
            invalid: "Please enter a valid email address",
        },
        password: {
            required: "Password is required",
            invalid: "Password must be at least 6 characters",
        },
        username: {
            required: "Username is required",
            invalid:
                "Username must be 3-20 characters (letters, numbers, underscore only)",
        },
        phone: {
            required: "Phone number is required",
            invalid: "Please enter a valid phone number",
        },
        checkIn: {
            required: "Check-in date is required",
            invalid: "Invalid check-in date",
        },
        checkOut: {
            required: "Check-out date is required",
            invalid: "Check-out date must be after check-in date",
        },
        guests: {
            required: "Number of guests is required",
            invalid: "Invalid number of guests",
        },
        rating: {
            required: "Rating is required",
            invalid: "Rating must be between 1 and 5",
        },
    };

    return messages[field]?.[type] || `Invalid ${field}`;
};
