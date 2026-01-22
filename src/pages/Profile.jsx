import { useState } from "react";
import { authService } from "../services/authService";
import "./Profile.css";

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const username = authService.getUsername();
    const userId = authService.getUserId();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        bio: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            // Here you would call userService to update profile
            setMessage("Profile updated successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Failed to update profile");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="container">
                <h1>My Profile</h1>

                <div className="profile-wrapper">
                    {/* Profile Avatar Section */}
                    <div className="profile-sidebar">
                        <div className="profile-avatar-large">
                            {username?.charAt(0).toUpperCase()}
                        </div>
                        <h2>{username}</h2>
                        <p className="user-id">ID: {userId?.slice(-8)}</p>
                        <button className="btn btn-outline">
                            Upload Photo
                        </button>
                    </div>

                    {/* Profile Form */}
                    <div className="profile-form-section">
                        {message && (
                            <div
                                className={`message ${message.includes("success") ? "success" : "error"}`}
                            >
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Your first name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Your last name"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Tell us about yourself"
                                    rows="4"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
