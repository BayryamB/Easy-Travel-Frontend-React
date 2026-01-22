import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="error-code">404</h1>
                <h2 className="error-title">Page Not Found</h2>
                <p className="error-message">
                    Sorry, the page you're looking for doesn't exist or has been
                    moved.
                </p>

                <div className="error-illustration">
                    <span>🔍</span>
                </div>

                <div className="error-actions">
                    <Link to="/" className="btn btn-primary btn-lg">
                        Go Home
                    </Link>
                    <Link to="/properties" className="btn btn-secondary btn-lg">
                        Browse Properties
                    </Link>
                </div>

                <p className="error-suggestion">
                    Need help? <Link to="#contact">Contact us</Link>
                </p>
            </div>
        </div>
    );
};

export default NotFound;
