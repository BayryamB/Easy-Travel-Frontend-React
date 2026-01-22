import { useState, useEffect } from "react";
import { bookingService } from "../services/bookingService";
import { authService } from "../services/authService";
import "./Bookings.css";

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const userId = authService.getUserId();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const data = await bookingService.getGuestBookings(userId);
                setBookings(data);
            } catch (err) {
                setError("Failed to load bookings");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchBookings();
        }
    }, [userId]);

    return (
        <div className="bookings-container">
            <div className="container">
                <h1>My Bookings</h1>

                {loading && (
                    <div className="loading-state">
                        <p>Loading your bookings...</p>
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}

                {!loading && bookings.length === 0 && (
                    <div className="empty-state">
                        <p>You haven't made any bookings yet</p>
                    </div>
                )}

                {!loading && bookings.length > 0 && (
                    <div className="bookings-list">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="booking-card">
                                <div className="booking-header">
                                    <h3>Booking #{booking._id?.slice(-6)}</h3>
                                    <span
                                        className={`status ${booking.status}`}
                                    >
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="booking-details">
                                    <p>
                                        <strong>Check-in:</strong>{" "}
                                        {new Date(
                                            booking.checkInDate,
                                        ).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>Check-out:</strong>{" "}
                                        {new Date(
                                            booking.checkOutDate,
                                        ).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>Guests:</strong>{" "}
                                        {booking.numberOfGuests}
                                    </p>
                                </div>
                                <div className="booking-price">
                                    <strong>Total:</strong> $
                                    {booking.pricing?.total || booking.total}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
