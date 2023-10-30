import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom'
import { Button, Input, Table, Space, Tag } from 'antd';
import { EyeTwoTone, SearchOutlined } from '@ant-design/icons'
import Agenda from '../../data/agendas.json'
import dayjs from 'dayjs';




const Turnos = () => {

  const { medico } = useParams()






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






  const fechaActual = dayjs().format('YYYY-MM-DD')
  const filtrarPorFecha = (fecha) => (item) => {
    const fechaItem = dayjs(item.fecha).format('YYYY-MM-DD'); // Formatea la fecha del item
    return dayjs(fechaItem).isSame(fecha, 'day') || dayjs(fechaItem).isAfter(fecha, 'day');
  };

  /*citas ->  
    warning = turno libre  
    error   = turno pedido no se presento  
    success = turno pedido y se cumplido 
  */
  let progressiveKey = 1;
  const data = Agenda.flatMap(doctor => {
    const { matricula, nombre, apellido, especialidad, disponibilidad } = doctor;
    const formattedData = [];

    disponibilidad.forEach(item => {
      const { fecha, descripcion, citas } = item;
      const filteredCitas = citas.filter(cita => filtrarPorFecha(cita));

      filteredCitas.forEach(cita => {
        formattedData.push({
          key: progressiveKey,
          matricula,
          nombre,
          apellido,
          especialidad,
          fecha,
          descripcion,
          ...cita
        });
        progressiveKey++;
      });
    });

    return formattedData;
  });




  const [dataSource, setDataSource] = useState(data);


  const defaultColumns = [

    {
      title: 'Apellido',
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
        dataSource.length >= 1 && record.paciente !== ""
          ? (
            <Link to={`paciente/${record.paciente}`}> <EyeTwoTone /> </Link>
          ) : null,
      width: '5%',
    }
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
  });


  const actualizarData = (data) => {
    const update = dataSource.map(item =>
      item.key === data.idDia ? { ...item, citas: data.citas } : item
    )

    setDataSource(update)
  };


  return (
    <div>


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

    </div>


  );
};
export default Turnos;