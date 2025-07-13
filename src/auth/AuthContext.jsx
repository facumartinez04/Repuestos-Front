import { createContext, useEffect, useReducer } from 'react';
import { authReducer } from './authReducer';
import axios from 'axios';
import { getApiUrl } from './helpers';

const getUrl = getApiUrl();

export const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  roles: [],
  permisos: [],
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const verificarYRenovarToken = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const usuario = localStorage.getItem('usuario');

      if (token) {
        try {
          const res = await axios.post(`${getUrl}/Login/me`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const { roles, permisos, usuario: userData } = res.data.result;

          dispatch({
            type: 'login',
            payload: token,
            refreshToken: refreshToken,
            roles: roles || [],
            permisos: permisos || []
          });

          localStorage.setItem('usuario', JSON.stringify(userData));
          return;
        } catch (error) {
          console.warn('Token expirado o inválido, intentando con refresh token...');
        }
      }

      if (refreshToken && usuario) {
        try {
          const res = await axios.post(`${getUrl}/Login/refresh`, {
            usuario,
            refreshToken
          });

          if (res.data.success) {
            const nuevoToken = res.data.result.token;
            const nuevoRefresh = res.data.result.refreshToken;
            const roles = res.data.result.roles || [];
            const permisos = res.data.result.permisos || [];

            localStorage.setItem('token', nuevoToken);
            localStorage.setItem('refreshToken', nuevoRefresh);
            localStorage.setItem('usuario', JSON.stringify(res.data.result.usuario));

            dispatch({
              type: 'login',
              payload: nuevoToken,
              refreshToken: nuevoRefresh,
              roles,
              permisos
            });

            console.log('Token renovado exitosamente');
          } else {
            throw new Error('Error en la renovación de token');
          }
        } catch (error) {
          console.error('Falló la renovación del token', error);
          localStorage.clear();
          dispatch({ type: 'logout' });
        }
      } else {
        localStorage.clear();
        dispatch({ type: 'logout' });
      }
    };

    verificarYRenovarToken();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
