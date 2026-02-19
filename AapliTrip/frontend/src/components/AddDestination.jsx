import { useState, useEffect } from "react";
import { Button, Card, Container, Form, Row, Col, Table } from "react-bootstrap";
import { AddDesitnation, UpdateDestination } from "../services/DestinationService";
import { Bounce, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/css/AddDestination.css";

export function AddDestination() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [destId, setDestId] = useState(null);

  const [formData, setFormData] = useState({
    destination_name: "",
    description: "",
    Price: "",
    Imgpath: "",
    country: "",
    start_date: "",
    end_date: "",
    route: "",
    exposure: ""
  });

  // New state for variants
  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState({
    source_city: "",
    travel_mode: "Flight",
    route_description: "",
    price: "",
    duration: ""
  });

  useEffect(() => {
    if (location.state && location.state.destination) {
      const dest = location.state.destination;
      setIsEditMode(true);
      setDestId(dest.dest_id);
      setFormData({
        destination_name: dest.destination_name || "",
        description: dest.description || "",
        Price: dest.Price || "",
        Imgpath: dest.Imgpath || "",
        country: dest.Country || "",
        start_date: dest.start_date || "",
        end_date: dest.end_date || "",
        route: dest.route || "",
        exposure: dest.exposure || ""
      });
      // Load existing variants if any
      if (dest.variants) {
        setVariants(dest.variants);
      }
    }
  }, [location.state]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "Imgpath" && value.includes("google.com/imgres")) {
      try {
        const url = new URL(value);
        const imgUrl = url.searchParams.get("imgurl");
        if (imgUrl) {
          value = decodeURIComponent(imgUrl);
          toast.info("Auto-extracted direct image link from Google result!");
        }
      } catch (err) {
        // Failed to parse URL, use original value
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleVariantChange = (e) => {
    setNewVariant({ ...newVariant, [e.target.name]: e.target.value });
  };

  const addVariant = () => {
    if (!newVariant.source_city || !newVariant.price) {
      toast.warning("Source City and Price are required for a variant.");
      return;
    }
    setVariants([...variants, newVariant]);
    setNewVariant({
      source_city: "",
      travel_mode: "Flight",
      route_description: "",
      price: "",
      duration: ""
    });
  };

  const removeVariant = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare payload with variants
      const payload = { ...formData, variants: variants };

      let response;
      if (isEditMode) {
        response = await UpdateDestination(destId, payload);
      } else {
        response = await AddDesitnation(payload);
      }

      if (response.status === 200) {
        toast.success(isEditMode ? "Destination Updated" : "Destination Added", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
        setTimeout(() => navigate("/destinations"), 1500);
      }
    } catch (error) {
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="add-destination-page">
      <Container className="py-5" style={{ maxWidth: "900px" }}>
      <Card className="shadow border destination-form-card">
        <Card.Body className="p-4">
          <h3 className="text-center mb-4 text-secondary fw-bold">
            {isEditMode ? "Edit Destination" : "Add New Destination"}
          </h3>

          <Form onSubmit={handleSubmit}>
            {/* ... Existing Fields ... */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Destination Name</Form.Label>
                  <Form.Control type="text" name="destination_name" value={formData.destination_name} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control type="text" name="country" value={formData.country} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" rows={3} value={formData.description} onChange={handleChange} required />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Price</Form.Label>
                  <Form.Control type="text" name="Price" value={formData.Price} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Image URL <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="url" 
                    name="Imgpath" 
                    value={formData.Imgpath} 
                    onChange={handleChange} 
                    placeholder="https://images.unsplash.com/photo-..."
                    required 
                    className="image-url-input"
                  />
                  <Form.Text className="text-muted">
                    Paste a direct image link (e.g., Unsplash, Imgur, or direct image URL ending in .jpg, .png)
                  </Form.Text>
                  {formData.Imgpath && (
                    <div className="mt-3 text-center p-3 image-preview-container">
                      <p className="small text-muted mb-2">Image Preview:</p>
                      <img 
                        src={formData.Imgpath || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"} 
                        alt="Preview" 
                        className="image-preview"
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop";
                          e.target.style.border = "2px solid #ef4444";
                        }} 
                      />
                      {formData.Imgpath && !formData.Imgpath.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i) && (
                        <p className="text-warning small mt-2 mb-0">
                          ⚠️ Warning: URL doesn't look like a direct image link. Make sure it ends with .jpg, .png, etc.
                        </p>
                      )}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Default Route</Form.Label>
                  <Form.Control type="text" name="route" value={formData.route} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Default Duration</Form.Label>
                  <Form.Control type="text" name="exposure" value={formData.exposure} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            <h5 className="mb-3 fw-bold text-primary">Travel Options (Variants)</h5>
            <p className="text-muted small">Add specific details for different travel modes (e.g., Flight vs Train) or joining cities.</p>

            <Card className="bg-light border-0 p-3 mb-3">
              <Row className="g-2">
                <Col md={3}>
                  <Form.Control type="text" placeholder="Source City" name="source_city" value={newVariant.source_city} onChange={handleVariantChange} />
                </Col>
                <Col md={2}>
                  <Form.Select name="travel_mode" value={newVariant.travel_mode} onChange={handleVariantChange}>
                    <option value="Flight">Flight</option>
                    <option value="Train">Train</option>
                    <option value="Bus">Bus</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Control type="number" placeholder="Price" name="price" value={newVariant.price} onChange={handleVariantChange} />
                </Col>
                <Col md={3}>
                  <Form.Control type="text" placeholder="Duration (e.g. 2h 30m)" name="duration" value={newVariant.duration} onChange={handleVariantChange} />
                </Col>
                <Col md={2}>
                  <Button variant="outline-primary" className="w-100" onClick={addVariant}>Add</Button>
                </Col>
                <Col md={12} className="mt-2">
                  <Form.Control type="text" placeholder="Route Description (Optional)" name="route_description" value={newVariant.route_description} onChange={handleVariantChange} />
                </Col>
              </Row>
            </Card>

            {variants.length > 0 && (
              <Table striped bordered hover size="sm" className="mt-3">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Mode</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, index) => (
                    <tr key={index}>
                      <td>{v.source_city}</td>
                      <td>{v.travel_mode}</td>
                      <td>₹{v.price}</td>
                      <td>{v.duration}</td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => removeVariant(index)}>Remove</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            <div className="text-center mt-4">
              <Button variant="primary" type="submit" className="px-5 submit-destination-button">
                {isEditMode ? "Update Destination" : "Add Destination"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      </Container>
    </div>
  );
}
