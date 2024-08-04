import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

import { markDeliveryAssignmentDelivered } from "../../utils/foodshare";

const MarkAssignmentDelivered = ({ receiverId, assignmentId }) => {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    
    const handleMarkAssignmentDelivered = async () => {
        try {
        setLoading(true);
        const res = await markDeliveryAssignmentDelivered( receiverId, assignmentId );
        setLoading(false);
        console.log(res);
        if (res.Err) {
            alert(`Error: ${res.Err.Error}`); // Displaying error to the user
        } else {
            setShow(false); // Close modal on successful acceptance
            alert("Assignment marked as delivered successfully!");
        }
        } catch (error) {
        console.error(error);
        setLoading(false);
        alert("Failed to mark assignment as delivered due to an unexpected error.");
        }
    };
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    return (
        <>
        <Button variant="primary" onClick={handleShow}>
            Mark as Delivered
        </Button>
    
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Mark Assignment as Delivered</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <p>Are you sure you want to mark this assignment as delivered?</p>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleMarkAssignmentDelivered}>
                {loading ? "Loading..." : "Mark as Delivered"}
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
    };

export default MarkAssignmentDelivered;