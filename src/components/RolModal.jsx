import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { getApiUrl } from '../auth/helpers';

export default function RolModal({ show, onHide, rol, recargar }) {
  const getApi = getApiUrl();

  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    cargarPermisos();
  }, []);

  useEffect(() => {
    if (rol) {
      setId(rol.id);
      setNombre(rol.descripcion || '');
      cargarPermisosDelRol(rol.id);
    } else {
      limpiarFormulario();
    }
  }, [rol]);

  const limpiarFormulario = () => {
    setId(null);
    setNombre('');
    setPermisosSeleccionados([]);
    setErrores({});
  };

  const cargarPermisos = async () => {
    try {
      const res = await axios.get(`${getApi}/Permiso`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPermisosDisponibles(res.data.result || []);
    } catch (error) {
      console.error('Error al cargar permisos:', error);
    }
  };

  const cargarPermisosDelRol = async (idRol) => {
    try {
      const res = await axios.get(`${getApi}/RolPermiso/${idRol}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const permisos = res.data.result || [];
      setPermisosSeleccionados(permisos.map(p => p.idPermiso));
    } catch (error) {
      console.error('Error al cargar permisos del rol:', error);
    }
  };

  const togglePermiso = (idPermiso) => {
    setPermisosSeleccionados(prev =>
      prev.includes(idPermiso)
        ? prev.filter(id => id !== idPermiso)
        : [...prev, idPermiso]
    );
  };

  const validarCampos = () => {
    const nuevosErrores = {};
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre del rol es obligatorio";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = async () => {
    if (!validarCampos()) return;

    const data = {
      idRol : id,
      descripcion: nombre,
      listaPermisos: permisosSeleccionados.map(idPermiso => ({ idRol: id, idPermiso }))
    };

    try {
      if (rol) {
        await axios.put(`${getApi}/Rol/${id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post(`${getApi}/Rol`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }

      recargar();
      onHide();
      limpiarFormulario();
    } catch (error) {
      console.error('Error al guardar rol:', error);
    }
  };

  return (
    <Modal show={show} onHide={() => { onHide(); limpiarFormulario(); }}>
      <Modal.Header closeButton>
        <Modal.Title>{rol ? 'Editar Rol' : 'Crear Rol'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Nombre del Rol</Form.Label>
            <Form.Control
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={validarCampos}
              isInvalid={!!errores.nombre}
            />
            <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
          </Form.Group>
          {rol && (
            <Form.Group className="mb-2">
              <Form.Label>Permisos</Form.Label>
              { permisosDisponibles.map(permiso => (
                <Form.Check
                  key={permiso.id}
                  type="checkbox"
                  label={`${permiso.nombrePermiso} (${permiso.dataKey})`}
                  checked={permisosSeleccionados.includes(permiso.id)}
                  onChange={() => togglePermiso(permiso.id)}
                />
              ))}
            </Form.Group>

          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { onHide(); limpiarFormulario(); }}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          {rol ? 'Guardar Cambios' : 'Crear'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

