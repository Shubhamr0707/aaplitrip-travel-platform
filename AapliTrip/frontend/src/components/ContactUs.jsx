import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { submitContact } from "../services/ContactService";

export function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        issueType: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await submitContact(formData);
            toast.success(response.data.message || "Message sent successfully! We'll get back to you within 24 hours.", {
                autoClose: 5000
            });
            
            // Reset form
            setFormData({
                name: "",
                email: "",
                issueType: "",
                message: ""
            });
        } catch (error) {
            console.error("Contact form error:", error);
            if (error.response) {
                // Server responded with error status
                toast.error(error.response.data?.message || `Error: ${error.response.status} - ${error.response.statusText}`);
            } else if (error.request) {
                // Request was made but no response received
                toast.error("Unable to connect to server. Please check if the backend is running.");
            } else {
                // Something else happened
                toast.error(error.message || "Failed to send message. Please try again later.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="border shadow-sm p-4" style={{ borderRadius: "12px", background: "white" }}>
                            <Card.Body>
                                <div className="text-center mb-4">
                                    <h4 className="fw-bold mb-2" style={{ color: "#6366f1" }}>Contact Us</h4>
                                    <p className="text-muted small">Send us a message and we'll get back to you</p>
                                </div>

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-semibold" style={{ color: "#475569" }}>Name</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your name" 
                                            required
                                            style={{ padding: "0.6rem 0.9rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-semibold" style={{ color: "#475569" }}>Email</Form.Label>
                                        <Form.Control 
                                            type="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com" 
                                            required
                                            style={{ padding: "0.6rem 0.9rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-semibold" style={{ color: "#475569" }}>Issue Type</Form.Label>
                                        <Form.Select 
                                            name="issueType"
                                            value={formData.issueType}
                                            onChange={handleChange}
                                            required
                                            style={{ padding: "0.6rem 0.9rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                                        >
                                            <option value="">Select issue...</option>
                                            <option value="booking">Booking Problem</option>
                                            <option value="payment">Payment Issue</option>
                                            <option value="cancellation">Cancellation Request</option>
                                            <option value="itinerary">Itinerary Question</option>
                                            <option value="documentation">Documentation Help</option>
                                            <option value="other">Other Issue</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="small fw-semibold" style={{ color: "#475569" }}>Message</Form.Label>
                                        <Form.Control 
                                            as="textarea" 
                                            rows={4} 
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Describe your issue..." 
                                            required
                                            style={{ padding: "0.6rem 0.9rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                                        />
                                    </Form.Group>

                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        className="w-100"
                                        disabled={isSubmitting}
                                        style={{
                                            background: isSubmitting ? "#94a3b8" : "#6366f1",
                                            border: "none",
                                            borderRadius: "6px",
                                            padding: "0.7rem",
                                            fontWeight: "500"
                                        }}
                                    >
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
