import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { bookMyTrip, getUserId } from "../services/MyTripService";
import { validateBookingDates, calculateTotalPrice, formatPrice, isDomesticDestination, reconstructTripDetails } from "../utils/destinationUtils";
import "../assets/css/BookTripForm.css";

export function BookTripForm() {
  const { state } = useLocation();
  const destination = state?.destination;
  const joiningPoint = state?.joiningPoint;
  const travelMode = state?.travelMode;

  // Redirect if no destination data
  if (!destination) {
    window.location.href = "/destinations";
    return null;
  }

  // Reconstruct trip details with variant information - memoized to prevent unnecessary recalculations
  // Always use Flight mode
  const defaultTravelMode = "Flight";
  const tripDetails = useMemo(() => {
    return reconstructTripDetails(destination, joiningPoint, defaultTravelMode) || destination;
  }, [destination, joiningPoint]);

  const [formData, setFormData] = useState({
    source: joiningPoint || "",
    start_date: tripDetails.start_date || "",
    end_date: tripDetails.end_date || "",
    No_of_Person: 1,
    Price: tripDetails.Price || "",
    Budget: tripDetails.Price || "",
    Mode: defaultTravelMode,
  });

  const [file, setFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Validate dates on mount and when dates change
    if (formData.start_date && formData.end_date) {
      const errors = validateBookingDates(formData.start_date, formData.end_date, tripDetails);
      setValidationErrors(errors);
    } else {
      setValidationErrors([]);
    }

    // Recalculate budget when persons change
    if (formData.No_of_Person && formData.source) {
      const variant = tripDetails.variants?.find(
        v => v.source_city === formData.source && v.travel_mode === defaultTravelMode
      );
      if (variant) {
        const totalPrice = calculateTotalPrice(tripDetails, variant, parseInt(formData.No_of_Person));
        setFormData(prev => ({ ...prev, Budget: totalPrice.toString(), Price: variant.price }));
      } else {
        const basePrice = parseFloat(tripDetails.Price) || 0;
        setFormData(prev => ({ ...prev, Budget: (basePrice * parseInt(formData.No_of_Person)).toString() }));
      }
    }
  }, [formData.start_date, formData.end_date, formData.No_of_Person, formData.source, tripDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Recalculate budget when number of persons changes
      if (name === "No_of_Person") {
        const variant = tripDetails.variants?.find(
          v => v.source_city === updated.source && v.travel_mode === defaultTravelMode
        );
        if (variant) {
          updated.Budget = calculateTotalPrice(tripDetails, variant, parseInt(value)).toString();
        } else {
          updated.Budget = (parseFloat(tripDetails.Price || 0) * parseInt(value)).toString();
        }
      }
      
      return updated;
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation checks
    if (!file) {
      toast.error("Please upload Identity Proof");
      return;
    }

    if (validationErrors.length > 0) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (parseInt(formData.No_of_Person) < 1) {
      toast.error("Number of persons must be at least 1");
      return;
    }

    setIsSubmitting(true);

    try {
      const userResponse = await getUserId();
      const userId = userResponse.data.id;

      const data = new FormData();
      data.append("source", formData.source);
      data.append("startDate", formData.start_date);
      data.append("endDate", formData.end_date);
      data.append("noOfPersons", formData.No_of_Person);
      data.append("mode", formData.Mode);
      data.append("budget", formData.Budget);
      data.append("destId", tripDetails.dest_id);
      data.append("file", file);

      const response = await bookMyTrip(userId, data);
      toast.success(response.data.message || "Enquiry submitted successfully!");
      
      // Show realistic booking flow message
      toast.info("✅ Great! We'll review your enquiry and approve within 24 hours. After approval and payment, we'll handle everything — pickup, arrangements, and drop. You just travel!", {
        autoClose: 6000
      });
      
      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = "/Mybookings";
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send booking request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="book-trip-page">
      <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
              <Card className="shadow-sm border mb-4 destination-card">
            <Card.Img
              variant="top"
              src={tripDetails.Imgpath}
              alt={tripDetails.destination_name}
              className="destination-image"
            />
            <Card.Body>
              <Card.Title className="fw-bold text-primary text-center">
                {tripDetails.destination_name}
              </Card.Title>
              <Card.Text className="text-muted text-center">
                {tripDetails.description}
              </Card.Text>
              <div className="text-center mb-0" style={{ color: "#1e293b" }}>
                <p><strong>Country:</strong> {tripDetails.Country}</p>
                <p><strong>Route:</strong> {tripDetails.route || 'Route details will be provided'}</p>
                <p><strong>Duration:</strong> {tripDetails.exposure || 'Duration details will be provided'}</p>
                <p><strong>Dates:</strong> {tripDetails.start_date || 'TBA'} to {tripDetails.end_date || 'TBA'}</p>
                {joiningPoint && (
                  <p><strong>Joining Point:</strong> {joiningPoint}</p>
                )}
                <p className="mt-3"><strong>Base Price per Person:</strong> {formatPrice(destination.Price)}</p>
              </div>
            </Card.Body>
          </Card>

          <Card className="p-4 shadow-sm border form-card">
            <div className="text-center mb-4">
              <h4 className="mb-2 fw-bold" style={{ color: "#22c55e" }}>Make Your Enquiry</h4>
              <p className="text-muted small mb-0">
                Fill in your details below. After we approve and you pay, you'll receive complete trip details including pickup time, accommodation, and itinerary within 24 hours.
              </p>
            </div>
            
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert variant="danger" className="mb-4">
                <Alert.Heading>Please fix the following errors:</Alert.Heading>
                <ul className="mb-0">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>

              <Form.Group className="mb-3">
                <Form.Label>Source (Joining Point)</Form.Label>
                <Form.Control
                  type="text"
                  name="source"
                  value={formData.source}
                  readOnly
                  className="bg-light form-control-custom"
                />
                <Form.Text className="text-muted">
                  <strong>Don't worry about reaching here!</strong> We provide pickup service from your location. 
                  Our team will contact you with exact pickup time and location after booking approval.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Travel Dates</Form.Label>
                <Row>
                  <Col md={6}>
                    <Form.Control
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      readOnly
                      className="bg-light"
                      style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1.5px solid #e2e8f0" }}
                    />
                    <Form.Text className="text-muted small">Start Date</Form.Text>
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      readOnly
                      className="bg-light"
                      style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1.5px solid #e2e8f0" }}
                    />
                    <Form.Text className="text-muted small">End Date</Form.Text>
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>No. of Persons</Form.Label>
                <Form.Control
                  type="number"
                  name="No_of_Person"
                  value={formData.No_of_Person}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  required
                  className="form-control-custom"
                />
                <Form.Text className="text-muted">Maximum 20 persons per booking</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Identity Proof (Aadhar/Passport) <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf"
                  required
                  className="form-control-custom"
                />
                <Form.Text className="text-muted">
                  Upload a clear copy of your Aadhar Card or Passport (JPG, PNG, or PDF format). 
                  This is required for booking verification and travel documentation.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Total Budget</Form.Label>
                <Form.Control
                  type="text"
                  name="Budget"
                  value={formatPrice(formData.Budget)}
                  readOnly
                  className="bg-light fw-bold fs-5 text-center budget-input"
                />
                <Form.Text className="text-muted">
                  Calculated: {formData.No_of_Person} person(s) × ₹{formatPrice(formData.Price)} = ₹{formatPrice(formData.Budget)}
                </Form.Text>
                <div className="alert alert-success mt-2 mb-0 small" style={{ background: "#dcfce7", borderColor: "#bbf7d0" }}>
                  <strong>✅ All-Inclusive Price:</strong> This amount covers transportation, accommodation, meals, 
                  local transfers, pickup & drop service, and all arrangements. No hidden charges. 
                  Payment required after booking approval.
                </div>
              </Form.Group>

              <div className="text-center">
                <Button 
                  variant="success" 
                  type="submit" 
                  className="px-5 py-2 fw-bold submit-button"
                  disabled={isSubmitting || validationErrors.length > 0}
                >
                  {isSubmitting ? "Submitting Enquiry..." : "Submit Enquiry - We'll Handle Everything! ✈️"}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
      </Container>
    </div>
  );
}
