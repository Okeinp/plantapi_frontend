import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Cuidados.scss'
import { AuthContext } from '../context/AuthContext'
import Joi from 'joi'

const Cuidados = () => {
  const { isAuthenticated, logout } = useContext(AuthContext)
  const [cuidados, setCuidados] = useState([])
  const [formData, setFormData] = useState({
    tipo: '',
    descripcion: '',
    frecuencia: ''
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const cuidadoSchema = Joi.object({
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
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const fetchCuidados = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }
        const response = await axios.get('/cuidados', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setCuidados(response.data.data || [])
      } catch (error) {
        console.error(error)
        logout()
        navigate('/login')
      }
    }
    fetchCuidados()
  }, [isAuthenticated, navigate, logout])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = cuidadoSchema.validate(formData, { abortEarly: false })
    if (error) {
      const errorMessages = {}
      error.details.forEach(err => {
        errorMessages[err.path.join('.')] = err.message
      })
      setErrors(errorMessages)
      return
    }
    setErrors({})
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/cuidados', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCuidados([...cuidados, response.data.data])
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/cuidados/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCuidados(cuidados.filter(cuidado => cuidado._id !== id))
    } catch (error) {
      console.error(error)
      logout()
      navigate('/login')
    }
  }

  return (
    <div className="cuidados-container">
      <h1>Cuidados</h1>
      <form className="cuidados-form" onSubmit={handleSubmit}>
        <input type="text" name="tipo" placeholder="Tipo" onChange={handleChange} />
        {errors.tipo && <p className="error">{errors.tipo}</p>}
        <input type="text" name="descripcion" placeholder="Descripción" onChange={handleChange} />
        {errors.descripcion && <p className="error">{errors.descripcion}</p>}
        <input type="text" name="frecuencia" placeholder="Frecuencia" onChange={handleChange} />
        {errors.frecuencia && <p className="error">{errors.frecuencia}</p>}
        <button type="submit">Agregar Cuidado</button>
      </form>
      <ul className="cuidados-list">
        {cuidados.map(cuidado => (
          <li key={cuidado._id}>
            {cuidado.tipo} - {cuidado.descripcion} - {cuidado.frecuencia}
            <button onClick={() => handleDelete(cuidado._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Cuidados