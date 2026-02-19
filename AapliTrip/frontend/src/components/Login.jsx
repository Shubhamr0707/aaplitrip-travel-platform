import { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Bounce, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/Login.css";
import { UserLogin } from "../services/LoginService.js";
import { getToken, storeToken } from "../services/TokenService.js";
import { storeRole } from "../services/RoleService.js";

export function Login() {
  const [formData, setformdata] = useState({ email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setformdata({ ...formData, [event.target.name]: event.target.value });
  }

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Backend only needs email and password, not role
      const loginData = {
        email: formData.email,
        password: formData.password
      };

      const response = await UserLogin(loginData);

      if (response.status === 200 && response.data) {
        // Store token and role from response
        if (response.data.token) {
          storeToken(response.data.token);
        }
        if (response.data.role) {
          storeRole(response.data.role);
        }
        
        // Verify role matches selected role (if user selected admin but got user role, show error)
        if (selectedRole === 'admin' && response.data.role !== 'admin') {
          toast.error("You don't have admin access. Please login as user.", {
            position: "top-right",
            autoClose: 4000,
            theme: "colored",
            transition: Bounce,
          });
          setIsSubmitting(false);
          return;
        }

        toast.success("Login successful! Redirecting...", {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
          transition: Bounce,
        });

        // Navigate based on role
        setTimeout(() => {
          if (response.data.role === 'admin') {
            navigate("/admin-dashboard");
          } else {
            navigate("/");
          }
        }, 1000);
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response) {
        // Handle different error statuses
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || "Invalid request. Please check your input.";
        } else if (error.response.status === 500) {
          errorMessage = error.response.data?.message || "Server error. Please try again later.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <Container className="p-0" style={{ position: "relative", zIndex: 10 }}>
        <Row className="g-0 justify-content-center align-items-center">
          <Col md={6} className="form-section d-flex align-items-center justify-content-center p-4 mx-auto" style={{ position: "relative", zIndex: 10 }}>
            <div className="form-box p-5 w-100" style={{ maxWidth: "500px", position: "relative", zIndex: 10 }}>
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center mb-3 login-icon">
                  ✈️
                </div>
                <h2 className="mb-2 fw-bold login-link">Welcome Back!</h2>
                <p className="text-muted mb-4">Access all your bookings, compare prices, and manage trips in one place</p>
              </div>

              <Form onSubmit={handleLogin} style={{ position: "relative", zIndex: 20 }}>
                <Form.Group className="mb-4" style={{ position: "relative", zIndex: 20 }}>
                  <Form.Label className="fw-semibold mb-2" style={{ color: "#6366f1" }}>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="login-form-control"
                    style={{ position: "relative", zIndex: 20 }}
                  />
                </Form.Group>

                <Form.Group className="mb-4" style={{ position: "relative", zIndex: 20 }}>
                  <Form.Label className="fw-semibold mb-2" style={{ color: "#6366f1" }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="login-form-control"
                    style={{ position: "relative", zIndex: 20 }}
                  />
                </Form.Group>

                <Form.Group className="mb-4" style={{ position: "relative", zIndex: 20 }}>
                  <Form.Label className="fw-semibold mb-3 d-block" style={{ color: "#6366f1" }}>Login As</Form.Label>
                  <div className="d-flex gap-4 justify-content-center">
                    <Form.Check
                      inline
                      type="radio"
                      id="radio-user"
                      label={<span className="fw-medium" style={{ color: "#1e293b" }}>User</span>}
                      name="role"
                      value="user"
                      checked={selectedRole === 'user'}
                      onChange={handleRoleChange}
                      style={{ cursor: "pointer", position: "relative", zIndex: 20 }}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      id="radio-admin"
                      label={<span className="fw-medium" style={{ color: "#1e293b" }}>Admin</span>}
                      name="role"
                      value="admin"
                      checked={selectedRole === 'admin'}
                      onChange={handleRoleChange}
                      style={{ cursor: "pointer", position: "relative", zIndex: 20 }}
                    />
                  </div>
                  <Form.Text className="small d-block text-center mt-2 text-muted">
                    Select your account type. The system will verify your access.
                  </Form.Text>
                </Form.Group>

                <Button 
                  type="submit" 
                  className="w-100 py-3 fw-bold login-button"
                  disabled={isSubmitting}
                  style={{
                    fontSize: "1.1rem",
                    position: "relative",
                    zIndex: 20,
                    background: isSubmitting ? "#94a3b8" : undefined,
                    cursor: isSubmitting ? "not-allowed" : "pointer"
                  }}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Form>

              <p className="mt-4 text-center text-muted" style={{ position: "relative", zIndex: 20 }}>
                Don't have an account?{" "}
                <Link 
                  to="/Signup" 
                  className="fw-bold login-link"
                  style={{ 
                    textDecoration: "none",
                    position: "relative",
                    zIndex: 20
                  }}
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}