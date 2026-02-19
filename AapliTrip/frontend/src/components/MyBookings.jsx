import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Badge, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { getMyTrips, getUserId, confirmPayment } from "../services/MyTripService";
import { PaymentModal } from "./PaymentModal";
import { ReceiptModal } from "./ReceiptModal";
import { BookingConfirmationModal } from "./BookingConfirmationModal";
import { TravelChecklist } from "./TravelChecklist";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaPlane, FaTrain, FaFileDownload, FaTimesCircle, FaCheckSquare } from "react-icons/fa";
import "../assets/css/MyBookings.css";

export function MyBookings() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchMyTrips();
  }, []);

  const fetchMyTrips = async () => {
    try {
      const userResponse = await getUserId();
      const userId = userResponse.data.id;
      const response = await getMyTrips(userId);
      setTrips(response.data);
    } catch (error) {
      toast.error("Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  const viewReceipt = (booking) => {
    setSelectedBooking(booking);
    setShowReceiptModal(true);
  };

  const handlePaymentComplete = async (bookingId, transactionId) => {
    try {
      const response = await confirmPayment(bookingId, transactionId);
      toast.success(response.data.message);
      fetchMyTrips(); // Refresh to show confirmed status
      // Show confirmation modal after payment
      const updatedBooking = trips.find(t => t.trip_id === bookingId);
      if (updatedBooking) {
        setSelectedBooking({ ...updatedBooking, transaction_id: transactionId, status: "CONFIRMED" });
        setShowConfirmationModal(true);
      }
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    // In real app, this would call an API to cancel the booking
    toast.info("Cancellation request submitted. Our team will process it within 24 hours.");
    setShowCancelModal(false);
    // In real app: await cancelBooking(selectedBooking.trip_id);
  };

  const getDaysUntilTrip = (startDate) => {
    if (!startDate) return null;
    const today = new Date();
    const tripDate = new Date(startDate);
    const diffTime = tripDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const canCancel = (booking) => {
    if (booking.status !== "CONFIRMED" && booking.status !== "APPROVED") return false;
    const daysUntil = getDaysUntilTrip(booking.start_date);
    return daysUntil !== null && daysUntil > 1; // Can cancel if more than 1 day before
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your trips...</p>
      </Container>
    );
  }

  return (
    <div className="my-bookings-page">
      <Container className="py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold mb-3 text-primary" style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)" }}>
          ✈️ My Booked Trips
        </h2>
        <p className="text-muted fs-5">
          <strong>Your Worry-Free Trips:</strong> Track all your enquiries and bookings here. Once approved and paid, 
          <strong> we handle everything</strong> — pickup, accommodation, meals, transport, guides, and drop. 
          Just check your booking status and be ready when we call for pickup! 🎉
        </p>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4" style={{ fontSize: "4rem" }}>✈️</div>
          <h4 className="fw-bold text-muted mb-3">No trips booked yet</h4>
          <p className="text-muted">
            Start exploring amazing destinations and book your first trip with WanderWings!
          </p>
        </div>
      ) : (
        <Row className="g-4">
          {trips.map((trip) => (
            <Col key={trip.trip_id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm border booking-card">
                <Card.Img
                  variant="top"
                  src={trip.Imgpath}
                  alt={trip.destination}
                  className="booking-image"
                />
                <Card.Body>
                  <Card.Title className="fw-bold text-center text-success">
                    {trip.destination}
                  </Card.Title>

                  <div className="mt-3">
                    <div className="mb-2">
                      <small className="text-muted d-block">Joining Point</small>
                      <strong>{trip.source}</strong>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">Travel Dates</small>
                      <strong>{trip.start_date} → {trip.end_date}</strong>
                      {getDaysUntilTrip(trip.start_date) !== null && getDaysUntilTrip(trip.start_date) > 0 && (
                        <Badge bg="info" className="ms-2">
                          {getDaysUntilTrip(trip.start_date)} days left
                        </Badge>
                      )}
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">Travelers</small>
                      <strong>{trip.No_of_Person} {trip.No_of_Person === 1 ? 'person' : 'persons'}</strong>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">Travel Mode</small>
                      <strong>{trip.Mode === "Flight" ? "✈️ Flight" : "🚂 Train"}</strong>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">Total Amount</small>
                      <strong className="fs-5 text-success">₹{trip.Budget}</strong>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted d-block">Status</small>
                      <Badge
                        bg={
                          trip.status === "APPROVED" || trip.status === "CONFIRMED"
                            ? "success"
                            : trip.status === "REJECTED" || trip.status === "CANCELLED"
                              ? "danger"
                              : "warning"
                        }
                        className="status-badge"
                      >
                        {trip.status}
                      </Badge>
                    </div>

                    <div className="d-grid gap-2">
                      {trip.status === "APPROVED" && (
                        <Button variant="primary" onClick={() => initiatePayment(trip)} className="rounded">
                          💳 Pay Now
                        </Button>
                      )}

                      {trip.status === "CONFIRMED" && (
                        <>
                          <Button variant="outline-primary" onClick={() => viewReceipt(trip)} className="rounded">
                            <FaFileDownload className="me-2" />
                            View Receipt
                          </Button>
                          <Button 
                            variant="outline-success" 
                            onClick={() => {
                              setSelectedBooking(trip);
                              setShowChecklist(true);
                            }}
                            className="rounded"
                          >
                            <FaCheckSquare className="me-2" />
                            Travel Checklist
                          </Button>
                          {canCancel(trip) && (
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleCancelBooking(trip)}
                              className="rounded"
                            >
                              <FaTimesCircle className="me-2" />
                              Cancel Booking
                            </Button>
                          )}
                        </>
                      )}

                      {trip.status === "PENDING" && (
                        <div className="alert alert-info mb-0 small">
                          ⏳ Your booking is under review. We'll notify you once approved.
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {selectedBooking && (
        <>
          <PaymentModal
            show={showPaymentModal}
            handleClose={() => setShowPaymentModal(false)}
            booking={selectedBooking}
            onPaymentComplete={handlePaymentComplete}
          />
          <ReceiptModal
            show={showReceiptModal}
            handleClose={() => setShowReceiptModal(false)}
            booking={selectedBooking}
          />
          <BookingConfirmationModal
            show={showConfirmationModal}
            handleClose={() => setShowConfirmationModal(false)}
            booking={selectedBooking}
          />
          <TravelChecklist
            show={showChecklist}
            handleClose={() => setShowChecklist(false)}
            booking={selectedBooking}
          />
          <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Cancel Booking</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure you want to cancel your booking for <strong>{selectedBooking?.destination}</strong>?</p>
              <div className="alert alert-warning">
                <strong>Cancellation Policy:</strong>
                <ul className="mb-0 mt-2 small">
                  <li>More than 48 hours before travel: 100% refund</li>
                  <li>24-48 hours before travel: 50% refund</li>
                  <li>Less than 24 hours: No refund</li>
                </ul>
              </div>
              {selectedBooking?.start_date && (
                <p className="small text-muted">
                  Your trip is in {getDaysUntilTrip(selectedBooking.start_date)} days.
                </p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowCancelModal(false)} className="rounded">
                Keep Booking
              </Button>
              <Button variant="danger" onClick={confirmCancellation} className="rounded">
                Confirm Cancellation
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
      </Container>
    </div>
  );
}
