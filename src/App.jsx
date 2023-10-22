
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Layout from './modules/Layout'
import NotFound from './modules/NotFound'
import Login from './modules/Login'
import Register from './modules/Register'
import Pagos from './modules/Pagos'

import Personal from './modules/Personal'
import AltaPersonal from './modules/Personal/AltaPersonal'
import EditarPersonal from './modules/Personal/Editar'
import Agenda from './modules/Personal/Agenda'
import AgendaMedico from './modules/Personal/Agenda/Medico'
import AgendaAlta from './modules/Personal/Agenda/Alta'

import Paciente from './modules/Paciente'
import AltaPaciente from './modules/Paciente/AltaPaciente'
import EditarPaciente from './modules/Paciente/Edicion'


import Turnos from './modules/Turnos'
import byPaciente from './modules/Turnos/ListarPorPaciente'
import AltaTurno from './modules/Turnos/Alta'
import ModificarTurno from './modules/Turnos/Edicion'
import CancelarTurno from './modules/Turnos/Baja'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />

          <Route element={<Layout />} >
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='pagos' element={<Pagos />} />
            <Route path='personal' >
              <Route index element={<Personal />} />
              <Route path='alta' element={<AltaPersonal />} />
              <Route path='agenda' >
                <Route index element={<Agenda />} />
                <Route path='agregar' >
                  <Route path=':medico' element={<AgendaAlta />} />
                </Route>
                 {/* <Route path=':medico' element={<AgendaMedico doctorKey={medico} />} /> */}
                 {/* <Route path="/ruta/:parametro1/:parametro2" />*/}
                <Route path=':medico' element={<AgendaMedico doctorKey={1} />} />
              </Route>
              <Route path=':personal' element={<EditarPersonal />} />
            </Route>
            <Route path='paciente' >
              <Route index element={<Paciente />} />
              <Route path='alta' element={<AltaPaciente />} />
              <Route path=':paciente' element={<EditarPaciente />} />
            </Route>
            <Route path='turnos'>
              <Route index element={<Turnos />} />
              <Route path=':paciente' element={<byPaciente />} />
              <Route path='solicitud' element={<AltaTurno />} />
              <Route path='editar'>
                <Route index element={<Turnos />} /> 
                <Route path=':turno' element={<ModificarTurno />} />
              </Route>
              <Route path='cancelar'>
                <Route index element={<Turnos />} />
                <Route path=':turno' element={<CancelarTurno />} />
              </Route>
          </Route>
          <Route path='*' element={<NotFound />} />
        </Route>

        <Route path='*' element={<NotFound />} />

      </Routes>
    </BrowserRouter>
    </div >

  )
}

export default App
