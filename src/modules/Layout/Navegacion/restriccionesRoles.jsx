
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';


import {
  UploadOutlined,
  UserOutlined,
  DeleteOutlined,
  BarsOutlined,
  PlusOutlined,
  HomeOutlined,
  TeamOutlined,
  EditOutlined,
  DollarOutlined,
  PoweroffOutlined,
  LoginOutlined,
  CustomerServiceOutlined,
  CommentOutlined,
  IdcardOutlined,
  SearchOutlined
} from '@ant-design/icons';

function getItem(label, icon, children) {
  return {
    icon,
    children,
    label,
  };
}

import NotFound from '../../../modules/NotFound'
import Login from '../../../modules/Login'
import Register from '../../../modules/Register'
import Pagos from '../../../modules/Pagos'
import Logout from '../../../modules/Logout'
import Dashboard from '../../../modules/Dashboard'

import Personal from '../../../modules/Personal'
import AltaPersonal from '../../../modules/Personal/AltaPersonal'
import EditarPersonal from '../../../modules/Personal/Editar'
import Agenda from '../../../modules/Personal/Agenda'
import AgendaMedico from '../../../modules/Personal/Agenda/Medico'
import AgendaAlta from '../../../modules/Personal/Agenda/Alta'

import Paciente from '../../../modules/Paciente'
import AltaPaciente from '../../../modules/Register'
import EditarPaciente from '../../../modules/Register'
import MostrarPaciente from '../../../modules/Paciente/Mostrar'

import Turnos from '../../../modules/Turnos'
import ByPaciente from '../../../modules/Turnos/ListarPorPaciente'
import AltaTurno from '../../../modules/Turnos/Alta'
import ModificarTurno from '../../../modules/Turnos/Edicion'
import CancelarTurno from '../../../modules/Turnos/Baja'


export const roleLocalStorage = () => {
  const [role, setRole] = useState();
  //const navigate = useNavigate();

  useEffect(() => {

    const fetchUserRole = async () => {
      const storedUserDataString = localStorage.getItem('userData');
      const storedUserData = storedUserDataString ? JSON.parse(storedUserDataString) : null;

      if (storedUserData && storedUserData.user) {
        setRole(storedUserData.user.role);
      } else {
        console.error('No se pudo obtener el rol del usuario');
        // navigate('/');
      }
    };

    fetchUserRole(); // Llamar a la función de obtención de roles
  }, []);

  return  role;
};


// Rutas para cada tipo de rol
export const routeAdmin = (
  <>
    <Route path='dashboard' element={<Dashboard />} />
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
  </>
);

export const routeMedico = (
  <>
    <Route path='dashboard' element={<Dashboard />} />
    <Route path='register' element={<Register />} />
    <Route path='logout' element={<Logout />} />
    <Route path='personal' >
      <Route index element={<Personal />} />
      <Route path='alta' element={<AltaPersonal />} />
      <Route path='agenda' >
        <Route index element={<Agenda />} />
        <Route path='agregar' >
          <Route path=':medico' element={<AgendaAlta />} />
        </Route>
        <Route path=':medico' element={<AgendaMedico doctorKey={1} />} />
      </Route>
      <Route path=':personal' element={<EditarPersonal />} />
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
    <Route path='paciente' >
      <Route index element={<Paciente />} />
      <Route path=':paciente' element={<MostrarPaciente />} />
    </Route>
    <Route path='*' element={<NotFound />} />
  </>
);

export const routePaciente = (
  <>
    <Route path='dashboard' element={<Dashboard />} />
    <Route path='register' element={<Register />} />
    <Route path='pagos' element={<Pagos />} />
    <Route path='logout' element={<Logout />} />
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
  </>
);


const generateKey = (parentKey, index) => parentKey ? `${parentKey}-${index + 1}` : String(index + 1);
//Menu Navegacion visual para cada Rol

