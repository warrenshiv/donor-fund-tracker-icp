import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { getFoodContract, acceptFoodContract } from "../../utils/foodshare";

const AcceptContract = ({ contractId, receiverId }) => {
  const [contract, setContract] = useState({});
  const { postId, donorId, agreedQuantity } = contract;
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showLogistics, setShowLogistics] = useState(false);

  const fetchContractsDetails = useCallback(async () => {
    try {
      setLoading(true);
      await getFoodContract(contractId).then((res) => {
        if (res.Ok) {
          console.log("Contract details fetched:", res.Ok);
          setContract(res.Ok);
        } else if (res.Err) {
          console.error("Error fetching contract:", res.Err);
          // Optionally set an error state to display in the UI
        }
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contract details:", error);
      setLoading(false);
    }
  }, [contractId]);
  
  const handleAcceptContract = async () => {
    try {
      setLoading(true);
      const res = await acceptFoodContract(receiverId, contractId);
      console.log("Accept contract response:", res);
      setLoading(false);
      console.log(res);
      if (res.Err) {
        alert(`Error: ${res.Err.Error}`); // Displaying error to the user
      } else {
        setShow(false); // Close modal on successful acceptance
        setShowLogistics(true); // Show logistics modal on successful acceptance
        alert("Contract accepted successfully!");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Failed to accept contract due to an unexpected error.");
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLogisticsClose = () => setShowLogistics(false);

  useEffect(() => {
    fetchContractsDetails();
  }, [contractId, fetchContractsDetails]);

  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        disabled={loading || contract.status?.Accepted}
      >
        View Contract
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Contract Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Post Id: {postId}</p>
          <p>Donor Id: {donorId}</p>
          <p>
            Agreed Quantity:{" "}
            {contract.agreedQuantity
              ? contract.agreedQuantity.toString()
              : "N/A"}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleAcceptContract}
            disabled={loading || contract.status?.Accepted}
          >
            Accept Contract
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLogistics} onHide={handleLogisticsClose}>
        <Modal.Header closeButton>
          <Modal.Title>Logistics Decision</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you need logistics for this contract?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleLogisticsClose}
            disabled={loading}
          >
            No
          </Button>
          <Button
            variant="primary"
            onClick={handleLogisticsClose}
            disabled={loading}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AcceptContract;
