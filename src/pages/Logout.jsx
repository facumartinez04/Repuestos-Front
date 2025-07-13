import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

function Logout() {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.clear();

    dispatch({ type: 'logout' });
    navigate('/login');
  }, [dispatch, navigate]);

  return null;
}

export default Logout;
