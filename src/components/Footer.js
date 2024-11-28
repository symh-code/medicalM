// src/components/Footer.js
import React from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';  // Usamos Bootstrap para el diseño
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';  // Importamos los iconos

const Footer = () => {
  return (
    <Navbar bg="dark" variant="dark" className="mt-5 pt-4 pb-4">
      <Container>
        <Row className="w-100">
          <Col md={4} className="text-center text-md-left mb-3 mb-md-0">
            <h5 className="text-white">Centro Médico</h5>
            <p className="text-white-50">
              Gestión de citas médicas en línea. Tu salud es nuestra prioridad.
            </p>
          </Col>

          <Col md={4} className="text-center mb-3 mb-md-0">
            <h6 className="text-white">Enlaces Rápidos</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="text-white-50 text-decoration-none">Acerca de</a>
              </li>
              <li>
                <a href="/contact" className="text-white-50 text-decoration-none">Contacto</a>
              </li>
              <li>
                <a href="/privacy" className="text-white-50 text-decoration-none">Política de Privacidad</a>
              </li>
              <li>
                <a href="/terms" className="text-white-50 text-decoration-none">Términos de Servicio</a>
              </li>
            </ul>
          </Col>

          <Col md={4} className="text-center">
            <h6 className="text-white">Síguenos</h6>
            <div className="d-flex justify-content-center">
              <a href="https://facebook.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={30} />
              </a>
              <a href="https://twitter.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
                <FaTwitter size={30} />
              </a>
              <a href="https://instagram.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={30} />
              </a>
              <a href="https://linkedin.com" className="text-white" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={30} />
              </a>
            </div>
          </Col>
        </Row>
        
        <Row className="mt-3 text-center">
          <Col>
            <p className="text-white-50 mb-0">
              © {new Date().getFullYear()} Centro Médico. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Footer;
