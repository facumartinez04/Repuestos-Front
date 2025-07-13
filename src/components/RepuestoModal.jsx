import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { getApiUrl } from '../auth/helpers';
import alertify from 'alertifyjs';

function RepuestoModal({ show, onHide, repuesto, recargar }) {
  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [stock, setStock] = useState(0);
  const [errores, setErrores] = useState({});

  const getApi = getApiUrl();

  useEffect(() => {
    if (repuesto) {
      setId(repuesto.id);
      setNombre(repuesto.nombre);
      setDescripcion(repuesto.descripcion);
      setPrecio(repuesto.precio);
      setMarca(repuesto.marca);
      setModelo(repuesto.modelo);
      setCategoria(repuesto.categoria);
      setStock(repuesto.stock);
    } else {
      setId(null);
      setNombre('');
      setDescripcion('');
      setPrecio(0);
      setMarca('');
      setModelo('');
      setCategoria('');
      setStock(0);
    }
    setErrores({});
  }, [repuesto]);

  const validarCampos = () => {
    const nuevosErrores = {};
    if (!nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!descripcion.trim()) nuevosErrores.descripcion = 'La descripción es obligatoria.';
    if (precio < 0) nuevosErrores.precio = 'El precio no puede ser negativo.';
    if (!marca.trim()) nuevosErrores.marca = 'La marca es obligatoria.';
    if (!modelo.trim()) nuevosErrores.modelo = 'El modelo es obligatorio.';
    if (!categoria.trim()) nuevosErrores.categoria = 'La categoría es obligatoria.';
    if (stock < 0) nuevosErrores.stock = 'El stock no puede ser negativo.';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = async () => {
    if (!validarCampos()) return;

    const data = { id, nombre, descripcion, precio, marca, modelo, categoria, stock };

    try {
      if (repuesto) {
        await axios.put(`${getApi}/Repuesto/${id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alertify.success('Repuesto actualizado correctamente.');
      } else {
        await axios.post(`${getApi}/Repuesto`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alertify.success('Repuesto creado exitosamente.');
      }
      recargar();
      onHide();
    } catch (error) {
      console.error('Error al guardar repuesto:', error);
      const mensaje = error.response?.data?.message || 'Error al guardar el repuesto.';
      alertify.error(mensaje);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{repuesto ? 'Editar Repuesto' : 'Crear Repuesto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={validarCampos}
              isInvalid={!!errores.nombre}
            />
            <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              onBlur={validarCampos}
              isInvalid={!!errores.descripcion}
            />
            <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
              onBlur={validarCampos}
              isInvalid={!!errores.precio}
            />
            <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Marca</Form.Label>
            <Form.Control
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              onBlur={validarCampos}
              isInvalid={!!errores.marca}
            />
            <Form.Control.Feedback type="invalid">{errores.marca}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Modelo</Form.Label>
            <Form.Control
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              onBlur={validarCampos}
              isInvalid={!!errores.modelo}
            />
            <Form.Control.Feedback type="invalid">{errores.modelo}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              onBlur={validarCampos}
              isInvalid={!!errores.categoria}
            />
            <Form.Control.Feedback type="invalid">{errores.categoria}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              onBlur={validarCampos}
              isInvalid={!!errores.stock}
            />
            <Form.Control.Feedback type="invalid">{errores.stock}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleGuardar}>
          {repuesto ? 'Guardar Cambios' : 'Crear'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RepuestoModal;
