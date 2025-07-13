import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../auth/helpers';
import RolModal from '../components/RolModal';
import alertify from 'alertifyjs';

function Roles() {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rolActual, setRolActual] = useState(null);
  const getApi = getApiUrl();

  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      const res = await axios.get(`${getApi}/Rol`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRoles(res.data.result || []);
    } catch (error) {
      console.error('Error al cargar roles:', error);
      alertify.error('Error al cargar los roles.');
    }
  };

  const eliminarRol = async (id) => {
    try {
      await axios.delete(`${getApi}/Rol/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alertify.success('Rol eliminado correctamente.');
      cargarRoles();
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      const mensaje = error.response?.data?.message || 'No se pudo eliminar el rol.';
      alertify.error(mensaje);
    }
  };

  const abrirCrear = () => {
    setRolActual(null);
    setShowModal(true);
  };

  const abrirEditar = (rol) => {
    setRolActual(rol);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Roles</h2>
        <button className="btn btn-primary" onClick={abrirCrear}>Crear Rol</button>
      </div>

      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre del Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((rol) => (
            <tr key={rol.id}>
              <td>{rol.id}</td>
              <td>{rol.descripcion}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => abrirEditar(rol)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarRol(rol.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <RolModal
        show={showModal}
        onHide={() => setShowModal(false)}
        rol={rolActual}
        recargar={cargarRoles}
      />
    </div>
  );
}

export default Roles;
