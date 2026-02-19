import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../assets/css/Signup.css";
import { SignUpService } from "../services/SignUpService";

export function Signup() {
  const [formData, setformdata] = useState({name:'',email:'',phone:'',password:'',address:''});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const ConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  }

  const handleChange = (event) => {
    setformdata({ ...formData, [event.target.name]: event.target.value});
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await SignUpService(formData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Account created successfully! Please login.");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data?.message || "Signup failed. Please try again.");
        toast.error(error.response.data?.message || "Signup failed");
      } else {
        setError("Network error. Please try again.");
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <Container className="p-0">
        <Row className="g-0 justify-content-center align-items-center">
          <Col md={6} className="form-section d-flex align-items-center justify-content-center p-4 mx-auto">
            <div className="form-box p-5 w-100" style={{ maxWidth: "500px" }}>
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center mb-3 signup-icon">
                  🚀
                </div>
                <h2 className="mb-2 fw-bold signup-link">Solve Your Travel Problems</h2>
                <p className="text-muted mb-4">Join thousands of travelers who simplified their trip planning with WanderWings</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSignup}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold mb-2" style={{ color: "#6366f1" }}>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    name="name"
                    onChange={handleChange}
                    required
                    className="signup-form-control"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold mb-2" style={{ color: "#6366f1" }}>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    onChange={handleChange}
                    required
                    className="signup-form-control"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold mb-2" style={{ color: "#6366f1" }}>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your phone number"
                    name="phone"
                    onChange={handleChange}
                    required
                    className="signup-form-control"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold mb-2" style={{ color: "#6366f1" }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password (min 6 characters)"
                    name="password"
                    onChange={handleChange}
                    required
                    className="signup-form-control"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold mb-2" style={{ color: "#6366f1" }}>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Re-enter your password"
                    name="ConfirmPassword"
                    onChange={ConfirmPasswordChange}
                    required
                    className="signup-form-control"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold mb-2" style={{ color: "#6366f1" }}>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your address"
                    name="address"
                    onChange={handleChange}
                    required
                    className="signup-form-control"
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  className="w-100 py-3 fw-bold signup-button"
                  disabled={isSubmitting}
                  style={{
                    fontSize: "1.1rem",
                    background: isSubmitting ? "#94a3b8" : undefined
                  }}
                >
                  {isSubmitting ? "Creating Account..." : "Sign Up"}
                </Button>
              </Form>

              <p className="mt-4 text-center text-muted">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="fw-bold signup-link"
                  style={{ textDecoration: "none" }}
                >
                  Log In
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}