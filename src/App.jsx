import { useState, useEffect, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import Plantas from './components/Plantas'
import Cuidados from './components/Cuidados'
import Header from './components/Header' 
import './App.scss'
import axios from 'axios'
import { AuthContext } from './context/AuthContext'

axios.defaults.withCredentials = true

function App() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setIsAuthenticated(false)
          return
        }
        await axios.get('/user/auth/check', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setIsAuthenticated(true)
      } catch (error) {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [setIsAuthenticated])

  return (
    <>
      <Header isAuthenticated={isAuthenticated} />
      <div style={{ marginTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/plantas" element={<Plantas isAuthenticated={isAuthenticated} />} />
          <Route path="/cuidados" element={<Cuidados isAuthenticated={isAuthenticated} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
