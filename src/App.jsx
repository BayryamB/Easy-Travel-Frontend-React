import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { authService } from "./services/authService";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// Pages
import Home from "./pages/Home";
import BecomeHost from "./pages/BecomeHost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertiesList from "./pages/PropertiesList";
import PropertyDetail from "./pages/PropertyDetail";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import PropertyDetails from "./pages/PropertyDetails";
import NotFound from "./pages/NotFound";

import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />

                <main className="main-content">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/become-host" element={<BecomeHost />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/properties"
                            element={<PropertiesList />}
                        />
                        <Route
                            path="/property/:id"
                            element={<PropertyDetails />}
                        />

                        {/* Protected Routes */}
                        <Route
                            path="/bookings"
                            element={
                                <ProtectedRoute>
                                    <Bookings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/wishlist"
                            element={
                                <ProtectedRoute>
                                    <Wishlist />
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 Route */}
                        <Route path="/not-found" element={<NotFound />} />
                        <Route
                            path="*"
                            element={<Navigate to="/not-found" replace />}
                        />
                    </Routes>
                </main>

                <Footer />
            </div>
        </Router>
    );
}

export default App;
