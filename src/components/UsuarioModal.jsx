import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { getApiUrl } from '../auth/helpers';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

function UsuarioModal({ show, onHide, usuario, recargar }) {
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();
  const getApi = getApiUrl();

  const [id, setId] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]);
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
  const [permisosModificados, setPermisosModificados] = useState(false);

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (!state.roles.some(r => r.descripcion?.includes('Administrador') || state.permisos.some(p => p.dataKey === 'usuario.modulo'))) {
      navigate('/repuestos');
    }
  }, [state.roles, navigate]);

  useEffect(() => {
    cargarRoles();
    cargarPermisos();
  }, []);

  useEffect(() => {
    if (usuario) {
      setId(usuario.id);
      setNombreUsuario(usuario.nombreUsuario);
      setEmail(usuario.email);
      setClave('');
      setRolesSeleccionados([]);
      setPermisosSeleccionados([]);
      setPermisosModificados(false);
      cargarRolesUsuario(usuario.id);
      cargarPermisosUsuario(usuario.id);
    }
  }, [usuario]);

  const limpiarFormulario = () => {
    setId(null);
    setNombreUsuario('');
    setEmail('');
    setClave('');
    setRolesSeleccionados([]);
    setPermisosSeleccionados([]);
    setPermisosModificados(false);
    setErrores({});
  };

  const cargarRoles = async () => {
    try {
      const res = await axios.get(`${getApi}/Rol`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRolesDisponibles(res.data.result || []);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
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

  const cargarRolesUsuario = async (idUsuario) => {
    try {
      const res = await axios.get(`${getApi}/UsuarioRol/${idUsuario}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const roles = res.data.result || [];
      setRolesSeleccionados(roles.map(r => r.idRol));
    } catch (error) {
      console.error('Error al cargar roles del usuario:', error);
    }
  };

  const cargarPermisosUsuario = async (idUsuario) => {
    try {
      const res = await axios.get(`${getApi}/UsuarioPermiso/${idUsuario}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const permisos = res.data.result || [];
      setPermisosSeleccionados(permisos.map(p => p.idPermiso));
    } catch (error) {
      console.error('Error al cargar permisos del usuario:', error);
    }
  };

  const manejarCambioRol = (idRol) => {
    setRolesSeleccionados(prev =>
      prev.includes(idRol)
        ? prev.filter(id => id !== idRol)
        : [...prev, idRol]
    );
  };

  const togglePermiso = (idPermiso) => {
    setPermisosModificados(true);
    setPermisosSeleccionados(prev =>
      prev.includes(idPermiso)
        ? prev.filter(id => id !== idPermiso)
        : [...prev, idPermiso]
    );
  };

  const validarCampos = () => {
    const nuevosErrores = {};
    if (!nombreUsuario.trim()) nuevosErrores.nombreUsuario = "El nombre de usuario es obligatorio";
    if (!email.trim()) nuevosErrores.email = "El email es obligatorio";
    if (!usuario && !clave.trim()) nuevosErrores.clave = "La contraseña es obligatoria al crear";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = async () => {
    if (!validarCampos()) return;

    const data = {
      id,
      nombreUsuario,
      email,
      clave,
      usuarioRols: rolesSeleccionados.map(idRol => ({ idUsuario: id, idRol })),
      usuarioPermisos: permisosSeleccionados.map(idPermiso => ({ idUsuario: id, idPermiso }))
    };

    try {
      if (usuario) {
        await axios.put(`${getApi}/Usuario/${id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post(`${getApi}/Usuario`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      recargar();
      onHide();
      limpiarFormulario();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  return (
    <Modal show={show} onHide={() => { onHide(); limpiarFormulario(); }}>
      <Modal.Header closeButton>
        <Modal.Title>{usuario ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              onBlur={validarCampos}
              isInvalid={!!errores.nombreUsuario}
            />
            <Form.Control.Feedback type="invalid">{errores.nombreUsuario}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validarCampos}
              isInvalid={!!errores.email}
            />
            <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder={usuario ? "Dejar vacío para no cambiar" : ""}
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              onBlur={validarCampos}
              isInvalid={!!errores.clave}
            />
            <Form.Control.Feedback type="invalid">{errores.clave}</Form.Control.Feedback>
          </Form.Group>
          {usuario && (
            <>
                  <Form.Group className="mb-2">
                  <Form.Label>Roles</Form.Label>
                  {rolesDisponibles.map(rol => (
                    <Form.Check
                      key={rol.id}
                      type="checkbox"
                      label={rol.descripcion}
                      checked={rolesSeleccionados.includes(rol.id)}
                      onChange={() => manejarCambioRol(rol.id)}
                    />
                  ))}
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Permisos</Form.Label>
                  {permisosDisponibles.map(permiso => (
                    <Form.Check
                      key={permiso.id}
                      type="checkbox"
                      label={`${permiso.nombrePermiso} (${permiso.dataKey})`}
                      checked={permisosSeleccionados.includes(permiso.id)}
                      onChange={() => togglePermiso(permiso.id)}
                    />
                  ))}
                </Form.Group>
              </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { onHide(); limpiarFormulario(); }}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          {usuario ? 'Guardar Cambios' : 'Crear'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UsuarioModal;
