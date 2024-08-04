import React from "react";
import AcceptContract from "./AcceptContract";

const ContractsCard = ({ contract, receiverId }) => {
  const { contractId, postId, status, donorId, agreedQuantity } = contract;

  // Function to extract and format the status message
  const getStatusMessage = (statusObj) => {
    // Extract keys from the status object
    const keys = Object.keys(statusObj);
    // Check if there are any keys, and return the first key's value
    if (keys.length > 0) {
      return statusObj[keys[0]];
    }
  };

  // Call getStatusMessage to get the appropriate status display
  const displayStatus = getStatusMessage(status);

  return (
    <tbody>
      <tr>
        <td>{contractId}</td>
        <td>{postId}</td>
        <td>{displayStatus}</td>
        <td>{donorId}</td>
        <td>{agreedQuantity.toString()}</td>
        <td>
          <AcceptContract receiverId={receiverId} contractId={contractId} />
        </td>
      </tr>
    </tbody>
  );
};

export default ContractsCard;
