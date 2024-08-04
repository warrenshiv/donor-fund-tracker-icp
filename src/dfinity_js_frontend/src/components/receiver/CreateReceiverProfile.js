import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { createReceiverProfile } from "../../utils/foodshare";

const CreateReceiverProfile = ({ fetchReceiverProfile }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [needs, setNeeds] = useState("");

  const handlePublishProfile = async () => {
    try {
      const receiver = {
        name,
        email,
        phoneNumber,
        address,
        needs,
      };
      await createReceiverProfile(receiver).then((res) => {
        console.log(res);
        fetchReceiverProfile();
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Container className="mt-4">
        <h1>Create Receiver Profile</h1>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              width={"50%"}
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
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Needs</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your needs"
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handlePublishProfile}>
            Publish Profile
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default CreateReceiverProfile;