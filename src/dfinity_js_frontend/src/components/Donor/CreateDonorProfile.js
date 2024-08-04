import React, { useState } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { createDonorProfile } from "../../utils/foodshare";

const CreateDonorProfile = ({ fetchDonor }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [businessType, setBusinessType] = useState("");

    const handlePublishProfile = async (event) => {
        event.preventDefault();
        try {
            const donor = {
                name,
                email,
                phoneNumber,
                address,
                businessType: { [businessType]: businessType } // Adjust for variant format
            };
            await createDonorProfile(donor).then(res => {
                console.log(res);
                fetchDonor();
            });
        } catch (error) {
            console.log("Failed to create donor profile:", error);
        }
    };

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Create Donor Profile</h1>
            <Form onSubmit={handlePublishProfile}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="formName" className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="formPhoneNumber" className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Enter your phone number"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formAddress" className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your address"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="formBusinessType" className="mb-4">
                    <Form.Label>Business Type</Form.Label>
                    <Form.Control
                        as="select"
                        value={businessType}
                        onChange={e => setBusinessType(e.target.value)}
                    >
                        <option value="">Select Business Type</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Grocery">Grocery</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Other">Other</option>
                    </Form.Control>
                </Form.Group>
                <div className="text-center">
                    <Button variant="primary" type="submit">
                        Publish Profile
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default CreateDonorProfile;
