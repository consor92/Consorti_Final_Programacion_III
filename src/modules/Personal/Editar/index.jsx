
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'
//import persona from '../../../data/persona.json'
import medicoService from '../../../service/medico'
import especialidadService from '../../../service/especialidades'
import localidadService from '../../../service/localidades'
import agendaService from '../../../service/agenda'

import {
  Button, DatePicker, Form, TimePicker, AutoComplete,
  Cascader,
  Checkbox,
  Modal,
  Input,
  Dropdown,
  Space,
  Select,
  Spin
} from 'antd';


const { Option } = Select;


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

  const onFinish = async (values) => {
    const cleanedFormData = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== undefined && value !== null)
    );
    cleanedFormData.localidad = cleanedFormData.localidad[0]
    cleanedFormData.sanatorio = cleanedFormData.sanatorio[0]

    console.log('Form: ', cleanedFormData);

    const resp = await medicoService.editMedico(Number(personal), cleanedFormData);

  };


  const [isLoading, setIsLoading] = useState(true)
  const [persona, setMedico] = useState([]);
  const [localidad, setLocalidad] = useState([]);
  const [especialidad, setEspecialidad] = useState([]);


  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 100,
        }}
      >
        {localidad.map((option) => (
          <Option key={option.pref} value={option.pref}>
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
        const medico = await medicoService.getMedico(personal);
        console.log('m',medico)
        const respLoc = await localidadService.getLocalidad();
        const respEsp = await especialidadService.getEspecialidades();

        const agenda = await agendaService.getAgenda(medico._id);

        medico.agendaId = agenda[0]._id;

        setMedico(medico);
        setLocalidad(respLoc);
        setEspecialidad(respEsp);

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



  return (
    <>

      {isLoading ? (
        <div>
          <Spin tip="Cargando listado..." size="large">
            <div className="content" />
          </Spin>
        </div>
      ) : (
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            prefix: persona.pref
          }}
          style={{
            maxWidth: 600,
          }}
          scrollToFirstError
        >
          <Form.Item
            name="matricula"
            label="Matricula"
            initialValue={persona.matricula}
            rules={[
              { type: 'number' }
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="nombre"
            label="Nombre"
            tooltip="What do you want others to call you?"
            initialValue={persona.nombre}
            rules={[
              {
                message: 'Please input your nickname!',
                whitespace: true,
              },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="apellido"
            label="Apellido"
            initialValue={persona.apellido}
            tooltip="What do you want others to call you?"
            rules={[
              {
                message: 'Please input your nickname!',
                whitespace: true,
              },
            ]}
          >
            <Input disabled />
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
                message: 'Please input your nickname!',
                whitespace: true,
              },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="localidad"
            label="Habitual Residence"
            initialValue={persona.localidad.provincia}
            rules={[
              {
                type: 'array'

              },
            ]}
          >
            <Cascader options={getProvinciaOptions()} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            initialValue={persona.tel}
            rules={[
              {
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
                type: 'array'
              },
            ]}
          >
            <Cascader options={getProvinciaOptions()} />
          </Form.Item>

          <Form.Item
            name="especialidad"
            label="Especialidad"
            initialValue={persona.especialidad}
            rules={[
              {
                message: 'Please select your habitual residence!',
              },
            ]}
          >
            <Select placeholder="select your gender">
              {especialidad.map((option) => (
                <Option key={option._id} value={option._id}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            initialValue={persona.genero}
            rules={[
              {
                message: 'Please select gender!',
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
            <Space wrap>
              <Button type="primary" htmlType="submit"  >
                Editar
              </Button>

              <Link to={`/personal/Agenda/${persona._id}`}>
                <Button type="primary"  >
                  Agenda
                </Button>
              </Link>

            </Space>
          </Form.Item>



        </Form>
      )}

    </>
  )
}

export default EditarPersonal