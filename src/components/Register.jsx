import React, { useState, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Register.scss'
import { AuthContext } from '../context/AuthContext'

const Register = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    username: '',
    password: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/user/register', formData) 
      localStorage.setItem('token', response.data.token) 
      setIsAuthenticated(true) 
      navigate('/')
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const validationErrors = {};
        error.response.data.errors.forEach(err => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error(error);
      }
    }
  }

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Register</h2>
      <p>Por favor ingresa tus datos para registrarte.</p>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} />
      {errors.name && <p className="error">{errors.name}</p>}
      <input type="text" name="lastname" placeholder="Lastname" onChange={handleChange} />
      {errors.lastname && <p className="error">{errors.lastname}</p>}
      <input type="text" name="username" placeholder="Username" onChange={handleChange} />
      {errors.username && <p className="error">{errors.username}</p>}
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      {errors.password && <p className="error">{errors.password}</p>}
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      {errors.email && <p className="error">{errors.email}</p>}
      <button type="submit">Register</button>
    </form>
  )
}

export default Register