import { Link } from 'react-router-dom'
import React, { useState } from 'react';

import {
  Button, Form,
  Cascader,
  Input,
  Select,
  Dropdown,
} from 'antd';

const { Option } = Select;
const especialidades = [
  {
    valor: 'cardiologia',
    label: 'Cardiologia2',
    children: []
  },
  {
    valor: 'general',
    label: 'General2',
    children: []
  },
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
    value: 'Argentina1',
    label: 'Argentina',
    children: [
      {
        value: 'Buenos Aires2',
        label: 'Buenos Aires',
        children: [
          {
            value: 'CABA',
            label: 'CABA',
          }
        ],
      },
      {
        value: 'Cordoba3',
        label: 'Cordoba',
        children: [
          {
            value: 'Cordoba4',
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




function AltaPersonal() {
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
        residence: ['Buenos Aires', 'Cordoba', 'Mendoza'],
        prefix: '54',
      }}
      style={{
        maxWidth: 600,
      }}
      scrollToFirstError
    >

      <Form.Item
        name="nombre"
        label="Nombre"
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
        name="apellido"
        label="Apellido"
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
        rules={[
          {
            required: true,
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
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
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
        name="hospital"
        label="Hospital"
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
        rules={[
          {
            required: true,
            message: 'Please select !',
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

        <Button type="primary" htmlType="submit">
          Alta
        </Button>

      </Form.Item>




    </Form>
  );
};
export default AltaPersonal