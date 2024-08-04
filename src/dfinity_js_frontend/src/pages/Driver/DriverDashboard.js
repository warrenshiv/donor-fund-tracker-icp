import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Nav, Table, Tab } from "react-bootstrap";
import { getAllDeliveryAssignments } from "../../utils/foodshare";
import AssignmentCard from "../../components/Driver/AssignmentCard";

const DriverDashboard = ({ driver }) => {
  const { name, email, phoneNumber, vehicle } = driver;

  const [assignments, setAssignments] = useState([]);

  const fetchAssignments = async () => {
    try {
      let post = await getAllDeliveryAssignments();
      console.log(post);
      setAssignments(post);
    } catch (error) {
      console.log(error);
    }
  };

  //
  const displayVehicle = (vehicle) => {
    return Object.keys(vehicle)[0];
  };

  useEffect(() => {
    fetchAssignments();
  }, []);
  
  return (
    <div className="mx-5">
      <Container className="mt-2">
        <h1>Driver Dashboard</h1>
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
            <p>Phone Number: {phoneNumber}</p>
            <p>Vehicle Type: {displayVehicle(vehicle)}</p>
          </Col>
        </Row>
        <Row className="mx-2 my-4">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Assignment Id</th>
                <th>Contract Id</th>
                <th>Delivery Location</th>
                <th>Receiver Id</th>
                <th>Pickup Location</th>
                <th>Status</th>
                <th>Wages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((_assignment, index) => (
                <AssignmentCard
                  key={index}
                  assignment={{ ..._assignment }}
                  driverId={driver.driverId}
                />
              ))}
            </tbody>
          </Table>
        </Row>
      </Container>
    </div>
  );
};

export default DriverDashboard;
