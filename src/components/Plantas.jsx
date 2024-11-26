import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Plantas.scss';
import { AuthContext } from '../context/AuthContext';
import Joi from 'joi';

const Plantas = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [plantas, setPlantas] = useState([]);
  const [cuidados, setCuidados] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    tipo: '',
    cuidados: [{ tipo: '', descripcion: '', frecuencia: '' }]
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const plantaSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      "string.empty": "El nombre de la planta es requerido",
      "string.min": "El nombre debe tener al menos 3 caracteres",
      "string.max": "El nombre no puede exceder los 50 caracteres",
    }),
    tipo: Joi.string().min(3).max(50).required().messages({
      "string.empty": "El tipo de planta es requerido",
      "string.min": "El tipo debe tener al menos 3 caracteres",
      "string.max": "El tipo no puede exceder los 50 caracteres",
    }),
    cuidados: Joi.array().items(Joi.object({
      tipo: Joi.string().min(3).max(50).required().messages({
        "string.empty": "El tipo de cuidado es requerido",
        "string.min": "El tipo de cuidado debe tener al menos 3 caracteres",
        "string.max": "El tipo de cuidado no puede exceder los 50 caracteres",
      }),
      descripcion: Joi.string().min(3).max(200).required().messages({
        "string.empty": "La descripción del cuidado es requerida",
        "string.min": "La descripción debe tener al menos 3 caracteres",
        "string.max": "La descripción no puede exceder los 200 caracteres",
      }),
      frecuencia: Joi.string().min(3).max(50).required().messages({
        "string.empty": "La frecuencia del cuidado es requerida",
        "string.min": "La frecuencia debe tener al menos 3 caracteres",
        "string.max": "La frecuencia no puede exceder los 50 caracteres",
      })
    })).min(1).required().messages({
      "array.base": "Los cuidados son requeridos",
      "array.min": "Debe haber al menos un cuidado"
    })
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchPlantas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('/plantas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPlantas(response.data.data || []);
      } catch (error) {
        console.error(error);
        logout();
        navigate('/login');
      }
    };

    const fetchCuidados = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('/cuidados', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCuidados(response.data.data || []);
      } catch (error) {
        console.error(error);
        logout();
        navigate('/login');
      }
    };

    fetchPlantas();
    fetchCuidados();
  }, [isAuthenticated, navigate, logout]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCuidadoChange = (index, e) => {
    const newCuidados = formData.cuidados.map((cuidado, i) => {
      if (i === index) {
        return { ...cuidado, [e.target.name]: e.target.value };
      }
      return cuidado;
    });
    setFormData({
      ...formData,
      cuidados: newCuidados
    });
  };

  const handleAddCuidado = () => {
    setFormData({
      ...formData,
      cuidados: [...formData.cuidados, { tipo: '', descripcion: '', frecuencia: '' }]
    });
  };

  const handleRemoveCuidado = (index) => {
    const newCuidados = formData.cuidados.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      cuidados: newCuidados
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = plantaSchema.validate(formData, { abortEarly: false });
    if (error) {
      const errorMessages = {};
      error.details.forEach(err => {
        errorMessages[err.path.join('.')] = err.message;
      });
      setErrors(errorMessages);
      return;
    }
    setErrors({});
    try {
      const token = localStorage.getItem('token');
      await axios.post('/plantas', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const response = await axios.get('/plantas', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPlantas(response.data.data || []);
      setFormData({
        name: '',
        tipo: '',
        cuidados: [{ tipo: '', descripcion: '', frecuencia: '' }]
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/plantas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPlantas(plantas.filter(planta => planta._id !== id));
    } catch (error) {
      console.error(error);
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="plantas-container">
      <h1>Plantas</h1>
      <form className="plantas-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} />
        {errors.name && <p className="error">{errors.name}</p>}
        <input type="text" name="tipo" placeholder="Tipo" value={formData.tipo} onChange={handleChange} />
        {errors.tipo && <p className="error">{errors.tipo}</p>}
        {formData.cuidados.map((cuidado, index) => (
          <div key={index} className="new-cuidado-form">
            <input type="text" name="tipo" placeholder="Tipo de Cuidado" value={cuidado.tipo} onChange={(e) => handleCuidadoChange(index, e)} />
            <input type="text" name="descripcion" placeholder="Descripción" value={cuidado.descripcion} onChange={(e) => handleCuidadoChange(index, e)} />
            <input type="text" name="frecuencia" placeholder="Frecuencia" value={cuidado.frecuencia} onChange={(e) => handleCuidadoChange(index, e)} />
            {formData.cuidados.length > 1 && (
              <button type="button" onClick={() => handleRemoveCuidado(index)}>Eliminar</button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddCuidado}>Agregar Cuidado</button>
        {errors.cuidados && <p className="error">{errors.cuidados}</p>}
        <button type="submit">Agregar Planta</button>
      </form>
      <table className="plantas-list">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Cuidados</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {plantas.map(planta => (
            <tr key={planta._id}>
              <td>{planta.name}</td>
              <td>{planta.tipo}</td>
              <td>
                <table className="cuidados-table">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Descripción</th>
                      <th>Frecuencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planta.cuidados.map(cuidado => (
                      <tr key={cuidado._id}>
                        <td>{cuidado.tipo}</td>
                        <td>{cuidado.descripcion}</td>
                        <td>{cuidado.frecuencia}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td>
                <button onClick={() => handleDelete(planta._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Plantas;