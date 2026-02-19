import { Modal, Button, Container, Row, Col, Card, Badge } from "react-bootstrap";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaPlane, FaTrain, FaFileDownload } from "react-icons/fa";

export function ReceiptModal({ show, handleClose, booking }) {
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadReceipt = () => {
        const receiptContent = `
WANDERWINGS - PAYMENT RECEIPT
=============================

Receipt Date: ${new Date().toLocaleDateString()}
Booking ID: ${booking?.trip_id}
Transaction ID: ${booking?.transaction_id || "N/A"}

CUSTOMER INFORMATION
--------------------
Name: ${booking?.user_name}
Status: CONFIRMED & PAID

TRIP DETAILS
-------------
Destination: ${booking?.destination}
Joining Point: ${booking?.source}
Travel Mode: ${booking?.Mode}
Travel Dates: ${booking?.start_date} to ${booking?.end_date}
Number of Travelers: ${booking?.No_of_Person}

PAYMENT DETAILS
---------------
Total Amount Paid: ₹${booking?.Budget}
Payment Status: CONFIRMED
Payment Date: ${new Date().toLocaleDateString()}

IMPORTANT NOTES
---------------
- Please carry this receipt and valid ID proof during travel
- Arrive at joining point 30 minutes before departure
- For support: support@wanderwings.com or +91 1800-123-4567

Thank you for choosing WanderWings!
Have a safe and memorable journey!

This is a computer-generated receipt.
        `;
        
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `WanderWings_Receipt_${booking?.trip_id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header 
                closeButton 
                className="d-print-none"
                style={{ 
                    background: "#0ea5e9",
                    color: "white"
                }}
            >
                <Modal.Title className="fw-bold">Payment Receipt</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <div id="receipt-content">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold" style={{ color: "#0ea5e9" }}>WanderWings</h2>
                        <p className="text-muted">Your Trusted Travel Partner</p>
                        <Badge bg="success" className="px-3 py-2">PAYMENT CONFIRMED</Badge>
                        <hr className="my-3" />
                    </div>

                    <Container>
                        <Row className="mb-4">
                            <Col md={6}>
                                <h6 className="fw-bold mb-3" style={{ color: "#0ea5e9" }}>Receipt Details</h6>
                                <p className="mb-2"><strong>Date:</strong> {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p className="mb-2"><strong>Transaction ID:</strong> <span className="font-monospace small">{booking?.transaction_id || "Processing..."}</span></p>
                                <p className="mb-0"><strong>Booking ID:</strong> <span className="fw-bold">{booking?.trip_id}</span></p>
                            </Col>
                            <Col md={6}>
                                <h6 className="fw-bold mb-3" style={{ color: "#0ea5e9" }}>Customer Details</h6>
                                <p className="mb-2"><strong>Name:</strong> {booking?.user_name}</p>
                                <p className="mb-0"><strong>Status:</strong> <Badge bg="success">CONFIRMED</Badge></p>
                            </Col>
                        </Row>

                        <Card className="mb-4 border" style={{ borderRadius: "12px", borderColor: "#e2e8f0" }}>
                            <Card.Body>
                                <h6 className="fw-bold mb-3" style={{ color: "#0ea5e9" }}>Trip Information</h6>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <div className="d-flex align-items-start mb-2">
                                            <FaMapMarkerAlt className="me-2 mt-1" style={{ color: "#0ea5e9" }} />
                                            <div>
                                                <small className="text-muted d-block">Destination</small>
                                                <strong>{booking?.destination}</strong>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-start mb-2">
                                            <FaMapMarkerAlt className="me-2 mt-1" style={{ color: "#0ea5e9" }} />
                                            <div>
                                                <small className="text-muted d-block">Joining Point</small>
                                                <strong>{booking?.source}</strong>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-start">
                                            {booking?.Mode === "Flight" ? (
                                                <FaPlane className="me-2 mt-1" style={{ color: "#0ea5e9" }} />
                                            ) : (
                                                <FaTrain className="me-2 mt-1" style={{ color: "#0ea5e9" }} />
                                            )}
                                            <div>
                                                <small className="text-muted d-block">Travel Mode</small>
                                                <strong>{booking?.Mode}</strong>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <div className="d-flex align-items-start mb-2">
                                            <FaCalendarAlt className="me-2 mt-1" style={{ color: "#0ea5e9" }} />
                                            <div>
                                                <small className="text-muted d-block">Travel Dates</small>
                                                <strong>{booking?.start_date} to {booking?.end_date}</strong>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-start">
                                            <FaUsers className="me-2 mt-1" style={{ color: "#0ea5e9" }} />
                                            <div>
                                                <small className="text-muted d-block">Travelers</small>
                                                <strong>{booking?.No_of_Person} {booking?.No_of_Person === 1 ? 'person' : 'persons'}</strong>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="mb-4 border" style={{ borderRadius: "12px", borderColor: "#dcfce7", background: "#dcfce7" }}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <small className="text-muted d-block">Total Amount Paid</small>
                                        <h4 className="fw-bold mb-0" style={{ color: "#22c55e" }}>₹{booking?.Budget}</h4>
                                    </div>
                                    <Badge bg="success" className="px-3 py-2">PAID</Badge>
                                </div>
                            </Card.Body>
                        </Card>

                        <div className="alert alert-info mb-4">
                            <strong>📋 Important:</strong>
                            <ul className="mb-0 mt-2 small">
                                <li>Please carry this receipt and valid ID proof during travel</li>
                                <li>Arrive at the joining point 30 minutes before departure</li>
                                <li>Your travel voucher has been sent to your registered email</li>
                            </ul>
                        </div>

                        <div className="text-center text-muted small">
                            <p className="mb-1">Thank you for choosing WanderWings!</p>
                            <p className="mb-0">For support: support@wanderwings.com | +91 1800-123-4567</p>
                        </div>
                    </Container>
                </div>
            </Modal.Body>
            <Modal.Footer className="d-print-none">
                <Button variant="secondary" onClick={handleClose} style={{ borderRadius: "8px" }}>
                    Close
                </Button>
                <Button 
                    variant="outline-primary" 
                    onClick={handleDownloadReceipt}
                    style={{ borderRadius: "8px" }}
                >
                    <FaFileDownload className="me-2" />
                    Download
                </Button>
                <Button variant="primary" onClick={handlePrint} style={{ borderRadius: "8px", background: "#0ea5e9", border: "none" }}>
                    Print Receipt
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
