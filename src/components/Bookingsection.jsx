import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingSection.css";

const BookingSection = ({ property }) => {
    const navigate = useNavigate();
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [guestCount, setGuestCount] = useState(1);
    const [bookingError, setBookingError] = useState("");
    const [bookingSuccess, setBookingSuccess] = useState("");
    const [isBooking, setIsBooking] = useState(false);

    const BACKEND_URL =
        import.meta.env.VITE_API_URL ||
        "https://easy-travel-backend-nodejs.onrender.com/api";

    const calculateNights = () => {
        if (!checkInDate || !checkOutDate) return 0;
        const time = checkOutDate.getTime() - checkInDate.getTime();
        return Math.ceil(time / (1000 * 3600 * 24));
    };

    const calculateTotalPrice = () => {
        const nights = calculateNights();
        const cleaningFee = 50;
        const serviceFee = 25;
        const subtotal = property.price * nights;
        return {
            subtotal,
            nights,
            cleaningFee,
            serviceFee,
            total: subtotal + cleaningFee + serviceFee,
        };
    };

    const handleDateRangeChange = (dates) => {
        const [start, end] = dates;
        setCheckInDate(start);
        setCheckOutDate(end);
        setBookingError("");
    };

    const validateBooking = () => {
        setBookingError("");

        if (!checkInDate) {
            setBookingError("Please select check-in date");
            return false;
        }
        if (!checkOutDate) {
            setBookingError("Please select check-out date");
            return false;
        }
        if (checkInDate >= checkOutDate) {
            setBookingError("Check-out date must be after check-in date");
            return false;
        }
        if (guestCount < 1 || guestCount > property.maxGuests) {
            setBookingError(
                `Guests must be between 1 and ${property.maxGuests}`,
            );
            return false;
        }
        if (checkInDate < new Date()) {
            setBookingError("Check-in date cannot be in the past");
            return false;
        }

        return true;
    };

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!validateBooking()) {
            return;
        }

        setIsBooking(true);
        setBookingError("");
        setBookingSuccess("");

        try {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                setBookingError("Please log in to make a booking");
                setIsBooking(false);
                return;
            }

            const bookingData = {
                propertyId: property._id,
                userId: userId,
                checkInDate: checkInDate.toISOString(),
                checkOutDate: checkOutDate.toISOString(),
                numberOfGuests: parseInt(guestCount),
                totalPrice: calculateTotalPrice().total,
                status: "pending",
                createdAt: new Date().toISOString(),
            };

            console.log("Booking Data:", bookingData);

            const bookingResponse = await fetch(`${BACKEND_URL}/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookingData),
            });

            const responseData = await bookingResponse.json();

            if (!bookingResponse.ok) {
                throw new Error(
                    responseData.error ||
                        responseData.message ||
                        "Booking failed",
                );
            }

            setBookingSuccess(
                "Booking confirmed! Check your email for confirmation.",
            );

            // Reset form
            setCheckInDate(null);
            setCheckOutDate(null);
            setGuestCount(1);

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate("/bookings");
            }, 2000);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to create booking";
            setBookingError(errorMessage);
            console.error("Booking error:", err);
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="booking-card">
            {/* Price Info */}
            <div className="price-info">
                <span className="price">${property.price}</span>
                <span className="duration">/night</span>
            </div>

            {/* Rating */}
            <div className="rating-small">
                <span>⭐ 0 (0 reviews)</span>
            </div>

            {/* Calendar Section */}
            <div className="calendar-section">
                <p className="calendar-label">Select Check-in & Check-out</p>

                {bookingError && (
                    <div className="booking-error">{bookingError}</div>
                )}

                {bookingSuccess && (
                    <div className="booking-success">{bookingSuccess}</div>
                )}

                <form onSubmit={handleBooking} className="booking-form">
                    <div className="datepicker-wrapper">
                        <DatePicker
                            selectsRange={true}
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            onChange={handleDateRangeChange}
                            minDate={new Date()}
                            isClearable={true}
                            placeholderText="Check-in & Check-out"
                            className="booking-datepicker"
                            monthsShown={2}
                            inline={true}
                        />
                    </div>

                    <div className="guests-input-wrapper">
                        <label htmlFor="guests" className="guests-label">
                            Guests
                        </label>
                        <select
                            id="guests"
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            className="guests-select"
                            disabled={isBooking}
                        >
                            {Array.from(
                                { length: property.maxGuests },
                                (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}{" "}
                                        {i + 1 === 1 ? "Guest" : "Guests"}
                                    </option>
                                ),
                            )}
                        </select>
                    </div>

                    {checkInDate && checkOutDate && (
                        <>
                            {/* Price Breakdown */}
                            <div className="price-breakdown">
                                <div className="price-row">
                                    <span>
                                        ${property.price} x {calculateNights()}{" "}
                                        nights
                                    </span>
                                    <span>
                                        $
                                        {calculateTotalPrice().subtotal.toFixed(
                                            2,
                                        )}
                                    </span>
                                </div>
                                <div className="price-row">
                                    <span>Cleaning fee</span>
                                    <span>
                                        ${calculateTotalPrice().cleaningFee}
                                    </span>
                                </div>
                                <div className="price-row">
                                    <span>Service fee</span>
                                    <span>
                                        ${calculateTotalPrice().serviceFee}
                                    </span>
                                </div>
                                <div className="price-row total">
                                    <span>Total</span>
                                    <span>
                                        $
                                        {calculateTotalPrice().total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-reserve"
                                disabled={isBooking}
                            >
                                {isBooking ? "Processing..." : "Reserve Now"}
                            </button>
                        </>
                    )}

                    {!checkInDate || !checkOutDate ? (
                        <button
                            type="button"
                            className="btn btn-primary btn-reserve btn-disabled"
                            disabled={true}
                        >
                            Select dates to continue
                        </button>
                    ) : null}
                </form>

                <p className="reserve-note">You won't be charged yet</p>
            </div>
        </div>
    );
};

export default BookingSection;
