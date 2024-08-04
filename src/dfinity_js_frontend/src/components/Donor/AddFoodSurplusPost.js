import React, { useState } from "react";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddFoodSurplusPost = ({ save, donorId }) => {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [location, setLocation] = useState("");
  const [foodType, setFoodType] = useState("");
  const [show, setShow] = useState(false);

  const isFormFilled = () => {
    return description && quantity && expiryDate && location && foodType;
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isFormFilled()) {
      save({ description, quantity, expiryDate, location, foodType, donorId });
      handleClose();
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} style={{ margin: "10px" }}>
        Add Food Surplus Post
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title> New Food Surplus Post </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <FloatingLabel
              controlId="inputFoodType"
              label="Food Type"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Food Type"
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputQuantity"
              label="Quantity"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputExpiryDate"
              label="Expiry Date"
              className="mb-3"
            >
              <Form.Control
                type="date"
                placeholder="Expiry Date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputLocation"
              label="Location"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FloatingLabel>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary" disabled={!isFormFilled()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddFoodSurplusPost;
