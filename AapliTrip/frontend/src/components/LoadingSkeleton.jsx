import { Card, Container, Row, Col } from "react-bootstrap";

/**
 * Loading skeleton component for destinations
 */
export function DestinationSkeleton({ count = 6 }) {
  return (
    <Row className="g-4">
      {Array.from({ length: count }).map((_, index) => (
        <Col key={index} xs={12} sm={6} md={4} lg={3}>
          <Card className="h-100 shadow-sm border overflow-hidden" style={{ borderRadius: "16px", borderColor: "#e2e8f0" }}>
            <div
              className="skeleton-image"
              style={{
                height: "240px",
                backgroundColor: "#e2e8f0",
                animation: "pulse 1.5s ease-in-out infinite"
              }}
            />
            <Card.Body className="p-4">
              <div
                className="mb-3"
                style={{
                  height: "24px",
                  width: "70%",
                  backgroundColor: "#e2e8f0",
                  borderRadius: "4px",
                  animation: "pulse 1.5s ease-in-out infinite"
                }}
              />
              <div
                className="mb-2"
                style={{
                  height: "16px",
                  width: "100%",
                  backgroundColor: "#e2e8f0",
                  borderRadius: "4px",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: "0.1s"
                }}
              />
              <div
                className="mb-2"
                style={{
                  height: "16px",
                  width: "85%",
                  backgroundColor: "#e2e8f0",
                  borderRadius: "4px",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: "0.2s"
                }}
              />
              <div
                className="mt-3"
                style={{
                  height: "40px",
                  width: "100%",
                  backgroundColor: "#e2e8f0",
                  borderRadius: "12px",
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: "0.3s"
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

/**
 * Loading skeleton for home page hero
 */
export function HeroSkeleton() {
  return (
    <div style={{ position: "relative", height: "95vh", overflow: "hidden", backgroundColor: "#e2e8f0" }}>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          height: "100%",
          animation: "pulse 1.5s ease-in-out infinite"
        }}
      >
        <div className="text-center" style={{ maxWidth: "800px", padding: "2rem" }}>
          <div
            className="mb-4 mx-auto"
            style={{
              height: "60px",
              width: "80%",
              backgroundColor: "#cbd5e1",
              borderRadius: "8px",
              animation: "pulse 1.5s ease-in-out infinite"
            }}
          />
          <div
            className="mb-5 mx-auto"
            style={{
              height: "30px",
              width: "60%",
              backgroundColor: "#cbd5e1",
              borderRadius: "8px",
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: "0.2s"
            }}
          />
          <div
            className="mx-auto"
            style={{
              height: "50px",
              width: "200px",
              backgroundColor: "#cbd5e1",
              borderRadius: "25px",
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: "0.4s"
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for card
 */
export function CardSkeleton() {
  return (
    <Card className="shadow-sm border" style={{ borderRadius: "16px", borderColor: "#e2e8f0" }}>
      <div
        style={{
          height: "200px",
          backgroundColor: "#e2e8f0",
          animation: "pulse 1.5s ease-in-out infinite"
        }}
      />
      <Card.Body>
        <div
          className="mb-3"
          style={{
            height: "24px",
            width: "60%",
            backgroundColor: "#e2e8f0",
            borderRadius: "4px",
            animation: "pulse 1.5s ease-in-out infinite"
          }}
        />
        <div
          style={{
            height: "16px",
            width: "100%",
            backgroundColor: "#e2e8f0",
            borderRadius: "4px",
            animation: "pulse 1.5s ease-in-out infinite",
            animationDelay: "0.1s"
          }}
        />
      </Card.Body>
    </Card>
  );
}

