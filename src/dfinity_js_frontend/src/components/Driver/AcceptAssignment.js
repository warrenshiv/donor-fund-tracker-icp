import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Card, Row, Col, Spinner } from "react-bootstrap";
import {
  getDeliveryAssignment,
  acceptDeliveryAssignment,
} from "../../utils/foodshare";

const AcceptAssignment = ({ assignmentId, driverId }) => {
  const [assignment, setAssignment] = useState({});
  const {
    contractId,
    receiverId,
    status,
    pickupLocation,
    deliveryLocation,
    wages,
  } = assignment;
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const fetchAssignmentDetails = useCallback(async () => {
    try {
      setLoading(true);
      await getDeliveryAssignment(assignmentId).then((res) => {
        if (res.Ok) {
          console.log("Assignment details fetched:", res.Ok);
          setAssignment(res.Ok);
        } else if (res.Err) {
          console.error("Error fetching assignment:", res.Err);
          // Optionally set an error state to display in the UI
        }
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching assignment details:", error);
      setLoading(false);
    }
  }, [assignmentId]);

  const handleAcceptAssignment = async () => {
    try {
      setLoading(true);
      const res = await acceptDeliveryAssignment(driverId, assignmentId);
      setLoading(false);
      console.log(res);
      if (res.Err) {
        alert(`Error: ${res.Err.Error}`); // Displaying error to the user
      } else {
        setShow(false); // Close modal on successful acceptance
        alert("Assignment accepted successfully!");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Failed to accept assignment due to an unexpected error.");
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [assignmentId, fetchAssignmentDetails]);

  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        disabled={!status || !status.Pending}
        style={{
          opacity: !status || !status.Pending ? 0.5 : 1,
          pointerEvents: !status || !status.Pending ? "none" : "auto",
        }}
      >
        Accept
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Accept Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Assignment ID:</strong> {assignmentId}
                    </p>
                    <p>
                      <strong>Contract ID:</strong> {contractId}
                    </p>
                    <p>
                      <strong>Receiver ID:</strong> {receiverId}
                    </p>
                  </Col>
                  <Col xs={12} md={6}>
                    <p>
                      <strong>Pickup Location:</strong> {pickupLocation}
                    </p>
                    <p>
                      <strong>Delivery Location:</strong> {deliveryLocation}
                    </p>
                    <p>
                      <strong>Wages:</strong> {wages?.toString()}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleAcceptAssignment}
            disabled={loading}
          >
            Accept Assignment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AcceptAssignment;
