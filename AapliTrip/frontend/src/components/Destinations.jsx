import { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, InputGroup, Badge } from "react-bootstrap";
import { getAllDestination, DeleteDestination } from "../services/DestinationService";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/TokenService";
import { getRole } from "../services/RoleService";
import { toast } from "react-toastify";
import { 
  searchDestinations, 
  filterDestinations, 
  sortDestinations, 
  getUniqueCountries, 
  getPriceRange,
  formatPrice,
  getTripSummary,
  formatDate,
  isDomesticDestination,
  fillEmptyFields,
  reconstructTripDetails
} from "../utils/destinationUtils";
import { DestinationSkeleton } from "./LoadingSkeleton";
import { FaSearch } from "react-icons/fa";

export function Destinations() {
  const [allDestinations, setAllDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [joiningPoint, setJoiningPoint] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [filters, setFilters] = useState({
    country: "all",
    minPrice: "",
    maxPrice: "",
    duration: "all",
    startDate: ""
  });
  
  const navigate = useNavigate();

  const fetchDestination = async () => {
    try {
      setLoading(true);
      const response = await getAllDestination();
      if (response && response.data) {
        setAllDestinations(Array.isArray(response.data) ? response.data : []);
      } else {
        setAllDestinations([]);
      }
    } catch (error) {
      setAllDestinations([]);
      toast.error("Failed to load destinations. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestination();
    setIsLoggedIn(!!getToken());
    setUserRole(getRole());
  }, []);

  // Smart filtering and sorting logic
  const processedDestinations = useMemo(() => {
    try {
      if (!allDestinations || !Array.isArray(allDestinations)) {
        return [];
      }
      
      let result = [...allDestinations];
      
      // Apply search
      result = searchDestinations(result, searchQuery);
      
      // Apply filters
      result = filterDestinations(result, filters);
      
      // Apply sorting
      result = sortDestinations(result, sortBy);
      
      return result;
    } catch (error) {
      return allDestinations || [];
    }
  }, [allDestinations, searchQuery, filters, sortBy]);

  const countries = useMemo(() => {
    try {
      return getUniqueCountries(allDestinations);
    } catch (error) {
      return [];
    }
  }, [allDestinations]);
  
  const priceRange = useMemo(() => {
    try {
      return getPriceRange(allDestinations);
    } catch (error) {
      return { min: 0, max: 100000 };
    }
  }, [allDestinations]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [destinationToDelete, setDestinationToDelete] = useState(null);

  const handleDelete = async (id) => {
    setDestinationToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (destinationToDelete) {
      try {
        await DeleteDestination(destinationToDelete);
        toast.success("Destination deleted successfully");
        fetchDestination();
        setShowDeleteModal(false);
        setDestinationToDelete(null);
      } catch (error) {
        toast.error("Failed to delete destination");
      }
    }
  };

  const handleEdit = (destination) => {
    navigate("/AddDestinations", { state: { destination } });
  };

  const handleViewDetails = (destination) => {
    setSelectedDestination(destination);
    setShowDetailsModal(true);
  };

  const handleEnquireNow = () => {
    if (!isLoggedIn) {
      toast.info("Please Login to Enquire and View Pricing");
      navigate("/login");
      return;
    }
    setShowDetailsModal(false);
    setShowBookingModal(true);
    setJoiningPoint(""); // Reset selection
  };

  const handleConfirmBooking = () => {
    if (!joiningPoint) {
      toast.error("Please select joining point.");
      return;
    }

    // Default to Flight mode
    const defaultTravelMode = "Flight";
    
    // Reconstruct trip details with variant information
    const tripDetails = reconstructTripDetails(selectedDestination, joiningPoint, defaultTravelMode);

    if (!tripDetails) {
      toast.error("Failed to prepare trip details. Please try again.");
      return;
    }

    setShowBookingModal(false);
    navigate("/book-trip", { state: { destination: tripDetails, joiningPoint, travelMode: defaultTravelMode } });
  };

  // Get joining points dynamically from variants
  const joiningPoints = useMemo(() => {
    if (!selectedDestination?.variants) return [];
    const cities = [...new Set(selectedDestination.variants.map(v => v.source_city))];
    return cities.length > 0 ? cities : ["Mumbai", "Pune", "Delhi", "Bangalore"];
  }, [selectedDestination]);


  return (
    <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #fce7f3 100%)", backgroundAttachment: "fixed", minHeight: "100vh" }}>
      <Container className="py-5">
        <div className="text-center mb-5 fade-in">
          <h1 
            className="fw-bold mb-3"
            style={{
              color: "#6366f1",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "clamp(2rem, 4vw, 3rem)"
            }}
          >
            Popular Destinations
          </h1>
          <p className="text-muted fs-5">
            Stop wasting time searching multiple sites. Find your perfect destination with transparent pricing, 
            detailed itineraries, and instant price comparison — all in one place. Solve your travel planning problems today.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-4 border shadow-lg p-4" style={{ borderRadius: "16px", borderColor: "#e2e8f0", background: "white", boxShadow: "0 4px 20px rgba(99, 102, 241, 0.1)" }}>
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Label className="fw-semibold mb-2" style={{ color: "#6366f1" }}>🔍 Search Destinations</Form.Label>
              <InputGroup>
                <InputGroup.Text style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", borderRight: "none", borderColor: "#6366f1", color: "white" }}>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name, country, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ 
                    borderLeft: "none", 
                    padding: "0.75rem 1rem", 
                    borderRadius: "8px",
                    background: "white",
                    borderColor: "#e2e8f0",
                    color: "#1e293b"
                  }}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Label className="fw-semibold mb-2" style={{ color: "#6366f1" }}>📊 Sort By</Form.Label>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ 
                  padding: "0.75rem 1rem", 
                  borderRadius: "8px", 
                  border: "1.5px solid #e2e8f0",
                  background: "white",
                  color: "#1e293b"
                }}
              >
                <option value="popularity">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="duration-short">Duration: Shortest</option>
                <option value="duration-long">Duration: Longest</option>
              </Form.Select>
            </Col>
          </Row>

        </Card>

        {/* Results Count */}
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <p className="text-muted mb-0">
            Showing <strong style={{ color: "#6366f1" }}>{processedDestinations.length}</strong> of <strong style={{ color: "#6366f1" }}>{allDestinations.length}</strong> destinations
          </p>
          {userRole === "admin" && (
            <Button 
              variant="success" 
              onClick={() => navigate("/AddDestinations")}
              className="px-4 fw-semibold"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
              }}
            >
              + Add New Destination
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <DestinationSkeleton count={8} />
        ) : processedDestinations.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-4" style={{ fontSize: "4rem" }}>🔍</div>
            <h4 className="fw-bold" style={{ color: "#6366f1", background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>No destinations found</h4>
            <p className="text-muted">Try adjusting your search query</p>
            <Button
              variant="primary"
              onClick={() => {
                setSearchQuery("");
                setSortBy("popularity");
              }}
              className="px-4 mt-3"
              style={{ 
                borderRadius: "8px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                border: "none",
                color: "white",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
              }}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <Row className="g-4 justify-content-center">
            {processedDestinations.map((dest, index) => {
              if (!dest || !dest.dest_id) {
                return null;
              }
              return (
                <Col key={dest.dest_id || index} xs={12} sm={6} md={4} lg={3} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <Card className="h-100 shadow-lg border overflow-hidden" style={{ transition: "all 0.3s ease", borderRadius: "16px", borderColor: "#e2e8f0", background: "white", boxShadow: "0 4px 20px rgba(99, 102, 241, 0.1)" }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <Card.Img
                    variant="top"
                    src={dest.Imgpath || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"}
                    alt={dest.destination_name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop";
                    }}
                    style={{
                      height: "240px",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                      backgroundColor: "#1a1a1a",
                      filter: "brightness(0.9)"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                  />
                  <div 
                    className="position-absolute top-0 start-0 m-3 px-3 py-1 fw-bold"
                    style={{
                      background: "#ffffff",
                      color: "#1e293b",
                      fontSize: "0.85rem",
                      borderRadius: "6px",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                      border: "1px solid #e2e8f0"
                    }}
                  >
                    {dest.Country}
                  </div>
                </div>
                <Card.Body className="d-flex flex-column p-4" style={{ background: "white" }}>
                  <Card.Title className="fw-bold text-center mb-3" style={{ fontSize: "1.3rem", color: "#1e293b" }}>
                    {dest.destination_name}
                  </Card.Title>
                  <Card.Text
                    className="text-muted"
                    style={{
                      fontSize: "0.95rem",
                      textAlign: "justify",
                      flexGrow: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.6"
                    }}
                  >
                    {dest.description}
                  </Card.Text>

                  <div className="mt-3">
                    {isLoggedIn ? (
                      <div className="mb-3 p-3 text-center" style={{ background: "linear-gradient(135deg, #e0e7ff 0%, #fce7f3 100%)", borderRadius: "12px", border: "2px solid transparent", borderImage: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%) 1" }}>
                        <p className="mb-0">
                          <span className="fw-bold small" style={{ color: "#6366f1" }}>Starting from:</span>
                          <span className="fs-4 fw-bold ms-2" style={{ color: "#6366f1", background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>₹{dest.Price}</span>
                        </p>
                      </div>
                    ) : (
                      <div className="mb-3 p-2 text-center" style={{ background: "#f1f5f9", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                        <p className="mb-0 fst-italic small text-muted">
                          🔒 Login to view price
                        </p>
                      </div>
                    )}

                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        className="fw-semibold"
                        onClick={() => handleViewDetails(dest)}
                        style={{
                          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
                        }}
                      >
                        View Details →
                      </Button>

                      {userRole === "admin" && (
                        <div className="d-flex gap-2 justify-content-center mt-2">
                          <Button 
                            variant="outline-warning" 
                            size="sm" 
                            onClick={() => handleEdit(dest)}
                            className="fw-semibold"
                            style={{ borderWidth: "1.5px", borderRadius: "8px", borderColor: "#ffffff", color: "#ffffff" }}
                          >
                            ✏️ Edit
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDelete(dest.dest_id)}
                            className="fw-semibold"
                            style={{ borderWidth: "1.5px", borderRadius: "8px", borderColor: "#ff4444", color: "#ff4444" }}
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Trip Details Modal */}
        <Modal 
          show={showDetailsModal} 
          onHide={() => setShowDetailsModal(false)} 
          centered 
          size="lg"
        >
          {selectedDestination && (() => {
            const filledDestination = fillEmptyFields(selectedDestination) || selectedDestination;
            if (!filledDestination) return null;
            const summary = getTripSummary(filledDestination);
            
            return (
              <>
                <Modal.Header 
                  closeButton 
                  style={{ 
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                    color: "white",
                    borderBottom: "none"
                  }}
                >
                  <Modal.Title className="fw-bold" style={{ color: "white" }}>
                    {filledDestination.destination_name}
                  </Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-0" style={{ background: "#ffffff" }}>
                  {/* Hero Image */}
                  <div>
                    <img
                      src={filledDestination.Imgpath || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"}
                      alt={filledDestination.destination_name}
                      className="img-fluid w-100"
                      style={{ height: "250px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop";
                      }}
                    />
                  </div>

                  <div className="p-4">
                    {/* Quick Info */}
                    <Row className="g-3 mb-4">
                      <Col xs={6} sm={3}>
                        <div className="text-center p-2 rounded border" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
                          <div className="small text-muted mb-1">Country</div>
                          <div className="fw-bold" style={{ color: "#6366f1" }}>
                            {summary.country || 'India'}
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} sm={3}>
                        <div className="text-center p-2 rounded border" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
                          <div className="small text-muted mb-1">Duration</div>
                          <div className="fw-bold" style={{ color: "#6366f1" }}>
                            {summary.duration}
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} sm={3}>
                        <div className="text-center p-2 rounded border" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
                          <div className="small text-muted mb-1">Start Date</div>
                          <div className="fw-bold small" style={{ color: "#6366f1" }}>
                            {summary.startDate || 'TBA'}
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} sm={3}>
                        <div className="text-center p-2 rounded border" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
                          <div className="small text-muted mb-1">End Date</div>
                          <div className="fw-bold small" style={{ color: "#6366f1" }}>
                            {summary.endDate || 'TBA'}
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/* Description */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-2" style={{ color: "#1e293b" }}>About This Trip</h6>
                      <p className="text-muted mb-0" style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
                        {summary.description || filledDestination.description || `Experience the beauty and culture of ${filledDestination.destination_name}.`}
                      </p>
                    </div>

                    {/* Trip Schedule */}
                    {summary.itinerary && summary.itinerary.length > 0 && (
                      <div className="mb-4">
                        <h6 className="fw-bold mb-3" style={{ color: "#1e293b" }}>Trip Schedule</h6>
                        <div className="border rounded p-3" style={{ background: "#f8fafc", maxHeight: "300px", overflowY: "auto" }}>
                          {summary.itinerary.map((item, idx) => (
                            <div key={idx} className="mb-3 pb-3 border-bottom" style={{ borderColor: idx === summary.itinerary.length - 1 ? "transparent" : "#e2e8f0" }}>
                              <div className="d-flex align-items-start">
                                <div 
                                  className="d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                  style={{
                                    width: "36px",
                                    height: "36px",
                                    background: "#6366f1",
                                    color: "white",
                                    fontSize: "0.85rem",
                                    fontWeight: "bold",
                                    borderRadius: "8px"
                                  }}
                                >
                                  {item.day}
                                </div>
                                <div className="flex-grow-1">
                                  <p className="mb-0 text-muted" style={{ lineHeight: "1.6", fontSize: "0.9rem" }}>
                                    {item.activity}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pricing */}
                    {isLoggedIn ? (
                      <div className="text-center p-3 rounded border" style={{ background: "#dcfce7", borderColor: "#bbf7d0" }}>
                        <div className="small text-muted mb-1">Starting from</div>
                        <h4 className="mb-1 fw-bold" style={{ color: "#10b981" }}>
                          {formatPrice(summary.price || filledDestination.Price || '0')}
                        </h4>
                        <div className="small text-muted">per person</div>
                      </div>
                    ) : (
                      <div className="alert alert-warning mb-0 text-center">
                        <strong>Login Required</strong>
                        <div className="small mt-1">Login to view pricing and book this trip</div>
                      </div>
                    )}
                  </div>
                </Modal.Body>

                <Modal.Footer style={{ borderTop: "1px solid #e2e8f0", background: "#ffffff" }}>
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowDetailsModal(false)}
                    style={{ borderRadius: "6px" }}
                  >
                    Close
                  </Button>
                  {isLoggedIn && (
                    <Button 
                      variant="primary" 
                      onClick={handleEnquireNow}
                      style={{
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                        border: "none",
                        borderRadius: "6px"
                      }}
                    >
                      Enquire Now
                    </Button>
                  )}
                </Modal.Footer>
              </>
            );
          })()}
        </Modal>

        {/* Booking Modal (Select Joining Point) */}
        <Modal 
          show={showBookingModal} 
          onHide={() => setShowBookingModal(false)} 
          centered
          className="fade-in"
          contentClassName="bg-dark"
        >
          <Modal.Header 
            closeButton 
            className="border-0 pb-0"
            style={{ 
              background: "#000000",
              color: "white",
              borderBottom: "1px solid #333333"
            }}
          >
            <Modal.Title className="fw-bold" style={{ color: "#ffffff" }}>Select Joining Point</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4" style={{ background: "#000000", color: "#ffffff" }}>
            <p className="mb-4 fs-5" style={{ color: "#b0b0b0" }}>
              {(() => {
                const filledDest = fillEmptyFields(selectedDestination) || selectedDestination;
                if (!filledDest) {
                  return "Please select a destination first.";
                }
                const isDomestic = isDomesticDestination(filledDest);
                return (
                  <>
                    Select your joining point for <strong style={{ color: "#ffffff" }}>{filledDest.destination_name || 'this destination'}</strong>.
                  </>
                );
              })()}
            </p>

            <div className="mb-4">
              <label className="form-label fw-bold mb-2" style={{ color: "#ffffff" }}>📍 Joining Point</label>
              <select
                className="form-select"
                value={joiningPoint}
                onChange={(e) => setJoiningPoint(e.target.value)}
                style={{ 
                  padding: "0.75rem 1rem", 
                  borderRadius: "8px", 
                  border: "1.5px solid #333333",
                  background: "#1a1a1a",
                  color: "#ffffff"
                }}
              >
                <option value="">-- Select City --</option>
                {joiningPoints.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

          </Modal.Body>
          <Modal.Footer className="border-0 pt-0" style={{ background: "#000000", borderTop: "1px solid #333333" }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowBookingModal(false)}
              className="px-4 fw-semibold"
              style={{ 
                borderRadius: "8px",
                background: "#1a1a1a",
                border: "1px solid #333333",
                color: "#ffffff"
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleConfirmBooking} 
              disabled={!joiningPoint}
              className="px-4 fw-semibold"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
              }}
            >
              Proceed to Booking →
            </Button>
          </Modal.Footer>
        </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => {
          setShowDeleteModal(false);
          setDestinationToDelete(null);
        }} 
        centered
        contentClassName="bg-dark"
      >
        <Modal.Header closeButton style={{ background: "#000000", borderBottom: "1px solid #333333" }}>
          <Modal.Title style={{ color: "#ffffff" }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "#000000", color: "#ffffff" }}>
          Are you sure you want to delete this destination? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer style={{ background: "#000000", borderTop: "1px solid #333333" }}>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowDeleteModal(false);
              setDestinationToDelete(null);
            }}
            style={{ 
              borderRadius: "8px",
              background: "#1a1a1a",
              border: "1px solid #333333",
              color: "#ffffff"
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete}
            style={{ 
              borderRadius: "8px",
              background: "#ff4444",
              border: "none",
              color: "#ffffff"
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      </Container>
    </div>
  );
}
