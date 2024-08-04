import React, { useState } from "react";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddAssignmentPost = ({ save, receiverId }) => {
  const [contractId, setContractId] = useState("");
  const [wages, setWages] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [show, setShow] = useState(false);

  const isFormFilled = () => {
    return wages && pickupLocation && deliveryLocation;
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isFormFilled()) {
      save({
        wages,
        pickupLocation,
        deliveryLocation,
        receiverId,
        contractId,
      });
      handleClose();
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} style={{ margin: "10px" }}>
        Add Assignment Post
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Assignment Post</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <FloatingLabel
              controlId="inputContractId"
              label="ContractId"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="ContractId"
                value={contractId}
                onChange={(e) => setContractId(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputWages"
              label="Wages"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="Wages"
                value={wages}
                onChange={(e) => setWages(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputPickupLocation"
              label="Pickup Location"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Pickup Location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDeliveryLocation"
              label="Delivery Location"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Delivery Location"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
              />
            </FloatingLabel>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddAssignmentPost;
