import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Button, Form, Input, Popconfirm, Table, DatePicker, Modal } from 'antd';
import { EyeTwoTone, DeleteTwoTone } from '@ant-design/icons'
import Agenda from '../../../../data/agendas.json'
import dayjs from 'dayjs';

import Horarios from './horarios'

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};


const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};





const AltaPaciente = () => {

  const { medico } = useParams()

  const fechaActual = dayjs();
  const filtrarPorFecha = (fecha) => (item) => dayjs(item.fecha).isAfter(fecha, 'day') || dayjs(item.fecha).isSame(fecha, 'day');

  const data = Agenda
    .filter((item) => {
      const fechaFiltrada = filtrarPorFecha( fechaActual );
      return String(item.matricula) === String(medico) && fechaFiltrada(item);
    })
    .map(item => ({
      ...item,
      key: item.matricula, // Cambiar 'matricula' por 'key'
      matricula: undefined, // O puedes eliminar 'matricula' si no lo necesitas
      disponibilidad: item.disponibilidad.map(disp => ({
        ...disp,
        key: disp.idDia, // Reemplazar 'idDia' por 'key'
        idDia: undefined // Eliminar 'idDia'
      }))
    }))
    .map(item => item.disponibilidad)
    .flat();


  const [dataSource, setDataSource] = useState(data);
  const [count, setCount] = useState(data.length + 1);





  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      width: '20%',
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      width: '10%',
      editable: true,
    },
    {
      title: 'Descripcion',
      dataIndex: 'descripcion',
      width: '20%',
      editable: true,
    },
    {
      title: 'Citas',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Button type="link" onClick={() => handleShowModalHorarios(record)}>
            <EyeTwoTone />
          </Button>
        ) : null,
      width: '5%',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Seguro que desea eliminar este registro?" onConfirm={() => handleDelete(record.key)}>
            <DeleteTwoTone />
          </Popconfirm>
        ) : null,
      width: '5%'
    },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [Record, setSelectedRecord] = useState(null);

  const handleShowModalHorarios = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleHideModalHorarios = () => {
    setModalVisible(false);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);


  const handleModalCancel = () => {
    setIsModalVisible(false);

  };


  const handleDatePickerChange = (date, dateString) => {
    setIsModalVisible(false);

    const newData = {
      key: count,
      fecha: date.format('YYYY-MM-DD'),
      descripcion: 'Hay turnos',
      type: 'success',
    };

    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };



  const handleAdd = () => {
    setIsModalVisible(true);
  };


  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),


    };
  });

  const [form] = Form.useForm();
  const onSave = (values) => {
    form.validateFields().then(values => {
      console.log(dataSource);
    });
  };

  //recibir datos del componente hijo
  const handleDataFromChild = (data) => {
    // Aquí puedes usar los datos recibidos desde el hijo
    //console.log('Datos recibidos en el padre:', data);
    //console.log('VIEJO:', dataSource);

    actualizarData(data);


    console.log('NUEVO:', dataSource);
  };


  const actualizarData = (data) => {
    const update = dataSource.map(item =>
      item.key === data.idDia ? { ...item, citas: data.citas } : item
    )

    setDataSource(update)
  };


  return (
    <div>

      <Modal
        title="Seleccione una fecha"
        open={isModalVisible}
        onCancel={handleModalCancel}
        destroyOnClose
        maskClosable={false}
      >
        <DatePicker format="YYYY-MM-DD" onChange={handleDatePickerChange} />
      </Modal>
      <Button onClick={handleAdd} type="primary">
        Agregar Dia
      </Button>

      <Form
        form={form}
        name={"editarDiasHorarios"}
        onFinish={onSave}
      >

        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={{
            position: ["bottomCenter"],
            defaultPageSize: 10,
            showQuickJumper: true,
          }}
        />

        <Button htmlType='submit' type="primary">
          Guardar Cambios
        </Button>
      </Form>

      <Modal
        width={'80%'}
        closable={false}
        open={modalVisible}
        onCancel={handleHideModalHorarios}
        footer=""
      >
        {Record &&
          <Horarios records={Record} cerrar={handleHideModalHorarios} sendDataToParent={handleDataFromChild} />
        }
      </Modal>
    </div>


  );
};
export default AltaPaciente;