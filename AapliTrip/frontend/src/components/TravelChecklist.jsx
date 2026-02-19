import { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Badge } from "react-bootstrap";
import { FaCheckCircle, FaCircle } from "react-icons/fa";

export function TravelChecklist({ show, handleClose, booking }) {
  const [checklist, setChecklist] = useState(() => {
    if (booking?.trip_id) {
      const saved = localStorage.getItem(`checklist_${booking.trip_id}`);
      if (saved) return JSON.parse(saved);
    }
    return {
      idProof: false,
      tickets: false,
      hotel: false,
      packing: false,
      insurance: false,
      currency: false,
      documents: false,
      emergency: false
    };
  });

  const checklistItems = [
    { key: "idProof", label: "Valid ID Proof (Aadhar/Passport)", required: true },
    { key: "tickets", label: "Travel Tickets/Voucher", required: true },
    { key: "hotel", label: "Hotel Booking Confirmation", required: false },
    { key: "packing", label: "Packing Complete", required: false },
    { key: "insurance", label: "Travel Insurance", required: false },
    { key: "currency", label: "Local Currency/Cards", required: false },
    { key: "documents", label: "All Travel Documents", required: true },
    { key: "emergency", label: "Emergency Contact Numbers", required: false }
  ];

  const toggleItem = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const requiredCount = checklistItems.filter(item => item.required).length;
  const requiredCompleted = checklistItems
    .filter(item => item.required)
    .every(item => checklist[item.key]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header 
        closeButton
        style={{ 
          background: "#0ea5e9",
          color: "white"
        }}
      >
        <Modal.Title className="fw-bold">Travel Checklist</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="mb-4">
          <h5 className="fw-bold mb-2">Trip: {booking?.destination}</h5>
          <p className="text-muted small mb-0">
            Travel Date: {booking?.start_date} | Travelers: {booking?.No_of_Person}
          </p>
          <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small">Progress: {completedCount} of {checklistItems.length} items</span>
              <span className="small fw-bold" style={{ color: requiredCompleted ? "#22c55e" : "#f59e0b" }}>
                {requiredCompleted ? "✅ Ready to Travel" : "⚠️ Complete Required Items"}
              </span>
            </div>
            <div className="progress" style={{ height: "8px" }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ 
                  width: `${(completedCount / checklistItems.length) * 100}%`,
                  background: requiredCompleted ? "#22c55e" : "#0ea5e9"
                }}
              />
            </div>
          </div>
        </div>

        <ListGroup>
          {checklistItems.map((item) => (
            <ListGroup.Item
              key={item.key}
              className="d-flex align-items-center"
              style={{ 
                cursor: "pointer",
                border: checklist[item.key] ? "2px solid #22c55e" : "1px solid #e2e8f0",
                borderRadius: "8px",
                marginBottom: "8px"
              }}
              onClick={() => toggleItem(item.key)}
            >
              <div className="me-3" style={{ fontSize: "1.2rem" }}>
                {checklist[item.key] ? (
                  <FaCheckCircle style={{ color: "#22c55e" }} />
                ) : (
                  <FaCircle style={{ color: "#cbd5e1" }} />
                )}
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center">
                  <span className={checklist[item.key] ? "text-decoration-line-through text-muted" : ""}>
                    {item.label}
                  </span>
                  {item.required && (
                    <Badge bg="danger" className="ms-2 small">Required</Badge>
                  )}
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <div className="alert alert-info mt-4 mb-0">
          <strong>💡 Tips:</strong>
          <ul className="mb-0 mt-2 small">
            <li>Complete all required items before your travel date</li>
            <li>Keep digital copies of all documents on your phone</li>
            <li>Arrive at the joining point 30 minutes early</li>
            <li>Carry emergency contact information</li>
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} style={{ borderRadius: "8px" }}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={() => {
            localStorage.setItem(`checklist_${booking?.trip_id}`, JSON.stringify(checklist));
            handleClose();
          }}
          style={{ borderRadius: "8px", background: "#0ea5e9", border: "none" }}
        >
          Save Checklist
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

