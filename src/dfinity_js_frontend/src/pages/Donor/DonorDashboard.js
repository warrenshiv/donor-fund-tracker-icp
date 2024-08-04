import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Nav, Table } from "react-bootstrap";
import {
  acceptFoodContract,
  createFoodSurplusPost,
  getAcceptedFoodContracts,
  getAllFoodSurplusPosts,
  getCompletedFoodContracts,
  getAllFoodContracts,
} from "../../utils/foodshare";
import FoodSurplusPost from "../../components/Donor/FoodSupplyPost";
import AcceptedContracts from "../../components/Donor/AcceptedContracts";
import CompletedContracts from "../../components/Donor/CompletedContracts";
import AddFoodSurplusPost from "../../components/Donor/AddFoodSurplusPost";
import AllFoodContracts from "../../components/Donor/AllFoodContracts";

const DonorDashboard = ({ donor }) => {
  const { name, email, phoneNumber, address, businessType, donorId } = donor;

  const [foodSurplusPosts, setFoodSurplusPosts] = useState([]);
  const [acceptedContracts, setAcceptedContracts] = useState([]);
  const [completeContracts, setCompleteContracts] = useState([]);
  const [allContracts, setAllContracts] = useState([]);
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
    if (tab === "current") {
      fetchAllPosts();
    } else if (tab === "accepted") {
      fetchAcceptedContracts();
    } else if (tab === "complete") {
      fetchCompletedContracts();
    } else if (tab === "all") {
      fetchAllContracts();
    }
  };

  const fetchAllPosts = async () => {
    try {
      const posts = await getAllFoodSurplusPosts();
      const postsWithConvertedQuantities = posts.map((post) => ({
        ...post,
        quantity: post.quantity.toString(), // Convert quantity here
      }));
      setFoodSurplusPosts(postsWithConvertedQuantities);
    } catch (error) {
      console.error("Failed to fetch food surplus posts:", error);
    }
  };

  const fetchAcceptedContracts = async () => {
    try {
      const contracts = await getAcceptedFoodContracts();
      setAcceptedContracts(contracts);
      console.log("Accepted contracts", contracts);
    } catch (error) {
      console.error("Failed to fetch accepted contracts:", error);
    }
  };

  const fetchCompletedContracts = async () => {
    try {
      const contracts = await getCompletedFoodContracts();
      console.log("Completed contracts", contracts);
      setCompleteContracts(contracts);
    } catch (error) {
      console.error("Failed to fetch completed contracts:", error);
    }
  };

  const fetchAllContracts = async () => {
    try {
      const contracts = await getAllFoodContracts();
      console.log("All contracts", contracts);
      setAllContracts(contracts);
    } catch (error) {
      console.error("Failed to fetch all contracts:", error);
    }
  };

  const foodSurplusPost = async (data) => {
    try {
      const post = await createFoodSurplusPost(data);
      setFoodSurplusPosts([...foodSurplusPosts, post]);
    } catch (error) {
      console.error("Failed to create food surplus post:", error);
    }
  };

  const displayBusinessType = (businessType) => {
    return Object.keys(businessType).join(", ");
  };

  useEffect(() => {
    fetchAllPosts();
    fetchAcceptedContracts();
    fetchCompletedContracts();
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
            <p>Business Type: {displayBusinessType(businessType)}</p>
          </Col>
          <Col className="flex-1">
            <AddFoodSurplusPost save={foodSurplusPost} donorId={donorId} />
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
                Current Posts
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
                All Contracts
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
                Accepted Contracts
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
                Completed Contracts
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
        <Row className="mx-2 my-4">
          {selectedTab === "current" && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Food Type</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Location</th>
                  <th>Contract</th>
                </tr>
              </thead>
              {selectedTab === "current" &&
                foodSurplusPosts.map((_offerFood, index) => {
                  return (
                    <FoodSurplusPost
                      key={index}
                      offerFood={{ ..._offerFood }}
                      donorId={donor.donorId}
                      getAllFoodSurplusPosts={fetchAllPosts}
                    />
                  );
                })}
            </Table>
          )}

          {selectedTab === "accepted" && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Contract Id</th>
                  <th>Post Id</th>
                  <th>Donor Id</th>
                  <th>Receiver Id</th>
                  <th>agreedQuantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              {selectedTab === "accepted" &&
                acceptedContracts.map((_acceptedContract, index) => (
                  <AcceptedContracts
                    key={index}
                    acceptedContract={{ ..._acceptedContract }}
                    getAcceptedContracts={fetchAcceptedContracts}
                  />
                ))}
            </Table>
          )}

          {selectedTab === "complete" && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Contract Id</th>
                  <th>Post Id</th>
                  <th>Donor Id</th>
                  <th>Receiver Id</th>
                  <th>agreedQuantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              {selectedTab === "complete" &&
                completeContracts.map((_completeContract, index) => {
                  return (
                    <CompletedContracts
                      key={index}
                      completeContract={{ ..._completeContract }}
                      getCompletedContracts={fetchCompletedContracts}
                    />
                  );
                })}
            </Table>
          )}

          {selectedTab === "all" && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Contract Id</th>
                  <th>Post Id</th>
                  <th>Receiver Id</th>
                  <th>Donor Id</th>
                  <th>agreedQuantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              {selectedTab === "all" &&
                allContracts.map((_allContract, index) => {
                  return (
                    <AllFoodContracts
                      key={index}
                      contract={{ ..._allContract }}
                      getContracts={fetchAllContracts}
                    />
                  );
                })}
            </Table>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default DonorDashboard;
