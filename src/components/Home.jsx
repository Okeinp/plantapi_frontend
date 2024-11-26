import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './Home.scss'

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <div className="home-container">
      <h1>Bienvenido a PlantAPI</h1>
      <p>En PlantAPI puedes gestionar todas tus plantas y sus cuidados de manera sencilla y eficiente. Regístrate o inicia sesión para comenzar a agregar tus plantas y llevar un control detallado de sus necesidades.</p>
      <ul>
        {!isAuthenticated ? (
          <>
            <li><Link to="/register">Registrar un nuevo usuario</Link></li>
            <li><Link to="/login">Iniciar sesión</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/plantas">Ver y gestionar plantas</Link></li>
            <li><Link to="/cuidados">Ver y gestionar cuidados</Link></li>
          </>
        )}
      </ul>
    </div>
  )
}

export default Home