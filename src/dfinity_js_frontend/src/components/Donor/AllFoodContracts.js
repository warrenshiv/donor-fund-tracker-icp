import React from "react";

const AllFoodContracts = ({ contract, getContracts }) => {
  const {
    contractId,
    receiverId,
    postId,
    donorId,
    agreedQuantity,
    status,
  } = contract;

  // Helper function to display status
  const displayStatus = (status) => {
    return `${Object.keys(status)[0]}: ${Object.values(status)[0]}`;
  };

  return (
    <>
      <tbody>
        <tr>
          <td>{contractId}</td>
          <td>{postId}</td>
          <td>{receiverId}</td>
          <td>{donorId}</td>
          <td>{agreedQuantity.toString()}</td>
          <td>{displayStatus(status)}</td>
        </tr>
      </tbody>
    </>
  );
};

export default AllFoodContracts;
