import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { getCampaignById } from "../../utils/donorFund"; // Removed makeDonation

// AcceptCampaign component
const AcceptCampaign = ({ campaignId }) => { // Removed donorId
  const [campaign, setCampaign] = useState({});
  const { title, description, targetAmount, totalReceived } = campaign; // Removed charityId
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch campaign details using the campaign ID
  const fetchCampaignDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCampaignById(campaignId);
      if (response.Ok) {
        console.log("Campaign details fetched:", response.Ok);
        setCampaign(response.Ok);
      } else if (response.Err) {
        console.error("Error fetching campaign:", response.Err);
        // Optionally handle error state
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      setLoading(false);
    }
  }, [campaignId]);

  // Handle modal visibility
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchCampaignDetails();
  }, [campaignId, fetchCampaignDetails]);

  return (
    <>
      <Button
        variant="primary"
        size="sm" // Set the button size to small
        onClick={handleShow}
        disabled={loading || campaign.status?.Accepted}
      >
        View Campaign
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Campaign Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Title: {title}</p>
          <p>Description: {description}</p>
          <p>Target Amount: {targetAmount?.toLocaleString()}</p>
          <p>Total Received: {totalReceived?.toLocaleString()}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Close
          </Button>
          {/* Removed Make Donation button */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AcceptCampaign;
