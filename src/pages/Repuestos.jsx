import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RepuestoModal from '../components/RepuestoModal';
import { getApiUrl } from '../auth/helpers';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

function Repuestos() {
  const { state } = useContext(AuthContext);
  const [repuestosOriginal, setRepuestosOriginal] = useState([]);
  const [repuestosFiltrados, setRepuestosFiltrados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [repuestoActual, setRepuestoActual] = useState(null);
  const getApi = getApiUrl();

  // Filtros
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  useEffect(() => {
    cargarRepuestos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtroNombre, filtroMarca, filtroCategoria, repuestosOriginal]);

  const cargarRepuestos = async () => {
    try {
      const res = await axios.get(`${getApi}/Repuesto`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = res.data.result || [];
      setRepuestosOriginal(data);
      setRepuestosFiltrados(data);
    } catch (error) {
      console.error('Error al cargar repuestos:', error);
    }
  };

  const aplicarFiltros = () => {
    let filtrados = [...repuestosOriginal];

    if (filtroNombre)
      filtrados = filtrados.filter(r =>
        r.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
      );

    if (filtroMarca)
      filtrados = filtrados.filter(r =>
        r.marca.toLowerCase().includes(filtroMarca.toLowerCase())
      );

    if (filtroCategoria)
      filtrados = filtrados.filter(r =>
        r.categoria.toLowerCase().includes(filtroCategoria.toLowerCase())
      );

    setRepuestosFiltrados(filtrados);
  };

  const eliminarRepuesto = async (id) => {
    try {
      await axios.delete(`${getApi}/Repuesto/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      cargarRepuestos();
    } catch (error) {
      console.error('Error al eliminar repuesto:', error);
    }
  };

  const abrirCrear = () => {
    setRepuestoActual(null);
    setShowModal(true);
  };

  const abrirEditar = (repuesto) => {
    setRepuestoActual(repuesto);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Repuestos</h2>
        {(state.permisos.some(p => p.dataKey === 'repuesto.crear') ||
          state.roles.some(r => r.descripcion === 'Administrador')) ? (
          <button className="btn btn-primary" onClick={abrirCrear}>Crear Repuesto</button>
        ) : null}
      </div>

      {/* Filtros */}
      <div className="card p-3 mb-3">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Filtrar por nombre"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Filtrar por marca"
              value={filtroMarca}
              onChange={(e) => setFiltroMarca(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Filtrar por categoría"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            />
          </div>
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-secondary me-2" onClick={() => {
              setFiltroNombre('');
              setFiltroMarca('');
              setFiltroCategoria('');
            }}>
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {repuestosFiltrados.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.nombre}</td>
              <td>{r.descripcion}</td>
              <td>{r.precio}</td>
              <td>{r.marca}</td>
              <td>{r.modelo}</td>
              <td>{r.categoria}</td>
              <td>{r.stock}</td>
              <td>
                {(state.permisos.some(p => p.dataKey === 'repuesto.editar') ||
                  state.roles.some(r => r.descripcion === 'Administrador')) ? (
                    <button className="btn btn-warning btn-sm me-2" onClick={() => abrirEditar(r)}>Editar</button>
                  ) : null}

                {(state.permisos.some(p => p.dataKey === 'repuesto.eliminar') ||
                  state.roles.some(r => r.descripcion === 'Administrador')) ? (
                    <button className="btn btn-danger btn-sm" onClick={() => eliminarRepuesto(r.id)}>Eliminar</button>
                  ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <RepuestoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        repuesto={repuestoActual}
        recargar={cargarRepuestos}
      />
    </div>
  );
}

export default Repuestos;
