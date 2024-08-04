import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Nav, Table } from "react-bootstrap";
import {
  getAllFoodContracts,
  getAllDeliveryAssignments,
  createDeliveryAssignment,
  getDeliveredDeliveryAssignments,
  getCancelledDeliveryAssignments,
  getInTransitDeliveryAssignments,
  getPendingDeliveryAssignments,
} from "../../utils/foodshare";
import ContractsCard from "../../components/receiver/ContractsCard";
import AllAssignments from "../../components/receiver/AllAssignments";
import AddAssignmentPost from "../../components/receiver/AddAsignmentPost";
import DeliveredAssignments from "../../components/receiver/DeliveredAssignments";
import IntransitAssignments from "../../components/receiver/IntransitAssignments";
import PendingAssignments from "../../components/receiver/PendingAssignments";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReceiverDashboard = ({ receiver }) => {
  const { name, email, phoneNumber, address, needs, receiverId } = receiver;

  const [contracts, setContracts] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [deliveredAssignments, setDeliveredAssignments] = useState([]);
  const [inTransitAssignments, setInTransitAssignments] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [cancelledAssignments, setCancelledAssignments] = useState([]);
  const [hover, setHover] = useState(false);

  const [selectedTab, setSelectedTab] = useState("contracts");

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    if (tab === "allAssignments") {
      fetchAssignments();
    } else if (tab === "contracts") {
      fetchContracts();
    } else if (tab === "delivered") {
      fetchDeliveredAssignments();
    } else if (tab === "inTransit") {
      fetchInTransitAssignments();
    } else if (tab === "pending") {
      fetchPendingAssignments();
    } else if (tab === "cancelled") {
      fetchCancelledAssignments();
    }
  };

  const fetchContracts = async () => {
    try {
      setContracts(await getAllFoodContracts());
      console.log(contracts);
    } catch (error) {
      console.error("Error fetching contracts: ", error);
    }
  };

  const assignmentPost = async (data) => {
    try {
      const wagesString = data.wages;
      data.wages = parseInt(wagesString * 10 ** 8);
      const post = await createDeliveryAssignment(data);
      setAllAssignments([...allAssignments, post]);
      toast.success("Assignment posted successfully!");
      console.log("Assignment posted: ", post);
    } catch (error) {
      toast.error("Error posting assignment.");
      console.error("Error posting assignment: ", error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const assignments = await getAllDeliveryAssignments();
      setAllAssignments(assignments);
      console.log(allAssignments);
    } catch (error) {
      console.error("Error fetching assignments: ", error);
    }
  };

  const fetchDeliveredAssignments = async () => {
    try {
      const assignments = await getDeliveredDeliveryAssignments();
      setDeliveredAssignments(assignments);
      console.log(deliveredAssignments);
    } catch (error) {
      console.error("Error fetching delivered assignments: ", error);
    }
  };

  const fetchInTransitAssignments = async () => {
    try {
      const assignments = await getInTransitDeliveryAssignments();
      setInTransitAssignments(assignments);
      console.log(inTransitAssignments);
    } catch (error) {
      console.error("Error fetching in transit assignments: ", error);
    }
  };

  const fetchPendingAssignments = async () => {
    try {
      const assignments = await getPendingDeliveryAssignments();
      setPendingAssignments(assignments);
      console.log(pendingAssignments);
    } catch (error) {
      console.error("Error fetching pending assignments: ", error);
    }
  };

  const fetchCancelledAssignments = async () => {
    try {
      const assignments = await getCancelledDeliveryAssignments();
      setCancelledAssignments(assignments);
      console.log(cancelledAssignments);
    } catch (error) {
      console.error("Error fetching cancelled assignments: ", error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <div className="mx-5">
      <ToastContainer />
      <Container className="mt-2">
        <h1>Receiver Dashboard</h1>
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
            <p>Location: {address}</p>
            <p>Phone Number: {phoneNumber}</p>
            <p>Needs: {needs}</p>
          </Col>
          <Col className="flex-1">
            <AddAssignmentPost save={assignmentPost} receiverId={receiverId} />
          </Col>
        </Row>

        <Container fluid className="mt-3">
          <Nav
            variant="pills"
            defaultActiveKey="allAssignments"
            className="justify-content-center"
          >
            <Nav.Item className="mx-3">
              <Nav.Link
                onClick={() => handleTabClick("contracts")}
                active={selectedTab === "contracts"}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={
                  selectedTab === "contracts"
                    ? { color: "#ffffff", backgroundColor: "#007bff" }
                    : { color: "black", backgroundColor: "grey" }
                }
              >
                All Contracts
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-3">
              <Nav.Link
                onClick={() => handleTabClick("allAssignments")}
                active={selectedTab === "allAssignments"}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={
                  selectedTab === "allAssignments"
                    ? { color: "#ffffff", backgroundColor: "#007bff" }
                    : { color: "black", backgroundColor: "grey" }
                }
              >
                All Assignments
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-3">
              <Nav.Link
                onClick={() => handleTabClick("inTransit")}
                active={selectedTab === "inTransit"}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={
                  selectedTab === "inTransit"
                    ? { color: "#ffffff", backgroundColor: "#007bff" }
                    : { color: "black", backgroundColor: "grey" }
                }
              >
                In Transit Assignments
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-3">
              <Nav.Link
                onClick={() => handleTabClick("delivered")}
                active={selectedTab === "delivered"}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={
                  selectedTab === "delivered"
                    ? { color: "#ffffff", backgroundColor: "#007bff" }
                    : { color: "black", backgroundColor: "grey" }
                }
              >
                Delivered Assignments
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="mx-3">
              <Nav.Link
                onClick={() => handleTabClick("pending")}
                active={selectedTab === "pending"}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={
                  selectedTab === "pending"
                    ? { color: "#ffffff", backgroundColor: "#007bff" }
                    : { color: "black", backgroundColor: "grey" }
                }
              >
                Pending Assignments
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-3">
              <Nav.Link
                onClick={() => handleTabClick("cancelled")}
                active={selectedTab === "cancelled"}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={
                  selectedTab === "cancelled"
                    ? { color: "#ffffff", backgroundColor: "#007bff" }
                    : { color: "black", backgroundColor: "grey" }
                }
              >
                Cancelled Assignments
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>

        <Row className="mx-2 my-4">
          {selectedTab === "allAssignments" && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Assignment ID</th>
                  <th>Contract ID</th>
                  <th>Receiver ID</th>
                  <th>Driver ID</th>
                  <th>Wages</th>
                  <th>Status</th>
                  <th>Pickup Location</th>
                  <th>Delivery Location</th>
                </tr>
              </thead>

              {allAssignments.length > 0 &&
                allAssignments.map((assignment) => (
                  <AllAssignments key={assignment.id} assignment={assignment} />
                ))}
            </Table>
          )}

          {selectedTab === "contracts" && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Contract ID</th>
                  <th>Donor ID</th>
                  <th>Status</th>
                  <th>Donor ID</th>
                  <th>Agreed Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>

              {/* map contracts here use listing of assignmentId and receiverId */}
              {contracts.map((_contract, index) => (
                <ContractsCard
                  key={index}
                  contract={{ ..._contract }}
                  receiverId={receiver.receiverId}
                />
              ))}
            </Table>
          )}

          {selectedTab === "delivered" && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Assignment ID</th>
                  <th>Contract ID</th>
                  <th>Receiver ID</th>
                  <th>Driver ID</th>
                  <th>Wages</th>
                  <th>Status</th>
                  <th>Pickup Location</th>
                  <th>Delivery Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {deliveredAssignments.length > 0 &&
                deliveredAssignments.map((assignment, index) => (
                  <DeliveredAssignments
                    key={index}
                    assignment={{ ...assignment }}
                  />
                ))}
            </Table>
          )}

          {selectedTab === "inTransit" && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Assignment ID</th>
                  <th>Contract ID</th>
                  <th>Receiver ID</th>
                  <th>Driver ID</th>
                  <th>Wages</th>
                  <th>Status</th>
                  <th>Pickup Location</th>
                  <th>Delivery Location</th>
                  <th>Actions</th>
                </tr>
              </thead>

              {inTransitAssignments.length > 0 &&
                inTransitAssignments.map((assignment) => (
                  <IntransitAssignments
                    key={assignment.id}
                    assignment={assignment}
                  />
                ))}
            </Table>
          )}

          {selectedTab === "pending" && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Assignment ID</th>
                  <th>Contract ID</th>
                  <th>Receiver ID</th>
                  <th>Driver ID</th>
                  <th>Wages</th>
                  <th>Status</th>
                  <th>Pickup Location</th>
                  <th>Delivery Location</th>
                </tr>
              </thead>

              {pendingAssignments.length > 0 &&
                pendingAssignments.map((assignment) => (
                  <PendingAssignments
                    key={assignment.id}
                    assignment={assignment}
                  />
                ))}
            </Table>
          )}

          {selectedTab === "cancelled" && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Assignment ID</th>
                  <th>Contract ID</th>
                  <th>Receiver ID</th>
                  <th>Driver ID</th>
                  <th>Wages</th>
                  <th>Status</th>
                  <th>Pickup Location</th>
                  <th>Delivery Location</th>
                </tr>
              </thead>

              {cancelledAssignments.length > 0 &&
                cancelledAssignments.map((assignment) => (
                  <PendingAssignments
                    key={assignment.id}
                    assignment={assignment}
                  />
                ))}
            </Table>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default ReceiverDashboard;
