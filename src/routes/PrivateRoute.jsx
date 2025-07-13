import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

const PrivateRoute = ({ children }) => {
  const { state } = useContext(AuthContext);

  return state.isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;