import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  getDocs 
} from 'firebase/firestore';
import { Button, Table, Form, Modal } from 'react-bootstrap';

const AdminDashboard = () => {
  const [citas, setCitas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [newEspecialidad, setNewEspecialidad] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // Para editar citas o especialidades

  // Función para cargar citas desde Firestore
  const fetchCitas = async () => {
    const querySnapshot = await getDocs(collection(db, 'citas'));
    const citasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCitas(citasData);
  };

  // Función para cargar especialidades desde Firestore
  const fetchEspecialidades = async () => {
    const querySnapshot = await getDocs(collection(db, 'especialidades'));
    const especialidadesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEspecialidades(especialidadesData);
  };

  useEffect(() => {
    fetchCitas();
    fetchEspecialidades();
  }, []);

  // Agregar una nueva especialidad
  const handleAddEspecialidad = async () => {
    if (newEspecialidad.trim() === '') return;
    await addDoc(collection(db, 'especialidades'), { nombre: newEspecialidad });
    setNewEspecialidad('');
    fetchEspecialidades();
  };

  // Eliminar una especialidad
  const handleDeleteEspecialidad = async (id) => {
    await deleteDoc(doc(db, 'especialidades', id));
    fetchEspecialidades();
  };

  // Función para abrir el modal de edición
  const handleEditCita = (cita) => {
    setEditing(cita);
    setShowModal(true);
  };

  // Función para actualizar una cita
  const handleUpdateCita = async () => {
    const citaRef = doc(db, 'citas', editing.id);
    await updateDoc(citaRef, { ...editing });
    fetchCitas();
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h1>Panel de Administración</h1>

      {/* CRUD de Especialidades */}
      <section className="mt-5">
        <h2>Especialidades</h2>
        <Form className="d-flex my-3">
          <Form.Control 
            type="text" 
            placeholder="Nueva especialidad" 
            value={newEspecialidad} 
            onChange={(e) => setNewEspecialidad(e.target.value)} 
          />
          <Button variant="primary" onClick={handleAddEspecialidad} className="ms-2">Agregar</Button>
        </Form>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {especialidades.map((especialidad) => (
              <tr key={especialidad.id}>
                <td>{especialidad.nombre}</td>
                <td>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeleteEspecialidad(especialidad.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      {/* CRUD de Citas */}
      <section className="mt-5">
        <h2>Citas</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Especialidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id}>
                <td>{cita.descripcion}</td>
                <td>{new Date(cita.fecha.seconds * 1000).toLocaleString()}</td>
                <td>{cita.especialidad}</td>
                <td>
                  <Button 
                    variant="warning" 
                    onClick={() => handleEditCita(cita)} 
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => deleteDoc(doc(db, 'citas', cita.id))}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      {/* Modal para editar citas */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Cita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control 
                type="text" 
                value={editing?.descripcion || ''} 
                onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Especialidad</Form.Label>
              <Form.Control 
                type="text" 
                value={editing?.especialidad || ''} 
                onChange={(e) => setEditing({ ...editing, especialidad: e.target.value })} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateCita}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
