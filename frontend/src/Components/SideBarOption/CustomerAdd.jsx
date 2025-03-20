import React, { useState } from "react";
import "../../css/sidebaroption/Addcustomer.css";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios"; 

import { BASEURL } from "../../Auth/Matcher";

const CustomerAdd = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phn: "",
    customer_email: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.customer_name)
      newErrors.customer_name = "Customer Name is required.";
    if (!formData.customer_phn || formData.customer_phn.length !== 10) {
      newErrors.customer_phn = "Phone number must be exactly 10 digits.";
    }
    if (
      !formData.customer_email ||
      !/\S+@\S+\.\S+/.test(formData.customer_email)
    ) {
      newErrors.customer_email = "Enter a valid email address.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    
    setLoading(true);
    try {
      
      const response = await axios.post(`${BASEURL}/customer/add-customer`, formData);

      
      if (response.status === 201) {
        setSuccess("Customer added successfully!");
        console.log("Customer Data:", formData);
      
        
        setFormData({
          customer_name: "",
          customer_phn: "",
          customer_email: "",
        });
      } else {
        setSuccess("");
        
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      setSuccess("");
      alert("An error occurred while adding the customer.");
    } finally {
      
      setLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: "50px" }}>
      <Row
        className="justify-content-center"
        style={{
          width: "420px",
        }}>
        <Col md={8}>
          <div className="form-container">
            <h3 className="mb-4">Add Customer</h3>
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="customerName" className="mb-3">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Customer Name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  isInvalid={!!errors.customer_name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.customer_name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="customerPhone" className="mb-3">
                <Form.Label>Customer Phone</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Phone Number"
                  name="customer_phn"
                  value={formData.customer_phn}
                  onChange={handleChange}
                  isInvalid={!!errors.customer_phn}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.customer_phn}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="customerEmail" className="mb-3">
                <Form.Label>Customer Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email Address"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  isInvalid={!!errors.customer_email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.customer_email}
                </Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                {loading ? "Adding Customer..." : "Add Customer"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerAdd;
