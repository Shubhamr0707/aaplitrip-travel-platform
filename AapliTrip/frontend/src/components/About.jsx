import { Container, Row, Col, Card } from "react-bootstrap";
import "../assets/css/About.css";
import shilpa from "../assets/Shubham.jpg";
import aditya from "../assets/Shubham.jpg"
import sanket from "../assets/Shubham.jpg"

export function About() {
  return (
    <div className="about-page" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #fce7f3 100%)", backgroundAttachment: "fixed", minHeight: "100vh" }}>
      <Container>
        <div className="text-center mb-5 fade-in">
            <h1 
              className="fw-bold mb-4"
              style={{
                color: "#6366f1",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: "clamp(2.5rem, 5vw, 4rem)"
              }}
            >
              Solving Real Travel Problems
            </h1>
          <p className="text-muted fs-5 mt-3 mx-auto" style={{ maxWidth: "800px", lineHeight: "1.8" }}>
            <strong style={{ color: "#6366f1" }}>WanderWings</strong> was born from real frustrations: 
            spending hours comparing prices, losing track of bookings, dealing with hidden fees, and struggling with complex travel planning. 
            We built a platform that solves these everyday problems, making travel planning as simple as it should be.
          </p>
        </div>

        <Row className="justify-content-center mb-5 fade-in">
          <Col md={10}>
            <Card className="shadow-lg border p-5" style={{ background: "white", borderRadius: "16px", borderColor: "#e2e8f0" }}>
              <Card.Body>
                <h4 
                  className="fw-bold text-center mb-4"
                  style={{
                    color: "#6366f1",
                    background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontSize: "2rem"
                  }}
                >
                  🎯 Our Complete Service Promise
                </h4>
                
                <div className="mb-4">
                  <h6 className="fw-bold mb-2" style={{ color: "#6366f1" }}>🚗 Pickup & Drop Service</h6>
                  <p className="fs-6 text-muted mb-3" style={{ lineHeight: "1.8" }}>
                    <strong style={{ color: "#6366f1" }}>We Handle:</strong> Door-to-door pickup from your location, comfortable transfer to the joining point, 
                    and safe drop back after your trip completion. No need to worry about reaching the starting point or getting back home. 
                    Our vehicles will pick you up and drop you safely — completely handled by us!
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold mb-2" style={{ color: "#ec4899" }}>🏨 Complete Arrangements</h6>
                  <p className="fs-6 text-muted mb-3" style={{ lineHeight: "1.8" }}>
                    <strong style={{ color: "#ec4899" }}>We Handle:</strong> Hotel bookings with confirmed reservations, meal arrangements (breakfast, lunch, dinner), 
                    local transportation for sightseeing, professional tour guides, entry tickets to all attractions, and all travel documentation. 
                    Everything is pre-arranged and confirmed before you travel. Just relax and enjoy!
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold mb-2" style={{ color: "#10b981" }}>📞 24/7 Support & Assistance</h6>
                  <p className="fs-6 text-muted mb-3" style={{ lineHeight: "1.8" }}>
                    <strong style={{ color: "#10b981" }}>We Handle:</strong> Round-the-clock customer support throughout your journey. Our team is always available 
                    to help with any questions, changes, emergencies, or special requests. Travel with complete peace of mind knowing 
                    professional help is just a call away, anytime, anywhere!
                  </p>
                </div>

                <div className="mb-0">
                  <h6 className="fw-bold mb-2" style={{ color: "#f59e0b" }}>✨ Simple Process - You Just Travel</h6>
                  <p className="fs-6 text-muted mb-0" style={{ lineHeight: "1.8" }}>
                    <strong style={{ color: "#f59e0b" }}>How It Works:</strong> You make an enquiry with your travel preferences. We review and approve within 24 hours. 
                    You make secure payment. After that, <strong style={{ color: "#6366f1" }}>we handle everything</strong> — pickup, accommodation, meals, transport, guides, 
                    tickets, and drop. You just need to pack your bags and be ready at the pickup point. We'll take care of the rest! 
                    No planning stress, no logistics headache. Just pure travel enjoyment! 🎉
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mb-5 fade-in">
          <h2 
            className="fw-bold mb-3"
            style={{
              color: "#6366f1",
              background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "clamp(2rem, 4vw, 2.5rem)"
            }}
          >
            Meet Our Team
          </h2>
          <p className="text-muted fs-5">The talented people behind WanderWings</p>
        </div>

        <Row className="g-4 justify-content-center">
          <Col md={4} sm={6} className="fade-in">
            <Card className="team-card shadow-lg border text-center p-4 h-100" style={{ borderRadius: "16px", borderColor: "#e2e8f0", background: "white" }}>
              <div className="team-photo mx-auto mb-3">
                <img
                  src={sanket}
                  alt="Lead Developer"
                  className="rounded-circle img-fluid"
                />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: "#6366f1" }}>Shubham Rokade</h5>
              <p className="mb-3 fw-semibold" style={{ color: "#6366f1", background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Lead Developer</p>
              <p className="text-muted small" style={{ lineHeight: "1.7" }}>
                Full Stack & AI Developer passionate about building scalable
                systems and integrating intelligent automation.
              </p>
            </Card>
          </Col>

          <Col md={4} sm={6} className="fade-in" style={{ animationDelay: "0.1s" }}>
            <Card className="team-card shadow-lg border text-center p-4 h-100" style={{ borderRadius: "16px", borderColor: "#e2e8f0", background: "white" }}>
              <div className="team-photo mx-auto mb-3">
                <img
                  src={shilpa}
                  alt="Sub Developer 1"
                  className="rounded-circle img-fluid"
                />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: "#ec4899" }}>Omkar Nalawade</h5>
              <p className="mb-3 fw-semibold" style={{ color: "#ec4899", background: "linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Sub Developer</p>
              <p className="text-muted small" style={{ lineHeight: "1.7" }}>
                Backend and database enthusiast ensuring smooth communication
                between the client and server layers of the application.
              </p>
            </Card>
          </Col>

          <Col md={4} sm={6} className="fade-in" style={{ animationDelay: "0.2s" }}>
            <Card className="team-card shadow-lg border text-center p-4 h-100" style={{ borderRadius: "16px", borderColor: "#e2e8f0", background: "white" }}>
              <div className="team-photo mx-auto mb-3">
                <img
                  src={aditya}
                  alt="Sub Developer 2"
                  className="rounded-circle img-fluid"
                />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: "#10b981" }}>Satyajeet Kadam</h5>
              <p className="mb-3 fw-semibold" style={{ color: "#10b981", background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Sub Developer</p>
              <p className="text-muted small" style={{ lineHeight: "1.7" }}>
                Frontend developer focusing on crafting beautiful and responsive
                user interfaces using React and Bootstrap.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
