// components/PayDonationButton.js

import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap"; // Import Bootstrap components

const PayDonationButton = ({ donate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const triggerPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      await donate(); // Trigger the donate function passed as a prop
    } catch (err) {
      setError(err.message); // Capture and set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <Button
        variant="dark"
        onClick={triggerPayment}
        disabled={loading}
        style={{ backgroundColor: "#FFA500", borderRadius: "20px" }}
      >
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span> {/* Accessibility text */}
          </Spinner>
        ) : (
          "Donate" // Button label when not loading
        )}
      </Button>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>} {/* Display error if present */}
    </>
  );
};

export default PayDonationButton; // Export component
