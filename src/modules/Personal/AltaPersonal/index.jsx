import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react';

import localidadService from '../../../service/localidades'
import especialidadService from '../../../service/especialidades'
import userService from '../../../service/user'

import {
  Button, Form,
  Cascader,
  Input,
  Select,
  Dropdown,
  DatePicker,
  notification,
} from 'antd';


const { Option } = Select;

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


  const [isState, setIsState] = useState(true)
  const [localidad, setLocalidad] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);


  const onFinish = async (fieldsValue) => {

    const {
      nacimiento,
      localidad,
      confirm,
      agreement,
      matricula,
      dni,
      especialidad,
      sanatorio,
      ...restFields
    } = fieldsValue;
    
    const values = {
      ...restFields,
      nacimiento: nacimiento.format('YYYY-MM-DD'),
      localidad: localidad[0],
      confirm: undefined,
      agreement: undefined,
      isActive: true,
      matricula: Number(matricula),
      dni: Number(dni),
      especialidad: especialidad[0],
      sanatorio: sanatorio[0],
    };


    const cleanedFormData = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== undefined && value !== null)
    );

    console.log( cleanedFormData )
    const resp = (await userService.addMedico(cleanedFormData)).status;
    setIsState(resp);
  };


  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 100,
        }}
      >
        {localidad.map((option) => (
          <Option key={option._id} value={option._id}>
            {option.pref}
          </Option>
        ))}
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

  useEffect(() => {
    const fetchData = async () => {
      try {

        const respLoc = await localidadService.getLocalidad();
        const respEsp = await especialidadService.getEspecialidades();

        setLocalidad(respLoc)
        setEspecialidades(respEsp)

      } catch (error) {
        return [];
      }
    };

    fetchData().then((data) => {
      //console.log('llamada:', persona)
    });

  }, []);

  const getProvinciaOptions = () => {
    return localidad.map((loc) => ({
      value: loc._id,
      label: loc.provincia,
    }));
  };

  const getEspecialidadesOptions = () => {
    return especialidades.map((esp) => ({
      value: esp._id,
      label: esp.value,
    }));
  };


  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    console.log( 'status' , isState )
    if (isState != 0) {

      api['success']({
        message: (isState == 200) ? 'Todo OK' : "Algo salio Mal",
        description:
          (isState == 200) ?
            'Se ah creado el usuario con los cambios descriptos' :
            (isState == 403) ?
              'NO autorizado' :
              (isState == 404) ?
                'Error 404' :
                (isState >= 500) ?
                  'Error interno del Servidor' :
                  ''
      });

      setIsState(0);
    }
  }, [isState]);

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
        scrollToFirstError
      >
        <Form.Item
          name="matricula"
          label="M.P / M.N"
          rules={[
            {
              required: true,
              message: 'Please input your nickname!'
            },
          ]}
        >
          <Input />
        </Form.Item>

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
              pattern: "^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,16}$",
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
              pattern: "^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,16}$",
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
          name="nick"
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
          name="dni"
          label="DNI"
          rules={[
            {
              pattern: /^[0-9]+$/,
              required: true
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="localidad"
          label="Habitual Residence"
          rules={[
            {
              type: 'array',
              required: true,
              message: 'Please select your habitual residence!',
            },
          ]}
        >
          <Cascader options={getProvinciaOptions()} />
        </Form.Item>

        <Form.Item
          name="tel"
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
          rules={[
            {
              type: 'number'
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="sanatorio"
          label="Hospital"
          rules={[
            {
              type: 'array',
              required: true,
              message: 'Seleccione su lugar de trabajo!',
            },
          ]}
        >
          <Cascader options={getProvinciaOptions()} />
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
          <Cascader options={getEspecialidadesOptions()} />
        </Form.Item>

        <Form.Item
          name="genero"
          label="Gender"
          rules={[
            {
              required: true,
              message: 'Please select !',
            },
          ]}
        >
          <Select placeholder="select your gender">
            <Option value="Masculino">Masculino</Option>
            <Option value="Femenino">Femenino</Option>
            <Option value="Otro">Otro</Option>
          </Select>
        </Form.Item>



        <Form.Item {...tailFormItemLayout}>

          <Button type="primary" htmlType="submit">
            Alta
          </Button>

        </Form.Item>

      </Form>

      {isState != 0 ? contextHolder : ''}
    </>
  );
};
export default AltaPersonal