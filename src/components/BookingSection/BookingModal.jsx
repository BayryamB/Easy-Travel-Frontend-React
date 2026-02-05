import { useState } from "react";
import BookingSection from "./Bookingsection";
import "./BookingModal.css";

const BookingModal = ({ property }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            {/* Trigger Button */}
            <button className="btn-select-dates" onClick={openModal}>
                📅 Select Dates
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="booking-modal-overlay" onClick={closeModal}>
                    {/* Modal Container */}
                    <div
                        className="booking-modal-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="booking-modal-header">
                            <h2>Reserve {property.title}</h2>
                            <button
                                className="btn-close-modal"
                                onClick={closeModal}
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="booking-modal-body">
                            <BookingSection
                                property={property}
                                onBookingSuccess={closeModal}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookingModal;
