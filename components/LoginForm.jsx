import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useProjects } from '../Data/provider';

function LoginModal({ showModal, setShowModal }) {
    const { logIn } = useProjects(); 

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Both fields are required.");
      setSuccess(false);
    } else {
      setError("");
      setSuccess(true);

      // Simulate successful login
      console.log("User logged in:", formData);

      // Close the modal after success
      setTimeout(() => {
        setSuccess(false);
        setShowModal(false);
        logIn(formData)
      }, 500);
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {/*success && <Alert variant="success">Request sent successfully!</Alert>*/}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
