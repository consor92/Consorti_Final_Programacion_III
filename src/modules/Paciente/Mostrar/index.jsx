import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom'
import { Descriptions, Space, Table, Input, Button, Tag } from 'antd';
import { EyeTwoTone, SearchOutlined } from '@ant-design/icons'

import Agenda from '../../../data/agendas.json'
import datosPacientes from '../../../data/pacientes.json'


const labels = Object.keys(datosPacientes[0]);
labels.splice(9, 0, ...Object.keys(datosPacientes[0]["antecedentes"][0]));
labels.splice(18, 0, ...Object.keys(datosPacientes[0]["HistoriaClinica"][0]));


const getPatientDataById = (id, patientData) => {
  return patientData.find((patient) => patient.id === id);
};


const transformData = (id, patientData) => {
  const patient = getPatientDataById(id, patientData);

  const transformItem = (data) => {
    const sortedItems = [];

    for (const label in data) {
      if (label === 'pass') {
        continue; // No incluir la propiedad 'pass' en el resultado
      }

      const childData = data[label];

      if (Array.isArray(childData)) {
        if (childData.length > 0) {
          sortedItems.push({
            label: label,
            children: childData.map((item) => {
              if (Array.isArray(item)) {
                return item.join('/');
              }
              return transformItem(item);
            }),
          });
        }
      } else if (typeof childData === 'object') {
        sortedItems.push({
          label: label,
          children: transformItem(childData),
        });
      } else {
        const item = {
          label: label,
          children: childData,
        };

        // Agregar la propiedad "span" a etiquetas específicas
        if (['usuario'].includes(label)) {
          item.span = {
            xs: 2,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
            xxl: 2,
          };
        }

        if (['genero', 'email', 'cobertura'].includes(label)) {
          item.span = {
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 2,
            xxl: 2,
          };
        }

        sortedItems.push(item);
      }
    }

    // Ordenar el array final según el orden especificado
    const order = ['nombre', 'apellido', 'email', 'usuario', 'nacimiento', 'edad', 'pref', 'tel', 'saldo', 'genero', 'coberura', 'numeroAfiliado'];
    const orderedItems = order.map((label) => sortedItems.find((item) => item.label === label));

    return orderedItems;
  };

  if (patient) {
    return transformItem(patient);
  }

  return null; // Retorna null si no se encontró un paciente con el ID especificado.
};

const transformedData = transformData(2, datosPacientes);
//console.log(transformedData);











const Paciente = (  ) => {
  
  const { paciente } = useParams()


  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  }

  const getColumnSearchProps = (dataIndex) => (
    {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (

        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />

          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? '#1677ff' : undefined,
          }}
        />
      ),
      onFilter: (value, record) => {
        console.log("data:" + dataIndex)
        if (dataIndex === 'type') {
          const convertedValue =
            record[dataIndex] === 'warning'
              ? 'Libre'
              : record[dataIndex] === 'error'
                ? 'Ausente'
                : record[dataIndex] === 'success'
                  ? 'Se Presento'
                  : '';

          convertedValue.toLowerCase().includes(value.toLowerCase());
        }
        else {
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        }
      },
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: '#ffc069',
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });






    let keyCounter = 1; 
    const datos = Agenda.flatMap(medico => (
      medico.disponibilidad.flatMap(dia => (
        dia.citas.filter(cita => cita.paciente === 2)
      ))
    )).map(cita => {
      const medicoInfo = Agenda.find(medico => medico.key === cita.idRecord);
      const fechaCita = cita.fecha; // Fecha en formato "YYYY-MM-DD" dentro de disponibilidad
    
      // Obtener la fecha de la cita y verificar si es un string válido
      const fechaFormateada = new Date(fechaCita).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
    
      return {
        key: keyCounter++,
        nombre: medicoInfo.nombre,
        apellido: medicoInfo.apellido,
        especialidad: medicoInfo.especialidad,
        fecha: fechaFormateada,
        hora: cita.hora,
        idTurno: cita.idTurno,
        consultorio: cita.consultorio,
        type: cita.type,
        paciente: cita.paciente
      };
    });

  const [dataSource, setDataSource] = useState(datos);
console.log(dataSource)



  const defaultColumns = [

    {
      title: 'Profecional',
      dataIndex: 'apellido',
      width: '15%',
      ...getColumnSearchProps('apellido'),
      render: (text, record) => {
        return record.nombre + ' ' + record.apellido;
      },
    },
    {
      title: 'Especialidad',
      dataIndex: 'especialidad',
      width: '10%',
      ...getColumnSearchProps('especialidad'),
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      width: '10%',
      ...getColumnSearchProps('fecha'),
    },
    {
      title: 'Hora',
      dataIndex: 'hora',
      width: '10%',
    },
    {
      title: 'Consultorio',
      dataIndex: 'consultorio',
      width: '10%',
    },
    //warning
    //success
    //error
    {
      title: 'Estado',
      key: 'type',
      dataIndex: 'type',
      width: '5%',
      ...getColumnSearchProps('type'),
      render: (_, record) => {
        let color = record.type === 'success' ? 'green' : 'geekblue';
        if (record.type === 'error') {
          color = 'volcano';
        }
        return (
          <Tag color={color} key={record.type}>
            {
              record.type === 'warning' ? 'Libre' : record.type === 'error' ? 'Ausente' : record.type === 'success' ? 'Se Presento' : ''
            }
          </Tag>
        );
      },
    },
    {
      title: 'Citas',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 && record.type === "free"
          ? (
            <Link to={`/turnos/cancelar/${record.idTurno}`}> <EyeTwoTone /> </Link>
          ) : null,
      width: '5%',
    }
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
  });

  const data = transformData(2, datosPacientes);

  return (
    <>
      <Space direction='vertical' size={100} style={ {display:'flex'} }> 
        <Descriptions
          title={`Datos del Paciente:   ${paciente}`}
          bordered
          column={{
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 2,
            xxl: 2,
          }}
        >
          {data.map((item, index) => (
            <Descriptions.Item label={item?.label} span={item?.span} key={index}>
              {Array.isArray(item?.children) ? (
                item.children.map((child, childIndex) => (
                  <Descriptions.Item label={child?.label} span={child?.span} key={childIndex}>
                    {child?.children}
                  </Descriptions.Item>
                ))
              ) : (
                item?.children
              )}
            </Descriptions.Item>
          ))}
        </Descriptions>

        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={{
            position: ["bottomCenter"],
            defaultPageSize: 10,
            showQuickJumper: true,
          }}
        />

      </Space>

    </>
  );
};



export default Paciente;
