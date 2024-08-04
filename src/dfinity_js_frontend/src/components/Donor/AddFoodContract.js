import React, { useState } from "react";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddFoodContract = ({ save, postId, donorId }) => {
  const [show, setShow] = useState(false);
  const [agreedQuantity, setAgreedQuantity] = useState(0);
  const [location, setLocation] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = () => {
    // Ensure agreedQuantity is passed as a number, specifically as a JavaScript integer
    save({ agreedQuantity: parseInt(agreedQuantity, 10), location, postId, donorId });
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        style={{ backgroundColor: "#FFA500", borderRadius: "20px" }}
      >
        Add Contract
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Contract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FloatingLabel controlId="floatingInput" label="Agreed Quantity">
              <Form.Control
                type="number"
                placeholder="Agreed Quantity"
                value={agreedQuantity}
                onChange={(e) => setAgreedQuantity(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="Location">
              <Form.Control
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddFoodContract;
