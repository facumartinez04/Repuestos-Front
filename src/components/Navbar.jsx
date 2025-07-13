import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import '../assets/styles/navbar.css'
import { AuthContext } from '../auth/AuthContext'


export default function Navbar() {

    const {state} = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Repuestos</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
      

            {
              (state.permisos.some(p => p.dataKey === 'repuesto.listar') ||
              state.roles.some(r => r.descripcion === 'Administrador'))  ? (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/repuestos">Repuestos</NavLink>
                </li>
              )  : null
            }
            {
              state.roles[0] && state.roles[0].descripcion.includes('Administrador') || state.permisos.some(p => p.dataKey === 'usuario.modulo') ? (
                  <>

                  <li className="nav-item">
                        <NavLink className="nav-link" to="/usuarios">Usuarios</NavLink>
                  </li>
                  </>
                  
              ) : null
            }
            {
              state.roles[0] && state.roles[0].descripcion.includes('Administrador') || state.permisos.some(p => p.dataKey === 'usuario.roles') ? (
                  <>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/roles">Roles</NavLink>
                    </li>
                  </>
                  
              ) : null
            }
           {
            state.isAuthenticated ? (
              <li className="nav-item">
                <NavLink className="nav-link text-white btnLogout" to="/logout">Cerrar Sesión</NavLink>
              </li>
            ) : (
              <li className="nav-item">
              </li>
            )
           }
          </ul>
        </div>
      </div>
    </nav>
  )
}
