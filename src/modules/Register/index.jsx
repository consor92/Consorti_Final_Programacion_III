import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import TerminosCondiciones from './Terminos&Condiciones'


import userService from '../../service/user'
import coberturasService from '../../service/coberturas'
import localidadService from '../../service/localidades'

import {
  Button, DatePicker, Form, TimePicker, AutoComplete,
  Cascader,
  Checkbox,
  Modal,
  Input,
  Select,
  notification
} from 'antd';




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



function App() {

  const dato = useParams()


  const [isState, setIsState] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [persona, setUser] = useState([]);
  const [localidad, setLocalidad] = useState([]);
  const [cobertura, setCoberturas] = useState([]);


  const [form] = Form.useForm();



  const onFinish = async (fieldsValue) => {
    const values = {
      ...fieldsValue,
      'nacimiento': fieldsValue['nacimiento'].format('YYYY-MM-DD')
    };

    values.localidad = values.localidad[0]
    values.confirm = undefined
    values.agreement = undefined
    values.isActive = true,
      values.role = "paciente",
      values.saldo = 0


    const cleanedFormData = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== undefined && value !== null)
    );



    //console.log('Received values of form: ', cleanedFormData);

    const resp = (await userService.addUser(cleanedFormData)).status;
    setIsState(resp);
  };


  const onFinishEdit = async (values) => {

    const resp = (await userService.editarPaciente(dato.paciente, cleanedFormData)).status;

    setIsState(resp);
    //console.log('Received values of form: ', values);
  }




  const coberturaSelector = (
    <Form.Item name="cobertura" noStyle>
      <Select
        style={{
          width: '8em'
        }}
      >
        {cobertura.map((cobertura) => (
          <Option key={cobertura._id} value={cobertura._id}>
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




  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {

        const respLoc = await localidadService.getLocalidad();
        const respCobe = await coberturasService.getCobertura();

        if (dato && dato.paciente !== null && dato.paciente !== undefined && typeof dato.paciente === String) {
          const paciente = await userService.getPaciente(dato.paciente)
          const { localidad, cobertura, pref, role, ...resto } = paciente;
          const pacienteModificado = {
            ...resto,
            localidad: localidad ? localidad.provincia : '',
            cobertura: cobertura ? cobertura.value : '',
            pref: pref ? pref.pref : '',
            role: role ? role.name : '',
          };
          setUser(pacienteModificado)
        }

        setLocalidad(respLoc);
        setCoberturas(respCobe);

      } catch (error) {
        setIsLoading(false)
        return [];
      }
      setIsLoading(false)
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

  const handleFinish = (dato && dato.paciente !== null && dato.paciente !== undefined && typeof dato.paciente === String) ? onFinishEdit : onFinish;
  const handleName = (dato && dato.paciente !== null && dato.paciente !== undefined && typeof dato.paciente === String) ? "edit" : "register";


  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    //console.log( isState )
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
        name={handleName}
        onFinish={handleFinish}
        initialValues={{
          localidad: persona.localidad,
          pref: persona.pref,
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
          tooltip="What do you want others to call you?"
          initialValue={persona.apellido}
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
          rules={[
            {
              required: true,
              min: 8,
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
              min: 8,
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
          name="dni"
          label="DNI"
          initialValue={persona.dni}
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
          name="nacimiento"
          label="Fecha de Nacimiento"
          initialValue={persona.nacimiento}
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
          initialValue={persona.edad}
          rules={[
            {
              type: 'number'
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="localidad"
          label="Habitual Residence"
          initialValue={persona.localidad}
          rules={[
            {
              type: 'array'
            },
          ]}
        >
          <Cascader options={getProvinciaOptions()} />
        </Form.Item>

        <Form.Item
          name="tel"
          label="Telefono"
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
          name="genero"
          label="Genero"
          initialValue={persona.genero}
          rules={[
            {
              required: true
            },
          ]}
        >
          <Select placeholder="Genero">
            <Option value="Masculino">Masculino</Option>
            <Option value="Femenino">Femenino</Option>
            <Option value="Otro">Otro</Option>
          </Select>
        </Form.Item>



        <Form.Item
          name="numeroAfiliado"
          label="Numero Afiliado"
          initialValue={persona.numeroAfiliado}
          rules={[
            {
              pattern: /^[0-9]+$/,
              message: 'Numero de afiliacion'
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



        
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            {
              (dato && typeof dato === 'number') ?
                "Modificar" :
                "Registrar Paciente"
            }
          </Button>
        </Form.Item>

      </Form>

      {isState != 0 ? contextHolder : ''}

    </>

  );

};
export default App;


