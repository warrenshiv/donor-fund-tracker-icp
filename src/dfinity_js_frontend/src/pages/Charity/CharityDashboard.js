import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Nav, Table } from "react-bootstrap";
import {
  getAllCampaigns,
  getDonorCampaigns,
  createCampaign,
} from "../../utils/donorFund";
import CurrrentCampaigns from "../../components/Charity/CurrrentCampaigns";
import AcceptedCampaigns from "../../components/Charity/AcceptedCampaigns";
import AddCampaign from "../../components/Charity/AddCampaign";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// CharityDashboard component
const CharityDashboard = ({ charity }) => {
  const {
    id,
    donorId, // Ensure donorId is part of the charity object
    name,
    email,
    phoneNumber,
    address,
    donationAmount,
    donationsCount,
  } = charity;

  // Log the charity object to see its structure
  console.log("Charity object:", charity);

  const [campaigns, setCampaigns] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [selectedTab, setSelectedTab] = useState("current");

  const handleMouseEnter = (tab) => {
    setHoveredTab(tab);
  };

  const handleMouseLeave = () => {
    setHoveredTab(null);
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const CampaignPost = async (data) => {
    try {
      const response = await createCampaign(data);
      if (response.Ok) {
        console.log("Campaign created successfully");
        fetchCampaigns();
        toast.success("Campaign created successfully!");
      } else {
        console.error("Failed to create campaign", response);
        toast.error("Failed to create campaign.");
      }
    } catch (error) {
      console.error("Failed to create campaign", error);
      toast.error("Error creating campaign.");
    }
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

  const fetchDonorCampaigns = async () => {
    try {
      console.log("Fetching campaigns for donorId:", donorId); // Debugging
      if (!donorId) {
        throw new Error("donorId is undefined or null");
      }
      const response = await getDonorCampaigns(donorId); // Pass donorId here
      console.log("Charity Campaigns Response:", response); // Verify response
      if (response.Ok && Array.isArray(response.Ok)) {
        setAcceptedDonations(response.Ok);
      } else {
        console.error("Expected an array but received:", response);
        setAcceptedDonations([]);
      }
    } catch (error) {
      console.error("Failed to fetch donor campaigns", error);
      setAcceptedDonations([]);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchDonorCampaigns();
  }, [donorId]);

  // Dynamic styling function for nav links
  const navLinkStyle = (tab) => ({
    color: selectedTab === tab || hoveredTab === tab ? "#ffffff" : "black",
    backgroundColor:
      selectedTab === tab || hoveredTab === tab ? "#007bff" : "grey",
  });

  return (
    <div className="mx-5">
      <Container className="mt-2">
        <h1>Charity Dashboard</h1>
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
          <Col className="flex-1">
            <AddCampaign save={CampaignPost} charityId={id} />
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
                onMouseEnter={() => handleMouseEnter("current")}
                onMouseLeave={handleMouseLeave}
                style={navLinkStyle("current")}
              >
                Current Campaigns
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-3">
              <Nav.Link
                onClick={() => handleTabClick("acceptedCampaigns")}
                active={selectedTab === "acceptedCampaigns"}
                onMouseEnter={() => handleMouseEnter("acceptedCampaigns")}
                onMouseLeave={handleMouseLeave}
                style={navLinkStyle("acceptedCampaigns")}
              >
                Accepted Campaigns
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-3">
              <Nav.Link
                onClick={() => handleTabClick("all")}
                active={selectedTab === "all"}
                onMouseEnter={() => handleMouseEnter("all")}
                onMouseLeave={handleMouseLeave}
                style={navLinkStyle("all")}
              >
                All Donations
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-3">
              <Nav.Link
                onClick={() => handleTabClick("accepted")}
                active={selectedTab === "accepted"}
                onMouseEnter={() => handleMouseEnter("accepted")}
                onMouseLeave={handleMouseLeave}
                style={navLinkStyle("accepted")}
              >
                Accepted Donations
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-3">
              <Nav.Link
                onClick={() => handleTabClick("complete")}
                active={selectedTab === "complete"}
                onMouseEnter={() => handleMouseEnter("complete")}
                onMouseLeave={handleMouseLeave}
                style={navLinkStyle("complete")}
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
                </tr>
              </thead>

              {campaigns.map((_campaign, index) => {
                return (
                  <CurrrentCampaigns
                    key={index}
                    campaign={{ ..._campaign }}
                    charityId={id} // Pass charityId here
                    getAllCampaigns={fetchCampaigns}
                  />
                );
              })}
            </Table>
          )}

          {selectedTab === "acceptedCampaigns" && (
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
                </tr>
              </thead>
              {acceptedDonations.map((_campaign, index) => (
                <AcceptedCampaigns
                  key={index}
                  acceptedCampaign={{ ..._campaign }}
                  getDonorCampaigns={fetchDonorCampaigns}
                />
              ))}
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

export default CharityDashboard;