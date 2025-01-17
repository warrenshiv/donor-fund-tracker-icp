import React, { useCallback, useEffect, useState } from "react";
import { Dropdown, Stack } from "react-bootstrap";
import { logout as destroy } from "../utils/auth";
import { balance as principalBalance } from "../utils/ledger";
import { getAddressFromPrincipal } from "../utils/donorFund";

const Wallet = () => {
  const isAuthenticated = window.auth.isAuthenticated;

  const principal = window.auth.principalText;

  const symbol = "ICP";

  const [balance, setBalance] = useState("0");
  const [address, setAddress] = useState("");

  const getBalance = useCallback(async () => {
    if (isAuthenticated) {
      setBalance(await principalBalance());
    }
  });

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  // Get the address of the investor
  useEffect(() => {
    const getAddress = async () => {
      if (isAuthenticated && principal) {
        try {
          const address = await getAddressFromPrincipal(principal);
          setAddress(address);
        } catch (error) {
          console.error("Error getting address:", error);
        }
      }
    };
    getAddress();
  }, [isAuthenticated, principal]);

  if (isAuthenticated) {
    return (
      <>
        <Dropdown>
          <Dropdown.Toggle
            variant="light"
            align="end"
            id="dropdown-basic"
            className="d-flex align-items-center border rounded-pill py-1"
          >
            {balance} <span className="ms-1"> {symbol}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="shadow-lg border-0">
            <Dropdown.Item>
              <Stack direction="horizontal" gap={2}>
                <i className="bi bi-person-circle fs-4" />
                <span className="font-monospace">{address}</span>
              </Stack>
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item
              as="button"
              className="d-flex align-items-center"
              onClick={() => {
                destroy();
              }}
            >
              <i className="bi bi-box-arrow-right me-2 fs-4" />
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }

  return null;
};

export default Wallet;
