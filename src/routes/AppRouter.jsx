
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/Login';
import Logout from '../pages/Logout';
import Repuestos from '../pages/Repuestos';
import Usuarios from '../pages/Usuarios';
import Roles from '../pages/Roles';

function AppRouter() {
  return (
     <Routes>
      <Route path="/login" element={<Login />} />

      

       <Route
        path="/usuarios"
        element={
          <PrivateRoute>
            <Usuarios />
          </PrivateRoute>
        }
      />

  <Route
        path="/roles"
        element={
          <PrivateRoute>
            <Roles />
          </PrivateRoute>
        }
      />


            <Route
        path="/repuestos"
        element={
          <PrivateRoute>
            <Repuestos />
          </PrivateRoute>

          
        }
      />

      {}
      <Route path="/logout" element={<Logout />} />

      {}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRouter;
