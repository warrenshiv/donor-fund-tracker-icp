import React, { useState } from "react";
import { updateLogisticsDecision } from "../../utils/foodshare";

const LogisticsDecision = ({ contractId }) => {
  const [logistics, setLogistics] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogisticsDecision = async (decision) => {
    setLoading(true);
    try {
      const payload = { contractId, logistics: decision };
      const result = await updateLogisticsDecision(payload);
      if (result.Ok) {
        alert("Logistics decision updated successfully");
      } else {
        alert(`Error: ${result.Err}`);
      }
    } catch (error) {
      console.error("Failed to update logistics decision:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h5>Logistics Decision</h5>
      <button onClick={() => handleLogisticsDecision(true)} disabled={loading}>
        Yes, I want logistics
      </button>
      <button onClick={() => handleLogisticsDecision(false)} disabled={loading}>
        No, I don't want logistics
      </button>
    </div>
  );
};

export default LogisticsDecision;
