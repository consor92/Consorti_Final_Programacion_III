
import React from 'react';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, Flex, Spin, Space, Alert, notification } from 'antd';

import userService from '../../service/user'



function App() {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    const authData = localStorage.getItem('authData');
    const userData = localStorage.getItem('userData');

    if (authData && userData) {
      navigate('/dashboard');
    }
  })

  const onFinish = (values) => {

    const fetchData = async () => {
      setIsLoading(true)

      try {

        const response = await userService.getToken(values)

        const authData = { token: response.token };
        const userData = { user: response.user };
        localStorage.setItem('authData', JSON.stringify(authData));
        localStorage.setItem('userData', JSON.stringify(userData));

        navigate('/dashboard');
      } catch (error) {

        
        notification.error({
          message: 'Inicio de sesión erroneos',
          description: 'Usuario o password Incorrectos',
          placement: 'top'
        });


        //console.error(error);
      }
      setIsLoading(false)
    }

    fetchData()

  };

  const onFinishFailed = (errorInfo) => {
    console.error('onFailed:', errorInfo);
  };


  return (
    <>

      <Space  align="center" >
        <Flex gap="large" vertical>
          <Flex justify='center' align='flex-end'>

            {isLoading ? (
              <Spin tip="Verificando credenciales..." size="large">
                <div className="content" />
              </Spin>
            ) : (

              <Form
                name="login"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                style={{
                  maxWidth: 600,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Username"
                  name="nick"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your username!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >

                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>

                </Form.Item>
              </Form>
            )}

          </Flex>
        </Flex>
      </Space>

    </>
  )
}
export default App;