import React, { useEffect } from "react";

const CompletedContracts = ({ completeContract, getCompletedContracts }) => {
  const {
    contractId,
    receiverId,
    donorId,
    postId,
    agreedQuantity,
    expiryDate,
    location,
    status,
  } = completeContract;

  // Function to extract the status message from the status object
  const getStatusMessage = (statusObject) => {
    // If status is an object and has keys, return the value of the first key
    if (statusObject && typeof statusObject === "object") {
      const key = Object.keys(statusObject)[0]; // Get the first key from the object
      return statusObject[key];
    }
  };
  
  return (
    <>
      <tbody>
        <tr>
          <td>{contractId}</td>
          <td>{postId}</td>
          <td>{donorId}</td>
          <td>{receiverId}</td>
          <td>{agreedQuantity.toString()}</td>
          <td>{getStatusMessage(status)}</td>
        </tr>
      </tbody>
    </>
  );
};

export default CompletedContracts;
