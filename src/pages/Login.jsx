import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { validatePassword } from "../utils/validators";
import { getErrorMessage } from "../utils/helpers";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (!validatePassword(formData.password)) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await authService.login({
                username: formData.username,
                password: formData.password,
            });

            setSuccessMessage("Login successful! Redirecting...");
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error) {
            const errorMsg = getErrorMessage(error);
            setErrorMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <h1>Welcome Back</h1>
                        <p>Sign in to your Easy Travel account</p>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div className="success-message">{successMessage}</div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        {/* Username Field */}
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`form-control ${errors.username ? "form-error-input" : ""}`}
                                placeholder="Enter your username"
                                disabled={loading}
                            />
                            {errors.username && (
                                <span className="form-error">
                                    {errors.username}
                                </span>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-control ${errors.password ? "form-error-input" : ""}`}
                                placeholder="Enter your password"
                                disabled={loading}
                            />
                            {errors.password && (
                                <span className="form-error">
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" name="remember" />
                                <span>Remember me</span>
                            </label>
                            <Link to="#forgot" className="forgot-link">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="form-divider">
                        <span>or</span>
                    </div>

                    {/* Social Login (Optional) */}
                    <div className="social-login">
                        <button
                            className="social-btn google-btn"
                            disabled={loading}
                        >
                            <span>🔍</span> Google
                        </button>
                        <button
                            className="social-btn facebook-btn"
                            disabled={loading}
                        >
                            <span>f</span> Facebook
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="auth-footer">
                        <p>Don't have an account?</p>
                        <Link to="/register" className="auth-link">
                            Create one here
                        </Link>
                    </div>
                </div>

                {/* Side Illustration */}
                <div className="login-illustration">
                    <div className="illustration-content">
                        <h2>Easy Travel</h2>
                        <p>Find your perfect getaway</p>
                        <div className="illustration-features">
                            <div className="feature">
                                <span className="feature-icon">🏠</span>
                                <span>Find Properties</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">📅</span>
                                <span>Easy Booking</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">⭐</span>
                                <span>Great Reviews</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
