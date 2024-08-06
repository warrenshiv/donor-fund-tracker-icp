import React, { useState } from "react"; // Import useState for managing modal state
import { Button } from "react-bootstrap"; // Import Button for triggering the modal
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MakeDonationModal from "./MakeDonationModal"; // Ensure the path is correct

const AcceptedCampaigns = ({ acceptedCampaign, donor }) => {
  const {
    id,
    charityId,
    title,
    description,
    targetAmount,
    totalReceived,
    donors,
    startedAt,
    status,
  } = acceptedCampaign;

  const [show, setShow] = useState(false); // State to manage modal visibility

  // Helper function to display status
  const displayStatus = (status) => {
    return `${Object.keys(status)[0]}: ${Object.values(status)[0]}`;
  };

  // Helper function to format numbers with commas
  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  // Function to format date and time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString(); // This will format date and time based on user's locale
  };

  // Function to handle modal close
  const handleClose = () => setShow(false);

  // Function to handle modal open
  const handleShow = () => setShow(true);

  return (
    <>
      <ToastContainer />
      <tbody>
        <tr>
          <td>{id}</td>
          <td>{charityId}</td>
          <td>{title}</td>
          <td>{description}</td>
          <td>{formatNumber(targetAmount)}</td>
          <td>{formatNumber(totalReceived)}</td>
          <td>{donors.length}</td>
          <td>{displayStatus(status)}</td>
          <td>{formatDateTime(startedAt)}</td>
          <td>
            <Button variant="success" onClick={handleShow}>
              Donate
            </Button>
            <MakeDonationModal
              donor={donor}
              campaignId={id} 
              show={show}
              handleClose={handleClose}
            />
          </td>
        </tr>
      </tbody>
    </>
  );
};

export default AcceptedCampaigns;
