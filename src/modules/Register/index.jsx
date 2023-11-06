import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import TerminosCondiciones from './Terminos&Condiciones'
import residences from '../../data/localidades.json'
import coberturasMedicas from '../../data/coberturasMedicas.json'


import {
  Button, DatePicker, Form, TimePicker, AutoComplete,
  Cascader,
  Checkbox,
  Modal,
  Input, 
  Select
} from 'antd';


const { Option } = Select;
const { RangePicker } = DatePicker;



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




const onFinish = (fieldsValue) => {
  // Should format date value before submit.
  const rangeValue = fieldsValue['range-picker'];
  const rangeTimeValue = fieldsValue['range-time-picker'];
  const values = {
    ...fieldsValue,
    'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
    'date-time-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),
    'month-picker': fieldsValue['month-picker'].format('YYYY-MM'),
    'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
    'range-time-picker': [
      rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
      rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
    ],
    'time-picker': fieldsValue['time-picker'].format('HH:mm:ss'),
  };
  console.log('Received values of form: ', values);
};





function App() {
  const [form] = Form.useForm();

  const { dato } = useParams()

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const onFinishEdit = () => {
    console.log('Received values of form: ', values);
  }

  const coberturaSelector = (
    <Form.Item name="cobertura" noStyle>
      <Select
        style={{
          width: '8em'
        }}
      >
        {coberturasMedicas.map((cobertura) => (
          <Option key={cobertura.value} value={cobertura.value}>
            {cobertura.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );


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

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const handleEdadChange = (date) => {
    const age = date ? calculateAge(date) : '';
    form.setFieldsValue({ edad: age });
  };

  const handleName = "register"
  const handleFinish = onFinish

  if (dato) {
    console.log("Dato:" + dato.paciente)
    handleFinish = (dato.paciente !== null && dato.paciente !== undefined && typeof dato.paciente === 'number') ? onFinishEdit : null
    handleName = (dato.paciente !== null && dato.paciente !== undefined && typeof dato.paciente === 'number') ? "edit" : null
  }

  return (

    <Form
      {...formItemLayout}
      form={form}
      name={handleName}
      onFinish={handleFinish}
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
        initialValue={dato}
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
            min: 8,
            pattern: "^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$",
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
            min: 8,
            pattern: "^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$",
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
        name="nacimiento"
        label="Fecha de Nacimiento"
        rules={[
          {
            type: 'object',
            required: true
          },
        ]}
      >
        <DatePicker onChange={handleEdadChange} />
      </Form.Item>

      <Form.Item
        name="edad"
        label="Edad"
        hidden
        initialValue=""
        rules={[
          {
            type: 'number'
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="residence"
        label="Localidad"
        rules={[
          {
            type: 'array',
            required: true
          },
        ]}
      >
        <Cascader options={residences} />
      </Form.Item>

      <Form.Item
        name="telefono"
        label="Telefono"
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
        name="gender"
        label="Gender"
        rules={[
          {
            required: true
          },
        ]}
      >
        <Select placeholder="Genero">
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>



      <Form.Item
        name="numeroAfiliado"
        label="Numero Afiliado"
        rules={[
          {
            type: 'number',
            required: true,
            message: 'Numero de afiliacion',
          },
        ]}
      >
        <Input
          addonBefore={coberturaSelector}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>



      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have read the <a onClick={() => {
            Modal.confirm({
              title: 'Leer',
              content: TerminosCondiciones.descripcion,
              footer: (_, { OkBtn }) => (
                <>
                  <OkBtn />
                </>
              )
            }
            )
          }
          }> Conditions </a>

        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {
            (dato !== null && dato !== undefined && typeof dato === 'number') ?
              "Registrar" :
              "Modificar"
          }
        </Button>
      </Form.Item>




    </Form>
  );
};
export default App;