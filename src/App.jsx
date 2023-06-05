import { useState,useContext, useEffect } from 'react'
import Navbar from './components/Navbar'
import Inicio from './pages/Inicio'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Perfil from './pages/Perfil'
import Noticia from './pages/Noticia'
import Evento from './pages/Evento'
import Banner from './pages/Banner'
import UpdsResponde from './pages/UpdsResponde'
import Notificaciones from './pages/Notificaciones'
import ModalR from './components/ModalR'
import Modal2 from './components/Modal2'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import { UserContext } from './context/UserProvider'

const App = () => {
  const { user } = useContext(UserContext);
  
  return <>
    <div>
      <Navbar />
    </div>
    <div >
      <Routes>
        {/* <Route path='/' element={<Inicio />} /> */}
        <Route
            path="/"
            element={
              <PrivateRoute isSignedIn={user}>
                <Inicio/>
              </PrivateRoute>
            }
          />
        {/* <Route path='perfil' element={<Perfil />} /> */}
        <Route
            path="/perfil"
            element={
              <PrivateRoute isSignedIn={user}>
                <Perfil/>
              </PrivateRoute>
            }
          />
        {/* <Route path='noticia' element={<Noticia />} /> */}
        <Route
            path="/noticia"
            element={
              <PrivateRoute isSignedIn={user}>
                <Noticia/>
              </PrivateRoute>
            }
          />
        <Route path='evento' element={<Evento />} />
        <Route path='banner' element={<Banner />} />
        <Route path='UPDSresponde' element={<UpdsResponde />} />
        <Route path='notificaciones' element={<Notificaciones />} />
        <Route path='modal' element={<ModalR />} />
        <Route path='login' element={<Login />} />
      </Routes>
    </div>
  </>
}

export default App
