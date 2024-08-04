import React from 'react'
import { Button } from "react-bootstrap";

const PayDriver = ({ pay }) => {

    const triggerPay = async () => {
        await pay();
    }

    return (
        <Button
            onClick={triggerPay}
            variant="dark"
            style={{ backgroundColor: "#FFA500", borderRadius: "20px"}}
        >
            Pay Driver
        </Button>
    )
}

export default PayDriver