import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Importa la configuración de Firebase
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; // Para obtener el usuario autenticado
import { Card, Button, Row, Col, Form, Alert } from 'react-bootstrap'; // Bootstrap para mejorar la UI

const Dashboard = () => {
  const { user } = useAuth();  // Obtener el usuario autenticado
  const [citas, setCitas] = useState([]); // Estado para las citas del usuario
  const [citasDisponibles, setCitasDisponibles] = useState([]); // Estado para las citas disponibles
  const [especialidadFiltro, setEspecialidadFiltro] = useState(''); // Estado para la especialidad seleccionada
  const [error, setError] = useState(''); // Estado para manejar errores

  // Función para cargar las citas del usuario
  const fetchCitas = async () => {
    try {
      const q = query(
        collection(db, 'citaID'),
        where('UsuarioID', '==', user.uid) // Filtra por el ID del usuario autenticado
      );
      const querySnapshot = await getDocs(q);
      const citasData = [];
      querySnapshot.forEach((doc) => {
        citasData.push({ id: doc.id, ...doc.data() });  // Agrega el id del documento
      });
      setCitas(citasData);  // Establecer las citas en el estado
    } catch (error) {
      console.error('Error al obtener citas:', error);
    }
  };

  // Función para cargar las citas disponibles
  const fetchCitasDisponibles = async () => {
    try {
      const q = query(
        collection(db, 'citaID'),
        where('Disponibilidad', '==', true) // Filtra las citas disponibles
      );
      const querySnapshot = await getDocs(q);
      const citasDisponiblesData = [];
      querySnapshot.forEach((doc) => {
        citasDisponiblesData.push({ id: doc.id, ...doc.data() });
      });
      setCitasDisponibles(citasDisponiblesData); // Establecer las citas disponibles
    } catch (error) {
      console.error('Error al obtener citas disponibles:', error);
    }
  };

  // Llama a las funciones cuando el usuario se autentica o cambia
  useEffect(() => {
    if (user) {
      fetchCitas();         // Cargar citas del usuario
      fetchCitasDisponibles();  // Cargar citas disponibles
    }
  }, [user]);  // Se ejecuta cuando el usuario cambia

  // Filtrar citas disponibles por especialidad
  const citasDisponiblesFiltradas = especialidadFiltro
    ? citasDisponibles.filter(cita => cita.Especialidad === especialidadFiltro)
    : citasDisponibles;

  // Filtrar citas del usuario por especialidad
  const citasFiltradas = especialidadFiltro
    ? citas.filter(cita => cita.Especialidad === especialidadFiltro)
    : citas;

  const handleReservarCita = async (citaId) => {
    try {
      // Referencia al documento de la cita en Firestore
      const citaRef = doc(db, 'citaID', citaId);

      // Actualizar la cita en Firestore (cambiar Disponibilidad y asignar UsuarioID)
      await updateDoc(citaRef, {
        Disponibilidad: false, // Marcar como no disponible
        UsuarioID: user.uid,   // Asignar el UsuarioID del usuario autenticado
      });

      // Después de actualizar, recargar las citas disponibles y las del usuario
      fetchCitas();
      fetchCitasDisponibles();
      alert('Cita reservada exitosamente!');
    } catch (error) {
      console.error('Error al reservar la cita:', error);
      setError('Hubo un error al reservar la cita. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Mis Citas Médicas</h2>

      {/* Mostrar error si hay uno */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filtro por especialidad */}
      <div className="mb-4">
        <label htmlFor="especialidad" className="form-label">Filtrar por especialidad</label>
        <Form.Select
          id="especialidad"
          value={especialidadFiltro}
          onChange={(e) => setEspecialidadFiltro(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="Cardiologia">Cardiología</option>
          <option value="Pediatria">Pediatría</option>
          <option value="Dermatologia">Dermatología</option>
          {/* Agregar más especialidades según sea necesario */}
        </Form.Select>
      </div>

      {/* Mostrar las citas filtradas */}
      <h4>Mis Citas Reservadas</h4>
      {citasFiltradas.length > 0 ? (
        <Row>
          {citasFiltradas.map((cita) => (
            <Col md={4} key={cita.id} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{cita.Descripcion}</Card.Title>
                  <Card.Text>
                    <strong>Fecha:</strong> {cita.Fecha.toDate().toLocaleString()}
                  </Card.Text>
                  <Card.Text><strong>Médico:</strong> {cita.Medico}</Card.Text>
                  <Card.Text><strong>Especialidad:</strong> {cita.Especialidad}</Card.Text>
                  <Card.Text><strong>Disponibilidad:</strong> {cita.Disponibilidad ? 'Disponible' : 'No disponible'}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No tienes citas reservadas.</p>
      )}

      <hr />

      <h4>Citas Disponibles</h4>
      {/* Mostrar las citas disponibles filtradas */}
      {citasDisponiblesFiltradas.length > 0 ? (
        <Row>
          {citasDisponiblesFiltradas.map((cita) => (
            <Col md={4} key={cita.id} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{cita.Descripcion}</Card.Title>
                  <Card.Text>
                    <strong>Fecha:</strong> {cita.Fecha.toDate().toLocaleString()}
                  </Card.Text>
                  <Card.Text><strong>Médico:</strong> {cita.Medico}</Card.Text>
                  <Card.Text><strong>Especialidad:</strong> {cita.Especialidad}</Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => handleReservarCita(cita.id)}
                    className="w-100"
                  >
                    Reservar Cita
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No hay citas disponibles en este momento.</p>
      )}
    </div>
  );
};

export default Dashboard;
