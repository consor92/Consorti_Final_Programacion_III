import React from 'react';


import { Outlet } from 'react-router-dom'
import { Layout, Menu, theme   } from 'antd';
import Ruta from './Navegacion'
import {  itemAdmin , itemMedico , itemPaciente , roleLocalStorage } from './Navegacion/restriccionesRoles'

const { Header, Content, Footer, Sider } = Layout;



const role = 'medico'
const item = role === 'admin' ? itemAdmin : role === 'medico' ? itemMedico : role === 'paciente' ? itemPaciente : '';

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