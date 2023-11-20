import React from 'react';
import { Breadcrumb, Flex, Layout, theme} from 'antd';
import { Outlet } from 'react-router-dom'

const { Header, Content, Footer } = Layout;



const App = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();


    return (
        <Layout>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
            </Header>

            <Content
                className="site-layout"
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                />

                <div
                    style={{
                        margin: '24px 16px 0',
                        overflow: 'initial',
                        padding: 24,
                        minHeight: 380,
                        background: colorBgContainer,
                    }}
                >
                    <Flex gap="large"  vertical justify='center' align='center' >
                        <Outlet />
                    </Flex>
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
    );
};
export default App;