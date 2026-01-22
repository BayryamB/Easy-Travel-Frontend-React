// Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import {
    validateEmail,
    validatePassword,
    validateUsername,
} from "../utils/validators";
import { getErrorMessage } from "../utils/helpers";
import "./Register.css";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
        } else if (!validateUsername(formData.username)) {
            newErrors.username =
                "Username must be 3-20 characters (letters, numbers, underscore only)";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (!validatePassword(formData.password)) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
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

        try {
            await authService.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            navigate("/login");
        } catch (error) {
            const errorMsg = getErrorMessage(error);
            setErrorMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-wrapper">
                <div className="register-illustration">
                    {/* Same as login illustration */}
                </div>

                <div className="register-card">
                    <div className="register-header">
                        <h1>Create Account</h1>
                        <p>Join Easy Travel and start exploring</p>
                    </div>

                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`form-control ${errors.username ? "form-error-input" : ""}`}
                                placeholder="Choose a username"
                                disabled={loading}
                            />
                            {errors.username && (
                                <span className="form-error">
                                    {errors.username}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-control ${errors.email ? "form-error-input" : ""}`}
                                placeholder="Enter your email"
                                disabled={loading}
                            />
                            {errors.email && (
                                <span className="form-error">
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-control ${errors.password ? "form-error-input" : ""}`}
                                placeholder="Create a password"
                                disabled={loading}
                            />
                            {errors.password && (
                                <span className="form-error">
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`form-control ${errors.confirmPassword ? "form-error-input" : ""}`}
                                placeholder="Confirm your password"
                                disabled={loading}
                            />
                            {errors.confirmPassword && (
                                <span className="form-error">
                                    {errors.confirmPassword}
                                </span>
                            )}
                        </div>

                        <label className="terms-label">
                            <input type="checkbox" required />
                            <span>
                                I agree to the Terms of Service and Privacy
                                Policy
                            </span>
                        </label>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Already have an account?</p>
                        <Link to="/login" className="auth-link">
                            Sign in here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
