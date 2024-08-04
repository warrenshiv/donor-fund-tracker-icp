import React from "react";
import AcceptAssignment from "./AcceptAssignment";

const AssignmentCard = ({ assignment, driverId }) => {
  const {
    assignmentId,
    contractId,
    receiverId,
    status,
    pickupLocation,
    deliveryLocation,
    wages,
  } = assignment;

  // Function to extract and format the status message
  const getStatusMessage = (statusObj) => {
    // Extract keys from the status object
    const keys = Object.keys(statusObj);
    // Check if there are any keys, and return the first key's key and value
    if (keys.length > 0) {
      const key = keys[0];
      return { key, value: statusObj[key] };
    }
  };

  // Call getStatusMessage to get the appropriate status display
  const displayStatus = getStatusMessage(status);

  // Ensure wages is handled as BigInt and convert properly
  const wagesReceivable = wages / BigInt(10 ** 8);

  return (
    <>
      <tr>
        <td>{assignmentId}</td>
        <td>{contractId}</td>
        <td>{deliveryLocation}</td>
        <td>{receiverId}</td>
        <td>{pickupLocation}</td>
        <td>
          {displayStatus ? `${displayStatus.key}: ${displayStatus.value}` : ""}
        </td>
        <td>{wagesReceivable.toString()} ICP</td>
        <td>
          <AcceptAssignment driverId={driverId} assignmentId={assignmentId} />
        </td>
      </tr>
    </>
  );
};

export default AssignmentCard;
