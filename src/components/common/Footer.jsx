import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Footer Content */}
                <div className="footer-content">
                    {/* Support */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Support</h4>
                        <ul className="footer-links">
                            <li>
                                <a href="#help">Help Center</a>
                            </li>
                            <li>
                                <a href="#safety">Safety Information</a>
                            </li>
                            <li>
                                <a href="#cancellation">Cancellation options</a>
                            </li>
                            <li>
                                <a href="#disability">Disability support</a>
                            </li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Community</h4>
                        <ul className="footer-links">
                            <li>
                                <a href="#blog">Travel blog</a>
                            </li>
                            <li>
                                <a href="#community">
                                    Support Afghanistan refugees
                                </a>
                            </li>
                            <li>
                                <a href="#celebrate">Celebrate diversity</a>
                            </li>
                            <li>
                                <a href="#updates">Latest news & updates</a>
                            </li>
                        </ul>
                    </div>

                    {/* Hosting */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Hosting</h4>
                        <ul className="footer-links">
                            <li>
                                <a href="#list">List Your Property</a>
                            </li>
                            <li>
                                <a href="#resources">Hosting Resources</a>
                            </li>
                            <li>
                                <a href="#guide">Hosting Guidelines</a>
                            </li>
                            <li>
                                <a href="#feature">Feature your listing</a>
                            </li>
                        </ul>
                    </div>

                    {/* About */}
                    <div className="footer-section">
                        <h4 className="footer-heading">About</h4>
                        <ul className="footer-links">
                            <li>
                                <a href="#about">About Easy Travel</a>
                            </li>
                            <li>
                                <a href="#careers">Careers</a>
                            </li>
                            <li>
                                <a href="#press">Press & media</a>
                            </li>
                            <li>
                                <Link to="/">Learn more</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Divider */}
                <div className="footer-divider"></div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="footer-left">
                        <p className="footer-copyright">
                            &copy; {currentYear} Easy Travel, Inc. All rights
                            reserved.
                        </p>
                        <div className="footer-bottom-links">
                            <a href="#privacy">Privacy</a>
                            <a href="#terms">Terms</a>
                            <a href="#sitemap">Sitemap</a>
                        </div>
                    </div>

                    <div className="footer-right">
                        <div className="footer-selector">
                            <button className="selector-btn">
                                <span>🌐</span> English (US)
                            </button>
                            <button className="selector-btn">
                                <span>💵</span> USD
                            </button>
                        </div>

                        <div className="footer-social">
                            <a
                                href="#facebook"
                                className="social-link"
                                title="Facebook"
                            >
                                f
                            </a>
                            <a
                                href="#twitter"
                                className="social-link"
                                title="Twitter"
                            >
                                𝕏
                            </a>
                            <a
                                href="#instagram"
                                className="social-link"
                                title="Instagram"
                            >
                                📷
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
