import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Button, Form, Input, Popconfirm, Table, DatePicker, Modal } from 'antd';
import { EyeTwoTone, DeleteTwoTone } from '@ant-design/icons'

import agendaService from '../../../../service/agenda';
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

  const medico = useParams()

  const fechaActual = dayjs();
  const filtrarPorFecha = (fecha) => (item) => dayjs(item.fecha).isAfter(fecha, 'day') || dayjs(item.fecha).isSame(fecha, 'day');


  const [isLoading, setIsLoading] = useState(true)
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(0);
  const [ultimoTurno, setUltimoTurno] = useState(0);
  const [ultimoDia, setUltimoDia] = useState(0);


  const transformarAgenda = (agenda) => {
    const nuevaEstructura = [];

    if (!agenda || !agenda.disponibilidad) {
      return nuevaEstructura;
    }

    agenda.disponibilidad.forEach((dia, index) => {
      const citasTransformadas = dia.citas.map(cita => ({
        idRecord: cita.idRecord,
        idTurno: cita.idTurno,
        hora: new Date(cita.hora).toLocaleTimeString(),
        consultorio: cita.consultorio,
        paciente: cita.paciente || "",
        type: cita.type
      }));

      nuevaEstructura.push({
        idDia: dia.idDia,
        fecha: new Date(dia.fecha).toISOString().split('T')[0],
        type: dia.type,
        descripcion: dia.descripcion,
        citas: citasTransformadas,
        key: index + 1
      });
    });

    return nuevaEstructura;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const agenda = await agendaService.getAgenda(medico.medico);
        const turnoDisp = await agendaService.getTurnos();
        const diasDisp = await agendaService.getDias();

        const maxTurno = turnoDisp ? turnoDisp.reduce((maxIdTurno, turno) => {
          return Math.max(maxIdTurno, turno.idTurno);
        }, 0) : 0;

        const maxDia = diasDisp.reduce((maxIdDia, dia) => {
          return dia.idDia > maxIdDia ? dia.idDia : maxIdDia;
        }, 0);

        const transformedData = transformarAgenda(agenda[0]);

        setDataSource(transformedData);
        setCount(dataSource.length + 1)
        setUltimoTurno(maxTurno + 1)
        setUltimoDia(maxDia + 1)

      } catch (error) {
        console.error(error);
        setIsLoading(false)
        return [];
      } finally {
        setIsLoading(false);
      }
    };

    fetchData().then((data) => {
      //console.log('datos:', agendaData)
    });

  }, [medico.medico]);

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns = [

    {
      title: 'idDia',
      dataIndex: 'idDia',
      width: '20%',
    },
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
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <>
            <Button type="link" onClick={() => handleShowModalHorarios(record)}>
              <EyeTwoTone />
            </Button>

            <Popconfirm title="Seguro que desea eliminar este registro?" onConfirm={() => handleDelete(record.key)}>
              <DeleteTwoTone />
            </Popconfirm>
          </>
        ) : null,
      width: '5%'
    },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [Record, setSelectedRecord] = useState(null);

  const handleShowModalHorarios = (record) => {

    setSelectedRecord({ ...record, turnoDisponible: ultimoTurno });
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
      key: dataSource.length + 1,
      idDia: ultimoDia,
      fecha: date.format('YYYY-MM-DD'),
      descripcion: 'Hay turnos',
      type: 'success',
    };

    setUltimoDia(ultimoDia + 1)
    setDataSource([...dataSource, newData]);
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

  const columns = defaultColumns
    //.filter((col) => col.dataIndex !== 'idDia') // Filtrar la columna idDia
    .map((col) => {
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


  //cada dia agregado hya que agregarlo al array de agenda disponibilidad.citas
  async function editar(cita) {
    console.log('cita:', cita , 'Actual:' , medico.medico )

    //let turnoDisp 
    let diasDisp

    try {
      const diaExistente = await agendaService.getDiaById(cita.idDia);

      if (!diaExistente || diaExistente.length <= 0) {

        const resultadoAgregarTurnos = await agregarTurnos(cita) ;
        console.log('id',resultadoAgregarTurnos)
        cita.citas = { id: [ resultadoAgregarTurnos ] };

        diasDisp = await agendaService.addDia(cita);
        diasDisp = await agendaService.editAgenda(medico.medico , { disponibilidad: { id_dias: [diasDisp._id] } });

        console.log('Dia-add:', diasDisp._id);
      } else {
        /*
        cita.type = cita.type_dia
        diasDisp = await agendaService.editDia(cita.idDia, cita);
        console.log('Cita-up:', diasDisp._id);
        */
      }
      //diasDisp = diasDisp._id

    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }

  }


  async function agregarTurnos(cita) {
    let turnoDisp

    const turnoExistente = await agendaService.getTurnoById(cita.idTurno);

    //  Agrego o modifico el TURNO
    if (!turnoExistente || turnoExistente.length <= 0) {
      turnoDisp = await agendaService.addTurno(cita);
      console.log('Cita-add:', turnoDisp._id);
    } else {
      turnoDisp = await agendaService.editTurno(cita.idTurno, cita);
      console.log('Cita-up:', turnoDisp._id);
    }
    turnoDisp = turnoDisp._id

    return turnoDisp
  }


  const [form] = Form.useForm();
  const onSave = (values) => {



    form.validateFields().then(values => {


      const citasArray = dataSource.reduce((accumulator, currentDia) => {
        if (currentDia.citas) {
          const citasConFechaHora = currentDia.citas.map(cita => ({
            ...cita,
            idDia: currentDia.idDia,
            descripcion: currentDia.descripcion,
            fecha: currentDia.fecha,
            type_dia: currentDia.type,
            hora: `${currentDia.fecha}T${cita.hora}`,
          }));

          accumulator.push(...citasConFechaHora);
        }
        return accumulator;
      }, []);

      console.log(citasArray)

      citasArray.forEach(cita => editar(cita));


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