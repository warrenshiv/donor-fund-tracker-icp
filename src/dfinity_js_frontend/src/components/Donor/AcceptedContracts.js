import React from 'react'

const AcceptedContracts = ({acceptedContract, getAcceptedContracts }) => {
    const { contractId, postId, donorId, receiverId, agreedQuantity, status} = acceptedContract;
    
    // Function to extract the status message from the status object
    const getStatusMessage = (statusObject) => {
        // If status is an object and has keys, return the value of the first key
        if (statusObject && typeof statusObject === 'object') {
            const key = Object.keys(statusObject)[0]; // Get the first key from the object
            return statusObject[key]; 
        }
    }

    const fecthAcceptedContracts = async () => {
        try {
            getAcceptedContracts();
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <tbody>
            <tr>
                <td>{contractId}</td>
                <td>{postId}</td>
                <td>{donorId}</td>
                <td>{receiverId}</td>
                <td>{agreedQuantity.toString()}</td>
                <td>{getStatusMessage(status)}</td>
                {/* Uncomment below if you need a cancel button */}
                {/* <td>
                    <button onClick={fecthAcceptedContracts}>Cancel</button>
                </td> */}
            </tr>
        </tbody>
    )
}

export default AcceptedContracts;
