import React from "react";
import MarkAssignmentDelivered from "./MarkAssignmentDelivered";

const IntransitAssignments = ({ assignment, getAssignments }) => {
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

  return (
    <>
      <tbody>
        <tr>
          <td>{assignmentId}</td>
          <td>{contractId}</td>
          <td>{receiverId}</td>
          <td>{driverId}</td>
          <td>{wages !== undefined ? wages.toString() : "N/A"}</td>
          <td>{displayStatus(status)}</td>
          <td>{pickupLocation}</td>
          <td>{deliveryLocation}</td>
          <td>
            <MarkAssignmentDelivered
              assignmentId={assignmentId}
              receiverId={receiverId}
            />
          </td>
        </tr>
      </tbody>
    </>
  );
};

export default IntransitAssignments;