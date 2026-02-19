import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { getToken, removeToken } from "../services/TokenService";
import { getRole, removeRole } from "../services/RoleService";
import "../assets/css/Navbar.css";
import { getUserId } from "../services/MyTripService";

export function Navigationbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");

  const checkAuthStatus = () => {
    const token = getToken();
    const role = getRole();
    setIsLoggedIn(!!token);
    setUserRole(role);

    if (token) {
      fetchUsername();
    } else {
      setUserName("");
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  const fetchUsername = async () => {
    try {
      const res = await getUserId();
      setUserName(res.data.name);
    } catch (err) {
      // Error handled silently
    }
  };

  const handleLoginClick = () => navigate("/login");

  const handleLogout = () => {
    removeToken();
    removeRole();
    setUserName("");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/login");
  };

  return (
    <Navbar expand="lg" bg="white" variant="light" className="border-bottom sticky-top shadow-sm" style={{ zIndex: 1000, borderColor: "#e2e8f0", background: "white" }}>
      <Container>
        <Navbar.Brand
          className="fw-bold fs-3 d-flex align-items-center"
          style={{ 
            letterSpacing: "0.5px", 
            cursor: "pointer",
            color: "#6366f1",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
          onClick={() => navigate("/")}
        >
          <span style={{ fontSize: "1.8rem", marginRight: "8px" }}>✈️</span>
          <span>WanderWings</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link 
              onClick={() => navigate("/")} 
              className="mx-3 fw-medium nav-hover"
              style={{ color: "#475569", fontSize: "0.95rem" }}
            >
              Home
            </Nav.Link>

            <Nav.Link 
              onClick={() => navigate("/destinations")} 
              className="mx-3 fw-medium nav-hover"
              style={{ color: "#475569", fontSize: "0.95rem" }}
            >
              Destinations
            </Nav.Link>

            {isLoggedIn && userRole === "admin" && (
              <>
                <Nav.Link
                  onClick={() => navigate("/admin-dashboard")}
                  className="mx-2 fw-semibold nav-hover"
                  style={{ color: "#6366f1" }}
                >
                  Admin Dashboard
                </Nav.Link>
              </>
            )}

            {isLoggedIn && userRole !== "admin" && (
              <Nav.Link 
                onClick={() => navigate("/Mybookings")} 
                className="mx-2 fw-semibold nav-hover"
                style={{ color: "#6366f1" }}
              >
                My Bookings
              </Nav.Link>
            )}

            {(!isLoggedIn || userRole !== "admin") && (
              <>
                <Nav.Link 
                  onClick={() => navigate("/contactus")} 
                  className="mx-2 fw-semibold nav-hover"
                  style={{ color: "#6366f1" }}
                >
                  Contact Us
                </Nav.Link>

                <Nav.Link 
                  onClick={() => navigate("/aboutus")} 
                  className="mx-2 fw-semibold nav-hover"
                  style={{ color: "#6366f1" }}
                >
                  About Us
                </Nav.Link>
              </>
            )}
          </Nav>

          <Form className="d-flex align-items-center gap-3">
            {isLoggedIn && userName && (
              <span className="fw-semibold" style={{ color: "#64748b" }}>
                👋 Welcome, <span style={{ color: "#6366f1", background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontWeight: "700" }}>{userName}</span>
              </span>
            )}

            {isLoggedIn ? (
              <Button
                variant="outline-danger"
                className="px-4 fw-semibold"
                onClick={handleLogout}
                style={{ borderWidth: "2px", borderRadius: "8px", borderColor: "#ef4444", color: "#ef4444" }}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="primary"
                className="px-4 fw-semibold"
                onClick={handleLoginClick}
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
                }}
              >
                Login
              </Button>
            )}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
