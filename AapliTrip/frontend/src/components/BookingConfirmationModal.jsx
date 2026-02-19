import { Modal, Button, Container, Row, Col, Card, Badge } from "react-bootstrap";
import { FaDownload, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaPlane, FaTrain } from "react-icons/fa";

export function BookingConfirmationModal({ show, handleClose, booking, destination }) {
  const handleDownloadVoucher = () => {
    // In real app, this would generate and download a PDF voucher
    const voucherContent = `
      WANDERWINGS TRAVEL VOUCHER
      =========================
      
      Booking ID: ${booking?.trip_id}
      Transaction ID: ${booking?.transaction_id}
      
      Destination: ${booking?.destination}
      Travel Dates: ${booking?.start_date} to ${booking?.end_date}
      Travelers: ${booking?.No_of_Person}
      Mode: ${booking?.Mode}
      
      Total Amount: ₹${booking?.Budget}
      
      Status: CONFIRMED
      
      Please carry this voucher and valid ID proof during travel.
      For support: support@wanderwings.com
    `;
    
    const blob = new Blob([voucherContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WanderWings_Voucher_${booking?.trip_id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getDaysUntilTrip = () => {
    if (!booking?.start_date) return null;
    const today = new Date();
    const tripDate = new Date(booking.start_date);
    const diffTime = tripDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilTrip = getDaysUntilTrip();

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header 
        closeButton 
        style={{ 
          background: "#0ea5e9",
          color: "white"
        }}
      >
        <Modal.Title className="fw-bold">🎉 Booking Confirmed!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="text-center mb-4">
          <div className="mb-3" style={{ fontSize: "4rem" }}>✅</div>
          <h4 className="fw-bold text-success mb-2">Your trip is confirmed!</h4>
          <p className="text-muted">Booking ID: <strong>{booking?.trip_id}</strong></p>
          {daysUntilTrip !== null && daysUntilTrip > 0 && (
            <Badge bg="info" className="px-3 py-2">
              {daysUntilTrip} days until your trip
            </Badge>
          )}
        </div>

        <Card className="mb-3 border" style={{ borderRadius: "12px", borderColor: "#e2e8f0" }}>
          <Card.Body>
            <h6 className="fw-bold mb-3" style={{ color: "#0ea5e9" }}>📋 Trip Details</h6>
            <Row>
              <Col md={6} className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaMapMarkerAlt className="me-2" style={{ color: "#0ea5e9" }} />
                  <div>
                    <small className="text-muted d-block">Destination</small>
                    <strong>{booking?.destination}</strong>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <FaMapMarkerAlt className="me-2" style={{ color: "#0ea5e9" }} />
                  <div>
                    <small className="text-muted d-block">Joining Point</small>
                    <strong>{booking?.source}</strong>
                  </div>
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <FaCalendarAlt className="me-2" style={{ color: "#0ea5e9" }} />
                  <div>
                    <small className="text-muted d-block">Travel Dates</small>
                    <strong>{booking?.start_date} to {booking?.end_date}</strong>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  {booking?.Mode === "Flight" ? (
                    <FaPlane className="me-2" style={{ color: "#0ea5e9" }} />
                  ) : (
                    <FaTrain className="me-2" style={{ color: "#0ea5e9" }} />
                  )}
                  <div>
                    <small className="text-muted d-block">Travel Mode</small>
                    <strong>{booking?.Mode}</strong>
                  </div>
                </div>
              </Col>
            </Row>
            <div className="d-flex align-items-center">
              <FaUsers className="me-2" style={{ color: "#0ea5e9" }} />
              <div>
                <small className="text-muted d-block">Travelers</small>
                <strong>{booking?.No_of_Person} {booking?.No_of_Person === 1 ? 'person' : 'persons'}</strong>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="mb-3 border" style={{ borderRadius: "12px", borderColor: "#e2e8f0" }}>
          <Card.Body>
            <h6 className="fw-bold mb-3" style={{ color: "#0ea5e9" }}>💰 Payment Information</h6>
            <div className="d-flex justify-content-between mb-2">
              <span>Total Amount Paid:</span>
              <strong className="fs-5" style={{ color: "#22c55e" }}>₹{booking?.Budget}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted small">Transaction ID:</span>
              <span className="text-muted small font-monospace">{booking?.transaction_id || "Processing..."}</span>
            </div>
            <Badge bg="success" className="mt-2">Payment Confirmed</Badge>
          </Card.Body>
        </Card>

        <Card className="mb-3 border" style={{ borderRadius: "12px", borderColor: "#e2e8f0" }}>
          <Card.Body>
            <h6 className="fw-bold mb-3" style={{ color: "#0ea5e9" }}>🎯 What Happens Next - We Handle Everything!</h6>
            <ul className="mb-0 small">
              <li>✅ <strong>Pickup Details:</strong> Our team will call you 24-48 hours before travel with exact pickup time and location</li>
              <li>✅ <strong>Complete Arrangements:</strong> Hotels, meals, local transport, guides — all pre-arranged and confirmed</li>
              <li>✅ <strong>Travel Documents:</strong> All tickets, vouchers, and itinerary sent to your email</li>
              <li>✅ <strong>Drop Service:</strong> Safe drop back to your location after trip completion</li>
              <li>✅ <strong>24/7 Support:</strong> Our support team available throughout your journey</li>
              <li>📋 <strong>What You Need:</strong> Just carry valid ID proof (Aadhar/Passport) and your travel voucher</li>
            </ul>
          </Card.Body>
        </Card>

        <Card className="border" style={{ borderRadius: "12px", borderColor: "#fef3c7", background: "#fef3c7" }}>
          <Card.Body>
            <h6 className="fw-bold mb-2" style={{ color: "#f59e0b" }}>⚠️ Cancellation Policy</h6>
            <p className="small mb-0">
              <strong>Free cancellation:</strong> Up to 48 hours before travel (100% refund)<br/>
              <strong>Partial refund:</strong> 24-48 hours before travel (50% refund)<br/>
              <strong>No refund:</strong> Less than 24 hours before travel
            </p>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} style={{ borderRadius: "8px" }}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={handleDownloadVoucher}
          style={{ borderRadius: "8px", background: "#0ea5e9", border: "none" }}
        >
          <FaDownload className="me-2" />
          Download Voucher
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

