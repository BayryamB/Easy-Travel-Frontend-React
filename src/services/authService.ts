import api from "./api";

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

interface LoginData {
    username: string;
    password: string;
}

interface AuthResponse {
    token: string;
    userId: string;
    username: string;
    email: string;
    message: string;
}

export const authService = {
    // Register new user
    register: async (data: RegisterData): Promise<AuthResponse> => {
        try {
            const response = await api.post<AuthResponse>(
                "/auth/register",
                data,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Login user
    login: async (data: LoginData): Promise<AuthResponse> => {
        try {
            const response = await api.post<AuthResponse>("/auth/login", data);
            // Store token and user info
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("username", response.data.username);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Logout user
    logout: (): void => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
    },

    // Get stored token
    getToken: (): string | null => {
        return localStorage.getItem("token");
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem("token");
    },

    // Get user ID
    getUserId: (): string | null => {
        return localStorage.getItem("userId");
    },

    // Get username
    getUsername: (): string | null => {
        return localStorage.getItem("username");
    },
};