export const itemAdmin = [
  getItem(<Link to="/dashboard"> Home  </Link>, <HomeOutlined />),
  getItem(<Link to="/register"> Nuevo Paciente </Link>, <IdcardOutlined />),
  getItem(<Link to="/pagos"> pagos </Link>, <DollarOutlined />),
  getItem(<Link> personal </Link>, <BarsOutlined />,
    [
      getItem(<Link to="/personal"> Mostrar </Link>, <SearchOutlined />),
      //getItem(<Link to="/personal/3"> Editar </Link>, <EditOutlined />),
      getItem(<Link to="/personal/alta"> Agregar </Link>, <PlusOutlined />)
    ]),
  getItem(<Link> Agendas </Link>, <BarsOutlined />,
    [
      getItem(<Link to="/personal/agenda"> Todas las Agenda </Link>, <SearchOutlined />),
      getItem(<Link to={`/personal/agenda/agregar/${localStorageId()}`}> Nueva Agenda </Link>, <PlusOutlined />),
      getItem(<Link to={`/personal/agenda/${localStorageId()}`}> Agenda Medica </Link>, <EditOutlined />),
    ]),
  getItem(<Link> Pacientes </Link>, <BarsOutlined />,
    [
      getItem(<Link to="/paciente"> Mostrar Todos </Link>, <SearchOutlined />),
      getItem(<Link to="/paciente/1"> Paciente </Link>, <SearchOutlined />),
      getItem(<Link to="/paciente/alta"> Alta </Link>, <PlusOutlined />),
      getItem(<Link to="/paciente/Editar/2"> Editar (S) </Link>, <EditOutlined />)
    ]),
  getItem(<Link> Turnos </Link>, <BarsOutlined />,
    [
      getItem(<Link to="/turnos"> Mostrar Todos </Link>, <SearchOutlined />),
      getItem(<Link to="/turnos/66"> Paciente (S) </Link>, <SearchOutlined />),
      getItem(<Link to="/turnos/solicitud"> Otorgar </Link>, <PlusOutlined />),
      getItem(<Link to="/turnos/editar"> Modificar </Link>, <EditOutlined />),
      getItem(<Link to="/turnos/editar/32"> Modifiar (S) </Link>, <EditOutlined />),
      getItem(<Link to="/turnos/cancelar"> cancelar </Link>, <DeleteOutlined />),
      getItem(<Link to="/turnos/cancelar/21"> Cancelar (S) </Link>, <DeleteOutlined />)

    ]),
  getItem(<Link to="/logout"> LogOut </Link>, <PoweroffOutlined />)
].map((item, index) => ({ key: generateKey(null, index), ...item, children: item.children && item.children.map((child, childIndex) => ({ key: generateKey(index, childIndex), ...child })) }));

function localStorageId() {
  const storedUserDataString = localStorage.getItem('userData');
  const storedUserData = storedUserDataString ? JSON.parse(storedUserDataString) : null;

  return (storedUserData && storedUserData.user) ? storedUserData.user._id : ''
}

export const itemMedico = [
  getItem(<Link to="/dashboard"> Home  </Link>, <HomeOutlined />),
  getItem(<Link to="/register"> Nuevo Paciente  </Link>, <IdcardOutlined />),
  getItem(<Link> Personal </Link>, <BarsOutlined />,
    [
      getItem(<Link to="/personal"> Mostrar Todos </Link>, <SearchOutlined />),
    ]),
  getItem(<Link> Agendas </Link>, <BarsOutlined />,
    [
      getItem(<Link to="/personal/agenda"> Todas las Agenda </Link>, <SearchOutlined />),
      getItem(<Link to={`/personal/agenda/agregar/${localStorageId()}`}> Nueva Agenda </Link>, <PlusOutlined />),
      getItem(<Link to={`/personal/agenda/${localStorageId()}`}> Agenda Medica </Link>, <EditOutlined />),
    ]),
  getItem(<Link> Pacientes </Link>, <BarsOutlined />,
    [
      getItem(<Link to="/paciente"> Mostrar Todos </Link>, <SearchOutlined />),
      getItem(<Link to="/paciente/alta"> Alta </Link>, <PlusOutlined />),
    ]),
  getItem(<Link> Turnos </Link>, <BarsOutlined />,
    [
      getItem(<Link to="/turnos"> Mostrar Todos </Link>, <SearchOutlined />),
      getItem(<Link to="/turnos/solicitud"> Otorgar </Link>, <PlusOutlined />),
      getItem(<Link to="/turnos/editar"> Modificar </Link>, <EditOutlined />),
      getItem(<Link to="/turnos/cancelar"> cancelar </Link>, <DeleteOutlined />),
    ]),
  getItem(<Link to="/logout"> LogOut </Link>, <PoweroffOutlined />)
].map((item, index) => ({ key: generateKey(null, index), ...item, children: item.children && item.children.map((child, childIndex) => ({ key: generateKey(index, childIndex), ...child })) }));


export const itemPaciente = [
  getItem(<Link to="/dashboard"> Home  </Link>, <HomeOutlined />),
  getItem(<Link to="/pagos"> pagos </Link>, <DollarOutlined />),
  getItem(<Link> Agendas </Link>, <BarsOutlined />,
    [
      getItem(<Link to="/personal/agenda"> Todas las Agenda </Link>, <SearchOutlined />),
      getItem(<Link to="/personal/agenda/agregar/2"> Nueva Agenda </Link>, <PlusOutlined />),
      getItem(<Link to="/personal/agenda/5"> Agenda Medica </Link>, <EditOutlined />),
    ]),
  getItem(<Link> Pacientes </Link>, <BarsOutlined />,
    [
      getItem(<Link to="/paciente/1"> Paciente </Link>, <SearchOutlined />),
    ]),
  //getItem(<Link> Turnos </Link>, <BarsOutlined />,
    //[
     // getItem(<Link to="/turnos"> Mostrar Todos </Link>, <SearchOutlined />),
     // getItem(<Link to="/turnos/solicitud"> Otorgar </Link>, <PlusOutlined />),
     // getItem(<Link to="/turnos/editar"> Modificar </Link>, <EditOutlined />),
     // getItem(<Link to="/turnos/cancelar"> cancelar </Link>, <DeleteOutlined />),
    //]),
  getItem(<Link to="/logout"> LogOut </Link>, <PoweroffOutlined />)
].map((item, index) => ({ key: generateKey(null, index), ...item, children: item.children && item.children.map((child, childIndex) => ({ key: generateKey(index, childIndex), ...child })) }));