import { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import travelVideo from "../assets/css/14643066_1080_1920_30fps.mp4"
import { useNavigate } from "react-router-dom";
import { getAllDestination } from "../services/DestinationService";
import { sortDestinations, getRecommendations } from "../utils/destinationUtils";
import { DestinationSkeleton, HeroSkeleton } from "./LoadingSkeleton";
import "../assets/css/Home.css";

export function Home() {
  const navigate = useNavigate();
  const [allDestinations, setAllDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await getAllDestination();
      setAllDestinations(response.data);
    } catch (error) {
      // Error handled silently, loading state will show
    } finally {
      setLoading(false);
    }
  };

  // Smart recommendations - get top 3 most popular destinations
  const destinations = useMemo(() => {
    const sorted = sortDestinations(allDestinations, "popularity");
    return sorted.slice(0, 3);
  }, [allDestinations]);

  if (loading) {
    return (
      <div>
        <HeroSkeleton />
        <Container className="my-5 py-5">
          <DestinationSkeleton count={3} />
        </Container>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div style={{ position: "relative", height: "95vh", overflow: "hidden" }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            top: 0,
            left: 0,
            zIndex: -1,
            filter: "brightness(60%)",
          }}
        >
          <source src={travelVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div
          className="text-center text-white d-flex align-items-center justify-content-center flex-column"
          style={{
            height: "100%",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.85) 0%, rgba(139, 92, 246, 0.85) 50%, rgba(236, 72, 153, 0.85) 100%)",
            zIndex: 1,
            padding: "2rem",
          }}
        >
          <div className="slide-in" style={{ maxWidth: "800px" }}>
            <h1 
              className="fw-bold display-2 mb-4"
              style={{
                textShadow: "2px 2px 12px rgba(0,0,0,0.4)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                color: "white"
              }}
            >
              Travel Without Worry
            </h1>
            <p 
              className="lead mb-5 fs-4"
              style={{
                textShadow: "1px 1px 6px rgba(0,0,0,0.3)",
                fontWeight: "400",
                color: "rgba(255,255,255,0.95)"
              }}
            >
              Just enquire, we approve, you pay. <strong>We handle everything else.</strong><br/>
              Pickup, drop, accommodation, meals, guides, transportation — all taken care of. 
              Your only job? Enjoy the journey! 🎉
            </p>
            <Button 
              variant="light" 
              className="px-5 py-3 fw-bold fs-5"
              onClick={() => navigate("/destinations")}
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                color: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }}
            >
              Explore Now →
            </Button>
          </div>
        </div>
      </div>

      {/* About / Welcome Section */}
      <Container className="my-5 py-5 text-center">
        <div className="fade-in">
          <h2 
            className="fw-bold mb-4"
            style={{
              color: "#6366f1",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "clamp(2rem, 4vw, 3rem)"
            }}
          >
            We Handle Everything. You Just Travel.
          </h2>
          <p className="text-muted mx-auto fs-5" style={{ maxWidth: "800px", lineHeight: "1.8" }}>
            <strong style={{ color: "#6366f1" }}>Zero-worry travel experience.</strong> You make an enquiry, we review and approve, you make payment. 
            After that, <strong style={{ color: "#ec4899" }}>we take complete care</strong> — pickup from your location, drop at destination, 
            accommodation, meals, local transportation, guided tours, and drop back. 
            No planning stress, no logistics headache. Just pack your bags and show up. We've got everything covered! ✈️
          </p>
        </div>
      </Container>

      {/* Features Section */}
      <Container className="my-5 py-4">
        <Row className="g-4 justify-content-center">
          <Col md={4} className="text-center">
            <div className="p-4">
              <div 
                className="rounded-lg d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "70px",
                  height: "70px",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "white",
                  fontSize: "2rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
                }}
              >
                ✈️
              </div>
              <h4 className="fw-bold" style={{ color: "#6366f1" }}>🚗 Pickup & Drop Service</h4>
              <p className="text-muted mb-2"><strong style={{ color: "#6366f1" }}>We Handle:</strong> Door-to-door pickup from your location, comfortable transfer to joining point, and safe drop back after your trip. No need to arrange transportation — we've got you covered from start to finish!</p>
            </div>
          </Col>
          <Col md={4} className="text-center">
            <div className="p-4">
              <div className="rounded-lg d-inline-flex align-items-center justify-content-center mb-3 feature-icon feature-icon-secondary">
                🌟
              </div>
              <h4 className="fw-bold" style={{ color: "#ec4899" }}>🏨 Complete Arrangements</h4>
              <p className="text-muted mb-2"><strong style={{ color: "#ec4899" }}>We Handle:</strong> Hotel bookings, meal arrangements, local transportation, guided tours, entry tickets, and all travel documentation. Everything is pre-arranged and confirmed before you travel. Just relax and enjoy!</p>
            </div>
          </Col>
          <Col md={4} className="text-center">
            <div className="p-4">
              <div className="rounded-lg d-inline-flex align-items-center justify-content-center mb-3 feature-icon feature-icon-success">
                🎯
              </div>
              <h4 className="fw-bold" style={{ color: "#10b981" }}>📞 24/7 Support</h4>
              <p className="text-muted mb-2"><strong style={{ color: "#10b981" }}>We Handle:</strong> Round-the-clock assistance during your trip. Our support team is always available to help with any questions, changes, or emergencies. Travel with complete peace of mind knowing help is just a call away!</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Trending Destinations Section */}
      <Container className="my-5 py-5">
        <div className="text-center mb-5">
          <h2 
            className="fw-bold mb-3"
            style={{
              color: "#6366f1",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "clamp(2rem, 4vw, 2.5rem)"
            }}
          >
            Popular Destinations
          </h2>
          <p className="text-muted fs-5">Handpicked destinations with verified reviews and best-value packages</p>
        </div>
        <Row className="g-4">
          {destinations.length > 0 ? (
            destinations.map((dest, index) => (
              <Col md={4} key={dest.dest_id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className="shadow-lg border h-100 overflow-hidden destination-card-home">
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src={dest.Imgpath || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"}
                      alt={dest.destination_name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop";
                      }}
                      className="destination-image-home"
                      style={{ backgroundColor: "#f1f5f9" }}
                    />
                    <div className="position-absolute top-0 end-0 m-3 px-3 py-1 text-white fw-bold trending-badge">
                      Trending
                    </div>
                  </div>
                  <Card.Body className="text-center d-flex flex-column justify-content-between p-4">
                    <div>
                      <Card.Title className="fw-bold mb-3" style={{ fontSize: "1.5rem", color: "#1e293b" }}>
                        {dest.destination_name}
                      </Card.Title>
                      <Card.Text
                        className="text-muted"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: "1.6"
                        }}
                      >
                        {dest.description}
                      </Card.Text>
                    </div>
                    <Button
                      variant="primary"
                      className="mt-4 px-4 py-2 fw-semibold view-details-button"
                      onClick={() => navigate("/destinations")}
                    >
                      View Details →
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-3 fs-5">Loading amazing destinations...</p>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}
