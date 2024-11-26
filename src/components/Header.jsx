import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import './Header.scss'

const Header = ({ isAuthenticated }) => {
  const { setIsAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <div className="header-container">
      <Link to="/">Home</Link>
      <div className="nav-links">
        {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
      </div>
    </div>
  )
}

export default Header