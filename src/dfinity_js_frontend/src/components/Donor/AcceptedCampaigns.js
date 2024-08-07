import React from "react"; // Import React
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast for notifications
import "react-toastify/dist/ReactToastify.css"; // Import React Toastify CSS
import PayDonationButton from "../../components/Donor/MakeDonation"; // Import the PayDonationButton component
import { payDonation } from "../../utils/donorFund"; 

const AcceptedCampaigns = ({ acceptedCampaign, donor }) => {
  // Destructure properties from acceptedCampaign
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

  // Handle donation payment
  const handleDonate = async () => {
    const donationDetails = {
      donorId: donor.id,
      charityId,
      campaignId: id,
      amount: 1000n, // Example amount; adjust as needed
    };

    console.log("Donation Details:", donationDetails);

    try {
      // Log initial donation details for debugging
      console.log("Initiating donation for campaign:", donationDetails);

      // Call payDonation with the necessary donation details
      const donationResult = await payDonation(donationDetails);

      // Log the response from the donation process
      console.log("Donation result:", donationResult);

      // Check if the donation was successful
      if (donationResult) {
        toast.success("Donation successful!"); // Display success toast
      } else {
        throw new Error("Donation process completed with failure.");
      }
    } catch (error) {
      // Log error message for debugging
      console.error("Donation failed. Error:", error.message);
      toast.error("Donation failed. Please check if the wallet is funded."); // Display error toast
    }
  };

  return (
    <>
      <ToastContainer /> {/* Toast container for displaying notifications */}
      <tbody>
        <tr>
          <td>{id}</td> {/* Display campaign ID */}
          <td>{charityId}</td> {/* Display charity ID */}
          <td>{title}</td> {/* Display campaign title */}
          <td>{description}</td> {/* Display campaign description */}
          <td>{formatNumber(targetAmount)}</td> {/* Display formatted target amount */}
          <td>{formatNumber(totalReceived)}</td> {/* Display formatted total received amount */}
          <td>{donors.length}</td> {/* Display the number of donors */}
          <td>{displayStatus(status)}</td> {/* Display formatted campaign status */}
          <td>{formatDateTime(startedAt)}</td> {/* Display formatted start date and time */}
          <td>
            <PayDonationButton donate={handleDonate} /> {/* Integrate the donation button */}
          </td>
        </tr>
      </tbody>
    </>
  );
};

export default AcceptedCampaigns; // Export the component as default
