import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";

const PayDriverButton = ({ pay }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const triggerPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      await pay();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={triggerPayment}
        variant="dark"
        style={{ backgroundColor: "#FFA500", borderRadius: "20px" }}
        disabled={loading}
      >
        {loading ? <Spinner animation="border" size="sm" /> : "Pay Driver"}
      </Button>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </>
  );
};

export default PayDriverButton;
