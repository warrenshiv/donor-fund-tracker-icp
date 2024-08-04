import React, { useCallback, useEffect, useState } from "react";
import { getDeliveryDriverProfileByOwner } from "../../utils/foodshare";
import { Notification } from "../../components/utils/Notifications";
import Wallet from "../../components/Wallet";
import DriverDashboard from "./DriverDashboard";
import CreateDriverProfile from "../../components/Driver/CreateDriverProfile";
import Loader from "../../components/utils/Loader";
import Cover from "../../components/utils/Cover";
import { login } from "../../utils/auth";
import { Nav } from "react-bootstrap";

const Driver = () => {
  const [driver, setDriver] = useState({});
  const [loading, setLoading] = useState(false);

  const isAuthenticated = window.auth.isAuthenticated;

  const fetchDriverProfile = useCallback(async () => {
    try {
      setLoading(true);
      setDriver(
        await getDeliveryDriverProfileByOwner().then(async (res) => {
          console.log(res);
          return res.Ok;
        })
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        !loading ? (
          driver?.name ? (
            <>
              <Nav className="justify-content-end pt-3 pb-5">
                <Nav.Item>
                  <Wallet />
                </Nav.Item>
              </Nav>
              <main>
                <DriverDashboard driver={driver} />
              </main>
            </>
          ) : (
            <CreateDriverProfile fetchDriverProfile={fetchDriverProfile} />
          )
        ) : (
          <Loader />
        )
      ) : (
        <Cover login={login}/>
      )}
    </>
  );
};

export default Driver;
