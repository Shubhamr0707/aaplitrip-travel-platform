export function Footers() {
  return (
    <footer 
      className="py-5 text-white mt-5"
      style={{
        background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
        borderTop: "3px solid transparent",
        borderImage: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%) 1"
      }}
    >
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="fw-bold mb-3" style={{ color: "#ffffff" }}>
              <span style={{ 
                color: "#818cf8",
                background: "linear-gradient(135deg, #818cf8 0%, #f472b6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                ✈️ WanderWings
              </span>
            </h5>
            <p style={{ color: "#cbd5e1", lineHeight: "1.8" }}>
              WanderWings is your trusted travel companion for discovering amazing destinations 
              across India and around the world. We offer curated travel packages with detailed 
              itineraries, flexible booking options, and competitive pricing. Create unforgettable 
              memories with our seamless travel booking experience.
            </p>
          </div>
          <div className="col-md-4">
            <h5 className="fw-bold mb-3" style={{ color: "#ffffff" }}>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a 
                  href="/" 
                  className="text-decoration-none" 
                  style={{ 
                    color: "#cbd5e1", 
                    transition: "all 0.3s",
                    display: "inline-block"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#818cf8";
                    e.target.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#cbd5e1";
                    e.target.style.transform = "translateX(0)";
                  }}
                >
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a 
                  href="/destinations" 
                  className="text-decoration-none" 
                  style={{ 
                    color: "#cbd5e1", 
                    transition: "all 0.3s",
                    display: "inline-block"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#818cf8";
                    e.target.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#cbd5e1";
                    e.target.style.transform = "translateX(0)";
                  }}
                >
                  Destinations
                </a>
              </li>
              <li className="mb-2">
                <a 
                  href="/aboutus" 
                  className="text-decoration-none" 
                  style={{ 
                    color: "#cbd5e1", 
                    transition: "all 0.3s",
                    display: "inline-block"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#818cf8";
                    e.target.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#cbd5e1";
                    e.target.style.transform = "translateX(0)";
                  }}
                >
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a 
                  href="/contactus" 
                  className="text-decoration-none" 
                  style={{ 
                    color: "#cbd5e1", 
                    transition: "all 0.3s",
                    display: "inline-block"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#818cf8";
                    e.target.style.transform = "translateX(5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#cbd5e1";
                    e.target.style.transform = "translateX(0)";
                  }}
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5 className="fw-bold mb-3" style={{ color: "#ffffff" }}>Contact Info</h5>
            <p className="mb-2" style={{ color: "#cbd5e1" }}>
              📧 <a href="mailto:info@wanderwings.com" style={{ color: "#cbd5e1", textDecoration: "none" }}>info@wanderwings.com</a>
            </p>
            <p className="mb-2" style={{ color: "#cbd5e1" }}>
              📞 <a href="tel:+9118001234567" style={{ color: "#cbd5e1", textDecoration: "none" }}>+91 1800-123-4567</a>
            </p>
            <p className="mb-2" style={{ color: "#cbd5e1" }}>
              📍 WanderWings Travels Pvt. Ltd.<br />
              <span style={{ fontSize: "0.9rem" }}>Mumbai, Maharashtra, India - 400001</span>
            </p>
            <p className="mb-0 small" style={{ color: "#cbd5e1" }}>
              ⏰ Support Hours: Mon-Sat, 9 AM - 7 PM IST
            </p>
          </div>
        </div>
        <hr className="my-4" style={{ borderColor: "#475569" }} />
        <div className="text-center">
          <p className="mb-0" style={{ color: "#cbd5e1" }}>
            © {new Date().getFullYear()} <strong style={{ color: "#ffffff" }}>WanderWings</strong>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}