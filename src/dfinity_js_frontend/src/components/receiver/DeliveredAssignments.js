import React from "react";
import PayDriverButton from "./PayDriver";
import { payDriver } from "../../utils/foodshare";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const DeliveredAssignments = ({ assignment, getAssignments }) => {
  const {
    assignmentId,
    contractId,
    receiverId,
    driverId,
    wages,
    status,
    pickupLocation,
    deliveryLocation,
  } = assignment;

  // Helper function to display status
  const displayStatus = (status) => {
    if (status && typeof status === "object") {
      return `${Object.keys(status)[0]}: ${Object.values(status)[0]}`;
    } else {
      return "Status Unavailable"; // Or any other default value you prefer
    }
  };

  // Ensure wages is handled as BigInt and convert properly
  const wagesReceivable = wages / BigInt(10**8);

  const id = assignmentId;
  const handlePayDriver = async () => {
    try {
      console.log("id", id);
      // Ensure id and other parameters are passed correctly
      await payDriver({ id }).then(async (res) => {
        console.log("res", res);
        toast.success("Payment successful!"); // Display success toast
        getAssignments();
      });
    } 
    catch (error) {
      console.log("Check if wallet is funded");
      toast.error("Payment failed. Please check if the wallet is funded."); // Display error toast
    }
  };
  
  return (
    <>
      <ToastContainer />
      <tbody>
        <tr>
          <td>{assignmentId}</td>
          <td>{contractId}</td>
          <td>{receiverId}</td>
          <td>{driverId}</td>
          <td>{wagesReceivable.toString()} ICP</td>
          <td>{displayStatus(status)}</td>
          <td>{pickupLocation}</td>
          <td>{deliveryLocation}</td>
          <td>
            <PayDriverButton pay={handlePayDriver} />
          </td>
        </tr>
      </tbody>
    </>
  );
};

export default DeliveredAssignments;
