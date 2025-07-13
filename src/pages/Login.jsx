import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../auth/helpers';
import alertify from 'alertifyjs';

function Login() {
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [nombreusuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const getApi = getApiUrl();

  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/repuestos');
    }
  }, [state.isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${getApi}/login`, { nombreusuario, clave });

      const token = res.data.result.token;
      const refreshToken = res.data.result.refreshToken;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('usuario', JSON.stringify(res.data.result.usuario));

      dispatch({
        type: 'login',
        payload: token,
        refreshToken: refreshToken,
        roles: res.data.result.roles,
        permisos: res.data.result.permisos
      });

      alertify.success('Inicio de sesión exitoso');
      navigate('/repuestos');

    } catch (err) {
      console.error(err);
      const mensaje = err.response?.data?.message || 'Error al iniciar sesión';
      alertify.error(mensaje);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Iniciar Sesión</h3>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={nombreusuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="form-control mb-2"
          placeholder="Usuario"
        />
        <input
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="form-control mb-3"
          placeholder="Contraseña"
        />
        <button type="submit" className="btn btn-primary">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;
