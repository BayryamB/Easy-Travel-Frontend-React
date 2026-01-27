import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const isAuthenticated = authService.isAuthenticated();
    const username = authService.getUsername();

    const handleLogout = () => {
        authService.logout();
        setIsProfileOpen(false);
        setIsMenuOpen(false);
        navigate("/");
    };

    const handleNavClick = () => {
        setIsMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon"></span>
                </Link>

                {/* Menu Toggle Button (Mobile) */}
                <button
                    className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation Links */}
                <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
                    <div className="navbar-links">
                        <Link
                            to="/properties"
                            className={`nav-link ${isActive("/properties")}`}
                            onClick={handleNavClick}
                        >
                            Explore
                        </Link>
                        <a
                            href="/become-host"
                            className="nav-link"
                            onClick={handleNavClick}
                        >
                            Become a Host
                        </a>
                        <a
                            href="#"
                            className="nav-link"
                            onClick={handleNavClick}
                        >
                            Help
                        </a>
                    </div>

                    {/* Auth Section */}
                    <div className="navbar-auth">
                        {isAuthenticated ? (
                            <div className="profile-dropdown">
                                <button
                                    className="profile-button"
                                    onClick={() =>
                                        setIsProfileOpen(!isProfileOpen)
                                    }
                                >
                                    <span className="profile-avatar">
                                        {username?.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="profile-name">
                                        {username}
                                    </span>
                                </button>

                                {isProfileOpen && (
                                    <div className="dropdown-menu">
                                        <Link
                                            to="/profile"
                                            className="dropdown-item"
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                handleNavClick();
                                            }}
                                        >
                                            👤 My Profile
                                        </Link>
                                        <Link
                                            to="/bookings"
                                            className="dropdown-item"
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                handleNavClick();
                                            }}
                                        >
                                            📅 My Bookings
                                        </Link>
                                        <Link
                                            to="/wishlist"
                                            className="dropdown-item"
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                handleNavClick();
                                            }}
                                        >
                                            ❤️ Wishlist
                                        </Link>
                                        <hr className="dropdown-divider" />
                                        <button
                                            className="dropdown-item logout-btn"
                                            onClick={handleLogout}
                                        >
                                            🚪 Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="auth-link login-link"
                                    onClick={handleNavClick}
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn btn-primary btn-small"
                                    onClick={handleNavClick}
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
