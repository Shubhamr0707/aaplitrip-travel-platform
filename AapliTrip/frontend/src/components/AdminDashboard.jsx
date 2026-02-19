import { useEffect, useState } from "react";
import { Container, Table, Button, Badge, Tabs, Tab } from "react-bootstrap";
import { getAllBookings, updateBookingStatus } from "../services/MyTripService";
import { getAllContacts, updateContactStatus } from "../services/ContactService";
import { toast } from "react-toastify";
import { ReceiptModal } from "./ReceiptModal";

export function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [activeTab, setActiveTab] = useState("bookings");

    const fetchBookings = async () => {
        try {
            const response = await getAllBookings();
            setBookings(response.data);
        } catch (error) {
            toast.error("Failed to load bookings");
        }
    };

    const fetchContacts = async () => {
        try {
            const response = await getAllContacts();
            setContacts(response.data);
        } catch (error) {
            toast.error("Failed to load contact submissions");
        }
    };

    useEffect(() => {
        fetchBookings();
        fetchContacts();
    }, []);

    const handleStatusUpdate = async (bookingId, status) => {
        if (!bookingId) {
            toast.error("Error: Booking ID is missing");
            return;
        }
        try {
            await updateBookingStatus(bookingId, status);
            toast.success(`Booking ${status}`);
            fetchBookings();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const viewReceipt = (booking) => {
        setSelectedBooking(booking);
        setShowReceiptModal(true);
    };

    const handleContactStatusUpdate = async (contactId, status) => {
        try {
            await updateContactStatus(contactId, status);
            toast.success(`Contact status updated to ${status}`);
            fetchContacts();
        } catch (error) {
            toast.error("Failed to update contact status");
        }
    };

    return (
        <div style={{ background: "#f0f9ff", minHeight: "100vh" }}>
            <Container className="py-5">
            <div className="text-center mb-5">
                <h2 
                    className="fw-bold mb-3"
                    style={{
                        color: "#0ea5e9",
                        fontSize: "clamp(2rem, 4vw, 2.5rem)"
                    }}
                >
                    Admin Dashboard
                </h2>
                <p className="text-muted fs-5">
                    <strong>Problem Solving:</strong> Help customers resolve booking issues quickly. Review enquiries, 
                    verify documentation, approve bookings, manage contact submissions, and handle cancellations efficiently. 
                    Your actions directly solve customer travel problems.
                </p>
            </div>

            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
            >
                <Tab eventKey="bookings" title="📋 Bookings">
                    <div className="table-responsive mt-4">
                        <Table striped bordered hover className="shadow-sm">
                    <thead className="bg-dark text-white">
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Destination</th>
                            <th>Mode</th>
                            <th>Budget</th>
                            <th>Identity Proof</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.trip_id}>
                                <td>{booking.trip_id}</td>
                                <td>{booking.user_name}</td>
                                <td>{booking.destination}</td>
                                <td>{booking.Mode}</td>
                                <td>₹{booking.Budget}</td>
                                <td>
                                    {booking.identity_proof ? (
                                        <a
                                            href={`http://localhost:8080/uploads/${booking.identity_proof}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-info text-white"
                                        >
                                            View ID
                                        </a>
                                    ) : (
                                        <span className="text-muted">Not Uploaded</span>
                                    )}
                                </td>
                                <td>
                                    <Badge
                                        bg={
                                            booking.status === "APPROVED" || booking.status === "CONFIRMED"
                                                ? "success"
                                                : booking.status === "REJECTED" || booking.status === "CANCELLED"
                                                    ? "danger"
                                                    : "warning"
                                        }
                                    >
                                        {booking.status}
                                    </Badge>
                                </td>
                                <td>
                                    {booking.status === "PENDING" && (
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleStatusUpdate(booking.trip_id, "APPROVED")}
                                                style={{ borderRadius: "8px" }}
                                            >
                                                ✓ Approve
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleStatusUpdate(booking.trip_id, "REJECTED")}
                                                style={{ borderRadius: "8px" }}
                                            >
                                                ✗ Reject
                                            </Button>
                                        </div>
                                    )}
                                    {booking.status === "APPROVED" && (
                                        <div>
                                            <Badge bg="warning" className="mb-2">⏳ Awaiting Payment</Badge>
                                            <div className="small text-muted">Customer has 24 hours to pay</div>
                                        </div>
                                    )}
                                    {booking.status === "CONFIRMED" && (
                                        <div className="d-flex gap-2 align-items-center">
                                            <Badge bg="success">✓ Confirmed</Badge>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => viewReceipt(booking)}
                                                style={{ borderRadius: "8px" }}
                                            >
                                                View Receipt
                                            </Button>
                                        </div>
                                    )}
                                    {booking.status === "REJECTED" && (
                                        <Badge bg="danger">Rejected</Badge>
                                    )}
                                    {booking.status === "CANCELLED" && (
                                        <Badge bg="secondary">Cancelled</Badge>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                    </div>
                </Tab>

                <Tab eventKey="contacts" title="📧 Contact Submissions">
                    <div className="table-responsive mt-4">
                        <Table striped bordered hover className="shadow-sm">
                            <thead className="bg-dark text-white">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Issue Type</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th>Submitted</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center text-muted py-4">
                                            No contact submissions yet
                                        </td>
                                    </tr>
                                ) : (
                                    contacts.map((contact) => (
                                        <tr key={contact.id}>
                                            <td>{contact.id}</td>
                                            <td>{contact.name}</td>
                                            <td>{contact.email}</td>
                                            <td>
                                                <Badge bg="info">
                                                    {contact.issueType}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {contact.message}
                                                </div>
                                            </td>
                                            <td>
                                                <Badge
                                                    bg={
                                                        contact.status === "RESOLVED"
                                                            ? "success"
                                                            : contact.status === "IN_PROGRESS"
                                                                ? "warning"
                                                                : "secondary"
                                                    }
                                                >
                                                    {contact.status}
                                                </Badge>
                                            </td>
                                            <td>
                                                {contact.createdAt 
                                                    ? new Date(contact.createdAt).toLocaleDateString()
                                                    : "N/A"}
                                            </td>
                                            <td>
                                                {contact.status === "PENDING" && (
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="warning"
                                                            size="sm"
                                                            onClick={() => handleContactStatusUpdate(contact.id, "IN_PROGRESS")}
                                                            style={{ borderRadius: "8px" }}
                                                        >
                                                            In Progress
                                                        </Button>
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={() => handleContactStatusUpdate(contact.id, "RESOLVED")}
                                                            style={{ borderRadius: "8px" }}
                                                        >
                                                            ✓ Resolve
                                                        </Button>
                                                    </div>
                                                )}
                                                {contact.status === "IN_PROGRESS" && (
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handleContactStatusUpdate(contact.id, "RESOLVED")}
                                                        style={{ borderRadius: "8px" }}
                                                    >
                                                        ✓ Mark Resolved
                                                    </Button>
                                                )}
                                                {contact.status === "RESOLVED" && (
                                                    <Badge bg="success">Resolved</Badge>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Tab>
            </Tabs>

            {selectedBooking && (
                <ReceiptModal
                    show={showReceiptModal}
                    handleClose={() => setShowReceiptModal(false)}
                    booking={selectedBooking}
                />
            )}
            </Container>
        </div>
    );
}
