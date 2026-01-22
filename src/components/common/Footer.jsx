import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Footer Content */}
                <div className="footer-content">
                    {/* Company Info */}
                    <div className="footer-section">
                        <h3 className="footer-title">Easy Travel</h3>
                        <p className="footer-description">
                            Your trusted platform for finding the perfect
                            accommodation for any journey.
                        </p>
                        <div className="footer-social">
                            <a
                                href="#"
                                className="social-link"
                                aria-label="Facebook"
                            >
                                f
                            </a>
                            <a
                                href="#"
                                className="social-link"
                                aria-label="Twitter"
                            >
                                𝕏
                            </a>
                            <a
                                href="#"
                                className="social-link"
                                aria-label="Instagram"
                            >
                                📷
                            </a>
                            <a
                                href="#"
                                className="social-link"
                                aria-label="LinkedIn"
                            >
                                in
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-subtitle">Quick Links</h4>
                        <ul className="footer-links">
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/properties">Browse Properties</Link>
                            </li>
                            <li>
                                <Link to="/about">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Hosting */}
                    <div className="footer-section">
                        <h4 className="footer-subtitle">Host</h4>
                        <ul className="footer-links">
                            <li>
                                <a href="#list">List Your Property</a>
                            </li>
                            <li>
                                <a href="#hosting">Hosting Resources</a>
                            </li>
                            <li>
                                <a href="#community">Community</a>
                            </li>
                            <li>
                                <a href="#guide">Host Guide</a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="footer-section">
                        <h4 className="footer-subtitle">Support</h4>
                        <ul className="footer-links">
                            <li>
                                <a href="#help">Help Center</a>
                            </li>
                            <li>
                                <a href="#safety">Safety & Fraud</a>
                            </li>
                            <li>
                                <a href="#terms">Terms of Service</a>
                            </li>
                            <li>
                                <a href="#privacy">Privacy Policy</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        &copy; {currentYear} Easy Travel. All rights reserved.
                    </p>
                    <div className="footer-bottom-links">
                        <a href="#privacy">Privacy</a>
                        <a href="#terms">Terms</a>
                        <a href="#sitemap">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
