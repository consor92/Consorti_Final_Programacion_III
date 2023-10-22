
import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import persona from '../../../data/persona.json'

import {
  Button, DatePicker, Form, TimePicker, AutoComplete,
  Cascader,
  Checkbox,
  Modal,
  Input,
  Dropdown,
  Space ,
  Select
} from 'antd';


const { Option } = Select;
const especialidades = [
  {
    valor: 'cardiologia',
    label: 'Cardiologia2'
  },
  {
    valor: 'general',
    label: 'General2'
  }
];

const residences = [
  {
    value: 'Argentina',
    label: 'Argentina',
    children: [
      {
        value: 'Buenos Aires',
        label: 'Buenos Aires',
        children: [
          {
            value: 'CABA',
            label: 'CABA',
          }
        ],
      },
      {
        value: 'Cordoba',
        label: 'Cordoba',
        children: [
          {
            value: 'Cordoba',
            label: 'Cordoba',
          }
        ]
      }
    ],
  }
];

const sanatorio = [
  {
    value: 'Argentina',
    label: 'Argentina',
    children: [
      {
        value: 'Buenos Aires',
        label: 'Buenos Aires',
        children: [
          {
            value: 'CABA',
            label: 'CABA',
          }
        ],
      },
      {
        value: 'Cordoba',
        label: 'Cordoba',
        children: [
          {
            value: 'Cordoba',
            label: 'Cordoba',
          }
        ]
      }
    ],
  }
];

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const items = [{ key: '1', label: 'Agenda' }];

function EditarPersonal() {
  const { personal } = useParams()

  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };


  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="54">+54</Option>
      </Select>
    </Form.Item>
  );



  return (


    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        prefix: '54'
      }}
      style={{
        maxWidth: 600,
      }}
      scrollToFirstError
    >
      <Form.Item
        name="id"
        label="Id"
        initialValue={personal}
        hidden
        rules={[
          {
            type: 'number'
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="nombre"
        label="Nombre"
        tooltip="What do you want others to call you?"
        initialValue={persona.nombre}
        rules={[
          {
            required: true,
            message: 'Please input your nickname!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="apellido"
        label="Apellido"
        initialValue={persona.apellido}
        tooltip="What do you want others to call you?"
        rules={[
          {
            required: true,
            message: 'Please input your nickname!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="E-mail"
        initialValue={persona.email}
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        initialValue={persona.pass}
        rules={[
          {
            required: true,
            min: 8,
            //pattern: "^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$",
            message: "La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula. Puede tener otros símbolos.",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        initialValue={persona.pass}
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            min: 8,
            //pattern: "^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$",
            message: "La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula. Puede tener otros símbolos.",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('No coinciden.'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="nickname"
        label="Nickname"
        initialValue={persona.nick}
        tooltip="What do you want others to call you?"
        rules={[
          {
            required: true,
            message: 'Please input your nickname!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="residence"
        label="Habitual Residence"
        initialValue={persona.localidad}
        rules={[
          {
            type: 'array',
            required: true,
            message: 'Please select your habitual residence!',
          },
        ]}
      >
        <Cascader options={residences} />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        initialValue={persona.tel}
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item
        name="sanatorio"
        label="Sanatorio"
        initialValue={persona.sanatorio}
        rules={[
          {
            type: 'array',
            required: true,
            message: 'Seleccione su lugar de trabajo!',
          },
        ]}
      >
        <Cascader options={sanatorio} />
      </Form.Item>

      <Form.Item
        name="especialidad"
        label="Especialidad"
        initialValue={persona.especialidad}
        rules={[
          {
            required: true,
            message: 'Please select your habitual residence!',
          },
        ]}
      >
        <Select placeholder="select your gender">
          <Option value="General">General</Option>
          <Option value="Cardiologia">Cardiologia</Option>
          <Option value="Pediatria">Pediatria</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gender"
        initialValue={persona.genero}
        rules={[
          {
            required: true,
            message: 'Please select gender!',
          },
        ]}
      >
        <Select placeholder="select your gender">
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Space wrap>
          <Button type="primary" htmlType="submit"  >
            Editar
          </Button>

          <Dropdown.Button
            menu={{
              items,
              onClick: (e) => {
                {
                  <Link to={`/personal/Agenda/${e.key}`}>  </Link>
                }
              }
            }}
          >
            Mas
          </Dropdown.Button>
        </Space>
      </Form.Item>



    </Form>


  )
}

export default EditarPersonal