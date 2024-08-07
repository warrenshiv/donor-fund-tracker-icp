import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyDonations = ({ donations }) => {
  const {
    donorId,
    charityId,
    campaignId,
    amount,
    status,
    createdAt,
  } = donations;

  // Helper function to display the status of a campaign
  const displayStatus = (status) => {
    if (status && typeof status === "object") {
      return `${Object.keys(status)[0]}: ${Object.values(status)[0]}`;
    } else {
      return "Status Unavailable"; // Default value if status is not an object
    }
  };

  // Helper function to format numbers with commas
  const formatNumber = (number) => {
    return number.toLocaleString(); // Formats number with locale-specific separators
  };

  // Function to format date and time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString(); // Formats date and time based on user's locale
  };

  return (
    <tbody>
      <tr>
        <td>{donorId}</td>
        <td>{campaignId}</td>
        <td>{charityId}</td>
        <td>{formatNumber(amount)}</td>
        <td>{formatDateTime(createdAt)}</td>
        <td>{displayStatus(status)}</td>
      </tr>
    </tbody>
  );
};

export default MyDonations;
