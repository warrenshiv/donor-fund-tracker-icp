import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Nav, Table } from "react-bootstrap";
import { getAllCampaigns } from "../../utils/donorFund";
import CurrrentCampaigns from "../../components/Donor/CurrrentCampaigns";

// DonorDashboard component
const DonorDashboard = ({ donor }) => {
  const {
    name,
    email,
    phoneNumber,
    address,
    donationAmount,
    donationsCount,
  } = donor;

  const [campaigns, setCampaigns] = useState([]);
  const [hover, setHover] = useState(false);
  const [selectedTab, setSelectedTab] = useState("current");

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const fetchCampaigns = async () => {
    try {
      const response = await getAllCampaigns();
      if (response.Ok && Array.isArray(response.Ok)) {
        setCampaigns(response.Ok); // Extract campaigns from Ok
      } else {
        console.error("Expected an array but received:", response);
        setCampaigns([]); // Set an empty array if the response is not as expected
      }
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
      setCampaigns([]); // Handle fetch failure gracefully
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="mx-5">
      <Container className="mt-2">
        <h1>Donor Dashboard</h1>
        <Row
          className="d-flex justify-content-center align-items-center p-2"
          style={{
            backgroundColor: "gray",
            borderRadius: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Col className="flex-1">
            <Image
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
              alt="avatar"
              className="rounded-circle"
              style={{ width: "150px" }}
            />
          </Col>
          <Col className="flex-1">
            <h3>{name}</h3>
            <p>Email: {email}</p>
            <p>Phone: {phoneNumber}</p>
            <p>Address: {address}</p>
            <p>Donation Amount: {donationAmount}</p>
            <p>Donations Count: {donationsCount}</p>
          </Col>
        </Row>

        <Container fluid className="mt-3">
          <Nav
            variant="pills"
            defaultActiveKey="#current"
            className="justify-content-center"
          >
            <Nav.Item className="mx-3">
              <Nav.Link
                onClick={() => handleTabClick("current")}
                active={selectedTab === "current"}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={
                  selectedTab === "current"
                    ? { color: "#ffffff", backgroundColor: "#007bff" }
                    : { color: "black", backgroundColor: "grey" }
                }
              >
                Current Campaigns
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-3">
              <Nav.Link
                onClick={() => handleTabClick("all")}
                active={selectedTab === "all"}
                style={
                  selectedTab === "all"
                    ? { color: "#ffffff", backgroundColor: "#007bff" }
                    : { color: "black", backgroundColor: "grey" }
                }
              >
                All Donations
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-3">
              <Nav.Link
                onClick={() => handleTabClick("accepted")}
                active={selectedTab === "accepted"}
                style={
                  selectedTab === "accepted"
                    ? { color: "#ffffff", backgroundColor: "#007bff" }
                    : { color: "black", backgroundColor: "grey" }
                }
              >
                Accepted Donations
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-3">
              <Nav.Link
                onClick={() => handleTabClick("complete")}
                active={selectedTab === "complete"}
                style={
                  selectedTab === "complete"
                    ? { color: "#ffffff", backgroundColor: "#007bff" }
                    : { color: "black", backgroundColor: "grey" }
                }
              >
                Completed Donations
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
        <Row className="mx-2 my-4">
          {selectedTab === "current" && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>CampaignId</th>
                  <th>CharityId</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>TargetAmount</th>
                  <th>TotalReceived</th>
                  <th>Donors</th>
                  <th>Status</th>
                  <th>StartedAt</th>
                  <th>Actions</th>
                </tr>
              </thead>

              {campaigns.map((_campaign, index) => {
                return (
                  <CurrrentCampaigns
                    key={index}
                    campaign={{ ..._campaign }}
                    getAllCampaigns={fetchCampaigns}
                  />
                );
              })}
            </Table>
          )}

          {selectedTab === "accepted" && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Donation Id</th>
                  <th>Charity</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>{/* Map through accepted donations here */}</tbody>
            </Table>
          )}

          {selectedTab === "complete" && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Donation Id</th>
                  <th>Charity</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>{/* Map through completed donations here */}</tbody>
            </Table>
          )}

          {selectedTab === "all" && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Donation Id</th>
                  <th>Charity</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>{/* Map through all donations here */}</tbody>
            </Table>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default DonorDashboard;
