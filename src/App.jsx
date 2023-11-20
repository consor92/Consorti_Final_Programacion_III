
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { routeAdmin, routeMedico, routePaciente, roleLocalStorage } from './modules/Layout/Navegacion/restriccionesRoles'


import Layout from './modules/Layout'
import LayoutLog from './modules/Layout/log'
import NotFound from './modules/NotFound'
import Login from './modules/Login'
import Logout from './modules/Logout'

function App() {

  let role = roleLocalStorage()

  if (role && role.user) {
    role = role.user.role
  }



  const selectedRoutes = role === 'admin' ? routeAdmin : role === 'medico' ? routeMedico : role === 'paciente' ? routePaciente : '';

  return (

    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<LayoutLog />}>
            <Route path='/' element={<Login />} />
          </Route>
          <Route path='logout' element={<Logout />} />

          <Route element={<Layout />}>{selectedRoutes}</Route>

          <Route path='*' element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </div >

  )
}

export default App


/*
  <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='pagos' element={<Pagos />} />
            <Route path='logout' element={<Logout />} />
              <Route path='personal' >
                <Route index element={<Personal />} />
                <Route path='alta' element={<AltaPersonal />} />
                <Route path='agenda' >
                  <Route index element={<Agenda />} />
                  <Route path='agregar' >
                    <Route path=':medico' element={<AgendaAlta />} />
                  </Route>
                  { <Route path=':medico' element={<AgendaMedico doctorKey={medico} />} /> }
                  { <Route path="/ruta/:parametro1/:parametro2" />}
                  <Route path=':medico' element={<AgendaMedico doctorKey={1} />} />
                </Route>
                <Route path=':personal' element={<EditarPersonal />} />
              </Route>
              <Route path='paciente' >
                <Route index element={<Paciente />} />
                <Route path='alta' element={<AltaPaciente />} />
                <Route path='editar' >
                  <Route path=':paciente' element={<EditarPaciente />} />
                </Route>
                <Route path=':paciente' element={<MostrarPaciente />} />
              </Route>
              <Route path='turnos'>
                <Route index element={<Turnos />} />
                <Route path=':paciente' element={<ByPaciente />} />
                <Route path='solicitud' element={<AltaTurno />} />
                <Route path='editar'>
                  <Route index element={<Turnos />} />
                  <Route path=':turno' element={<ModificarTurno />} />
                </Route>
                <Route path='cancelar'>
                  <Route index element={<Turnos />} />
                  <Route path=':turno' >
                    <Route path=':paciente' element={<CancelarTurno />} />
                  </Route>
                </Route>
              </Route>
            <Route path='*' element={<NotFound />} />
*/