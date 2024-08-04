import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { createDeliveryDriverProfile } from "../../utils/foodshare";

const CreateDriverProfile = ({ fetchDriverProfile }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vehicle, setVehicle] = useState("");

  const handlePublishProfile = async () => {
    try {
      const driver = {
        name,
        email,
        phoneNumber,
        vehicle: { [vehicle]: vehicle }, // Adjust for variant format
      };
      await createDeliveryDriverProfile(driver).then((res) => {
        console.log(res);
        fetchDriverProfile();
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Container className="mt-4">
        <h1>Create Driver Profile</h1>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Vehicle Type</Form.Label>
            <Form.Control
              as="select"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
            >
              <option value="">Select Vehicle Type</option>
              <option value="Car">Car</option>
              <option value="Van">Van</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Bicycle">Bicycle</option>
              <option value="Truck">Truck</option>
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" onClick={handlePublishProfile}>
            Publish Profile
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default CreateDriverProfile;
