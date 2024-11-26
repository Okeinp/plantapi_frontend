import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Login.scss'

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/user/login', formData) 
      localStorage.setItem('token', response.data.token) 
      setIsAuthenticated(true) 
      navigate('/') 
      console.log(response.data)
    } catch (error) {
      console.error(error)
      setErrorMessage(error.response?.data?.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales e inténtalo de nuevo.')
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <p>Por favor ingresa tus credenciales para acceder al sitio.</p>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      {errorMessage && <p className="error">{errorMessage}</p>}
      <button type="submit">Login</button>
    </form>
  )
}

export default Login