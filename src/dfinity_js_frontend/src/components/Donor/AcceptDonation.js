import React, { useState, useEffect } from "react";
import { Button, Modal, Alert, Spinner } from "react-bootstrap";
import { acceptCampaign, getCampaignStatusForDonor } from "../../utils/donorFund";

const AcceptDonation = ({ campaignId, donorId }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);

  const fetchCampaignStatusForDonor = async () => {
    try {
      const response = await getCampaignStatusForDonor(campaignId, donorId);
      if (response.Ok && response.Ok.isAccepted) {
        setIsAccepted(true);
        localStorage.setItem(`campaign_${campaignId}_donor_${donorId}_accepted`, "true");
      }
    } catch (error) {
      console.error("Error fetching campaign status for donor:", error);
    }
  };

  useEffect(() => {
    if (campaignId && donorId) {
      // Check local storage first
      const accepted = localStorage.getItem(`campaign_${campaignId}_donor_${donorId}_accepted`);
      if (accepted === "true") {
        setIsAccepted(true);
      } else {
        fetchCampaignStatusForDonor();
      }
    }
  }, [campaignId, donorId]);

  const handleAcceptCampaign = async () => {
    if (!donorId || !campaignId) {
      console.error("Missing donorId or campaignId");
      setError("Unable to accept campaign: Missing donor or campaign information.");
      return;
    }

    console.log(`Attempting to accept campaign: donorId=${donorId}, campaignId=${campaignId}`);

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await acceptCampaign(donorId, campaignId);
      console.log("API Response:", response);

      if (response.Ok) {
        setSuccess("Campaign accepted successfully!");
        setIsAccepted(true);
        localStorage.setItem(`campaign_${campaignId}_donor_${donorId}_accepted`, "true");
      } else if (response.Err) {
        console.error("Error accepting campaign:", response.Err);
        setError(`Failed to accept campaign: ${response.Err.NotFound || response.Err.Error}`);
      }
    } catch (error) {
      console.error("Error accepting campaign:", error);
      setError("An error occurred while accepting the campaign.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleShow} disabled={isAccepted}>
        {loading ? <Spinner animation="border" size="sm" /> : isAccepted ? "Accepted" : "Accept"}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Acceptance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          Are you sure you want to accept this campaign?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={handleAcceptCampaign}
            disabled={loading || isAccepted}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Accept Campaign"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AcceptDonation;
