import React, { useCallback, useEffect, useState } from "react";
import { getReceiverProfileByOwner } from "../../utils/foodshare";
import { Notification } from "../../components/utils/Notifications";
import Wallet from "../../components/Wallet";
import ReceiverDashboard from "./ReceiverDashboard";
import CreateReceiverProfile from '../../components/receiver/CreateReceiverProfile';
import Loader from "../../components/utils/Loader";
import Cover from "../../components/utils/Cover";
import { login } from "../../utils/auth";
import { Nav } from "react-bootstrap";

const Receiver = () => {
  const [receiver, setReceiver] = useState({});
  const [loading, setLoading] = useState(false);

  const isAuthenticated = window.auth.isAuthenticated;

  const fetchReceiverProfile = useCallback(async () => {
    try {
      setLoading(true);
      setReceiver(
        await getReceiverProfileByOwner().then(async (res) => {
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
    fetchReceiverProfile();
  }, []);

  return (
    <>
    <Notification />
    {isAuthenticated ? (
        !loading ? (
            receiver?.name ? (
                <>
                <Nav className="justify-content-end pt-3 pb-5">
                    <Nav.Item>
                        <Wallet />
                    </Nav.Item>
                </Nav>
                <main>
                    <ReceiverDashboard receiver={receiver} />
                </main>
                </>
            ) : (
                <CreateReceiverProfile 
                fetchReceiverProfile={fetchReceiverProfile}
                />
            )
        ) : (
            <Loader />
        )
    ) : (
        <Cover login={login} />

    )}
    </>
  )

};

export default Receiver
