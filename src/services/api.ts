import axios, { AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Handle responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If token expired, redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);

export default api;
