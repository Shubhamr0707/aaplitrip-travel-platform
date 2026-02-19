import { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { createOrder } from "../services/MyTripService";

export function PaymentModal({ show, handleClose, booking, onPaymentComplete }) {
    const [loading, setLoading] = useState(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);
        const res = await loadRazorpayScript();

        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order
            const result = await createOrder(booking.Budget);

            let order;
            // Handle both string (JSON) and object (already parsed) responses
            if (typeof result.data === 'string') {
                order = JSON.parse(result.data);
            } else {
                order = result.data;
            }

            const options = {
                key: "rzp_test_RlGN7viElSYiad", // Using the key user provided in chat history
                amount: order.amount,
                currency: order.currency,
                name: "WanderWings",
                description: "Payment for " + booking.destination,
                image: "https://example.com/your_logo",
                order_id: order.id,
                handler: async function (response) {
                    // 2. Verify Payment (In a real app, verify signature on backend)
                    // For now, we assume success if handler is called
                    toast.success("Payment Successful!");
                    // Pass the payment ID to the callback
                    await onPaymentComplete(booking.trip_id, response.razorpay_payment_id);
                    handleClose();
                },
                prefill: {
                    name: "User Name", // You can pass user details here
                    email: "user@example.com",
                    contact: "9999999999",
                },
                notes: {
                    address: "WanderWings Corporate Office",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            setLoading(false);

        } catch (error) {
            toast.error("Failed to create order. Check console for details.");
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
            <Modal.Header 
                closeButton
                style={{ 
                    background: "#0ea5e9",
                    color: "white"
                }}
            >
                <Modal.Title className="fw-bold">Secure Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <div className="text-center mb-4">
                    <div className="mb-3" style={{ fontSize: "3rem" }}>💳</div>
                    <h4 className="fw-bold" style={{ color: "#0ea5e9" }}>₹{booking?.Budget}</h4>
                    <p className="text-muted">Payment for <strong>{booking?.destination}</strong></p>
                    <p className="small text-muted">Booking ID: {booking?.trip_id}</p>
                </div>

                <div className="alert alert-info mb-4">
                    <strong>Payment Information:</strong>
                    <ul className="mb-0 mt-2 small">
                        <li>Secure payment gateway powered by Razorpay</li>
                        <li>Your payment is encrypted and secure</li>
                        <li>You'll receive a confirmation email after successful payment</li>
                        <li>Booking will be confirmed immediately upon payment</li>
                    </ul>
                </div>

                <div className="alert alert-warning mb-4 small">
                    <strong>⚠️ Important:</strong> Please complete the payment within 24 hours to confirm your booking. 
                    Your booking may be cancelled if payment is not received.
                </div>

                <Button 
                    variant="primary" 
                    onClick={handlePayment} 
                    disabled={loading} 
                    className="w-100 py-3 fw-bold"
                    style={{ 
                        borderRadius: "8px",
                        background: "#0ea5e9",
                        border: "none"
                    }}
                >
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                            Processing Payment...
                        </>
                    ) : (
                        "💳 Pay with Razorpay"
                    )}
                </Button>
                
                <p className="text-center text-muted small mt-3 mb-0">
                    By proceeding, you agree to our Terms & Conditions
                </p>
            </Modal.Body>
        </Modal>
    );
}
