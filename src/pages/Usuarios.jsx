import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UsuarioModal from '../components/UsuarioModal';
import { getApiUrl } from '../auth/helpers';
import alertify from 'alertifyjs';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const getApi = getApiUrl();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get(`${getApi}/Usuario`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsuarios(res.data.result || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alertify.error('Error al cargar usuarios.');
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      await axios.delete(`${getApi}/Usuario/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alertify.success('Usuario eliminado correctamente.');
      cargarUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      const mensaje = error.response?.data?.message || 'No se pudo eliminar el usuario.';
      alertify.error(mensaje);
    }
  };

  const abrirCrear = () => {
    setUsuarioActual(null);
    setShowModal(true);
  };

  const abrirEditar = (usuario) => {
    setUsuarioActual(usuario);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Usuarios</h2>
        <button className="btn btn-primary" onClick={abrirCrear}>Crear Usuario</button>
      </div>

      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombreUsuario}</td>
              <td>{usuario.email}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => abrirEditar(usuario)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UsuarioModal
        show={showModal}
        onHide={() => setShowModal(false)}
        usuario={usuarioActual}
        recargar={cargarUsuarios}
      />
    </div>
  );
}

export default Usuarios;
