import React, { useState } from "react";
import { Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import { makeDonation } from "../../utils/donorFund"; // Ensure this import path is correct
import { toast } from "react-toastify";

const MakeDonationModal = ({ donor, campaignId, show, handleClose }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission for making a donation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the amount input
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid donation amount greater than zero.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the makeDonation function with donor, amount, and campaignId
      await makeDonation(donor, parseFloat(amount), campaignId);

      // Show success notification
      toast.success("Donation successful!");

      // Reset the form
      setAmount("");
      handleClose(); // Close the modal on success
    } catch (error) {
      // Detailed error handling
      console.error("Donation error details:", error);
      if (error.message.includes("network")) {
        setError("Network error: Please check your connection and try again.");
      } else if (error.message.includes("insufficient funds")) {
        setError("Insufficient funds: Please ensure you have enough balance.");
      } else if (error.message.includes("validation")) {
        setError("Validation error: Please check the donation details.");
      } else if (error.message.includes("server")) {
        setError("Server error: Please try again later or contact support.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Make a Donation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formDonationAmount">
              <Form.Label>Donation Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
            </Form.Group>
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="mt-3"
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Donate"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MakeDonationModal;
