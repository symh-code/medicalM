// src/pages/Contact.js
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setError('Todos los campos son obligatorios');
      setSuccess(false);
      return;
    }

    // Aquí deberías manejar el envío del mensaje (por ejemplo, usando una API de correo o Firebase)
    // Si el mensaje se envía correctamente:
    setError('');
    setSuccess(true);

    // Limpiar los campos del formulario
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6} className="mx-auto">
          <h2 className="text-center mb-4">Contacto</h2>

          {/* Mensaje de éxito o error */}
          {success && <Alert variant="success">¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Formulario de contacto */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduce tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Introduce tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMessage">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Escribe tu mensaje"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Enviar mensaje
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Datos de contacto adicionales */}
      <Row className="mt-5 text-center">
        <Col>
          <h4>O también puedes contactarnos a través de:</h4>
          <p><strong>Teléfono:</strong> +123 456 789</p>
          <p><strong>Dirección:</strong> Calle Ficticia 123, Ciudad, País</p>
          <p><strong>Correo electrónico:</strong> contacto@centromedico.com</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
