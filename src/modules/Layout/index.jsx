import React from 'react';
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
  CommentOutlined ,
  IdcardOutlined,
  SearchOutlined
} from '@ant-design/icons';

import { Outlet, Link } from 'react-router-dom'
import { Layout, Menu, theme ,FloatButton  } from 'antd';
import Ruta from './Navegacion'

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  }
}




const item = [
  getItem(<Link to="/login"> Login </Link>, '1', <LoginOutlined />),
  getItem(<Link to="/register"> register </Link>, '2', <IdcardOutlined />),
  getItem(<Link to="/pagos"> pagos </Link>, '3', <DollarOutlined />),
  getItem(<Link> personal </Link>, '4', <BarsOutlined />,
    [
      getItem(<Link to="/personal"> Mostrar </Link>, '5', <SearchOutlined />),
      getItem(<Link to="/personal/3"> Editar </Link>, '6', <EditOutlined />),
      getItem(<Link to="/personal/alta"> Agregar </Link>, '7', <PlusOutlined />)
    ]),
  getItem(<Link> Agendas </Link>, '8', <BarsOutlined />,
    [
      getItem(<Link to="/personal/agenda"> Todas las Agenda </Link>, '9', <SearchOutlined />),
      getItem(<Link to="/personal/agenda/agregar/2"> Nueva Agenda </Link>, '10', <PlusOutlined />),
      getItem(<Link to="/personal/agenda/5"> Agenda Medica </Link>, '11', <EditOutlined />),
    ]),
  getItem(<Link> Pacientes </Link>, '12', <BarsOutlined />,
    [
      getItem(<Link to="/paciente"> Mostrar Todos </Link>, '13', <SearchOutlined />),
      getItem(<Link to="/paciente/alta"> Alta </Link>, '14', <PlusOutlined />),
      getItem(<Link to="/paciente/66"> Editar (S) </Link>, '15', <EditOutlined />)
    ]),
  getItem(<Link> Turnos </Link>, '16', <BarsOutlined />,
    [
      getItem(<Link to="/turnos"> Mostrar Todos </Link>, '17', <SearchOutlined />),
      getItem(<Link to="/turnos/66"> Paciente (S) </Link>, '18', <SearchOutlined />),
      getItem(<Link to="/turnos/solicitud"> Otorgar </Link>, '19', <PlusOutlined />),
      getItem(<Link to="/turnos/editar"> Modificar </Link>, '20', <EditOutlined />),
      getItem(<Link to="/turnos/editar/32"> Modifiar (S) </Link>, '21', <EditOutlined />),
      getItem(<Link to="/turnos/cancelar"> cancelar </Link>, '22', <DeleteOutlined />),
      getItem(<Link to="/turnos/cancelar/21"> Cancelar (S) </Link>, '23', <DeleteOutlined />)

    ]),
  getItem(<Link to="/logout"> LogOut </Link>, '24', <PoweroffOutlined />)
]



const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={item}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Ruta />
        </Header>



        <Content
          style={{
            margin: '24px 16px 0',
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >

            <Outlet />


          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          

          INSPT UTN 2023 - Programacion III - Consorti Gonzalo Nicolas
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;