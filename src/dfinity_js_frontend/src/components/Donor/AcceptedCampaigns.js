import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PayDonationButton from "../../components/Donor/PayDonation";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { payDonation } from "../../utils/donorFund";

const AcceptedCampaigns = ({ donorId, acceptedCampaign }) => {
  const {
    id: campaignId,
    charityId,
    title,
    description,
    targetAmount,
    totalReceived,
    donors,
    startedAt,
    status,
  } = acceptedCampaign;

  const [showModal, setShowModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Display campaign status
  const displayStatus = (status) => {
    if (status && typeof status === "object") {
      return `${Object.keys(status)[0]}: ${Object.values(status)[0]}`;
    } else {
      return "Status Unavailable";
    }
  };

  const formatNumber = (number) => number.toLocaleString();
  const formatDateTime = (dateTimeString) => new Date(dateTimeString).toLocaleString();

  // Handle donation with modal input
  const handleDonate = async () => {
    const amountS = BigInt(parseInt(donationAmount, 10) * 10 ** 8);

    if (!amountS || amountS <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }

    setIsProcessing(true);

    try {
      await payDonation({ donorId, campaignId, charityId, amountS }).then((res) => {
        console.log("Donation successful: ", res);
        toast.success("Donation successful!");
      });
    } catch (err) {
      console.error("Check if wallet is funded", err);
      toast.error("Payment failed. Please check if the wallet is funded.");
    } finally {
      setIsProcessing(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <tbody>
        <tr>
          <td>{campaignId}</td>
          <td>{charityId}</td>
          <td>{title}</td>
          <td>{description}</td>
          <td>{formatNumber(targetAmount)} ICP</td>
          <td>{formatNumber(totalReceived)} ICP</td>
          <td>{donors.length}</td>
          <td>{displayStatus(status)}</td>
          <td>{formatDateTime(startedAt)}</td>
          <td>
            <PayDonationButton donate={() => setShowModal(true)} />
          </td>
        </tr>
      </tbody>

      {/* Donation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>💰 Enter Donation Amount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Amount to Donate (in tokens):</Form.Label>
              <Form.Control
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Enter donation amount"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleDonate} disabled={isProcessing}>
            {isProcessing ? <Spinner animation="border" size="sm" /> : "Donate"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AcceptedCampaigns;
