import { EditFilled, BookFilled, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import React, { useRef, useState, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Radio, Table, Modal, Spin } from 'antd'; // Asegúrate de importar Modal de 'antd'
//import datos from '../../data/data.json'

import userService from '../../service/user'
import agendaService from '../../service/agenda'


const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
};

const MostrarPaciente = () => {
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
  };

  const getColumnSearchProps = (dataIndex) => ({
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
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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

  const columns = [

    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      width: '20%',
      ...getColumnSearchProps('nombre'),
    },
    {
      title: 'Apellido',
      dataIndex: 'apellido',
      key: 'apellido',
      width: '20%',
      ...getColumnSearchProps('apellido'),
    },
    {
      title: 'Especialidad',
      dataIndex: 'especialidad',
      key: 'especialidad',
      width: '20%',
      ...getColumnSearchProps('especialidad'),
    },
    {
      title: 'Ubicacion',
      dataIndex: 'sanatorio',
      key: 'sanatorio',
      width: '20%',
      ...getColumnSearchProps('sanatorio'),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/personal/${record._id}`}> <EditFilled /> </Link>
          <Link to={`/personal/agenda/${record._id}`}> <BookFilled /> </Link>
        </Space>
      ),
    },
  ];

  const [modalPaciente, setModalPaciente] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const medicos = await userService.getAllMedicos();

        
        const datosPromises = medicos.map(async item => {
          const { localidad, sanatorio, pref, especialidad, role, ...resto } = item;
          const agenda = await agendaService.getAgenda(item._id);
          //console.log('aa', agenda , item._id)
          return {
            ...resto,
            localidad: localidad ? localidad.provincia : '',
            sanatorio: sanatorio ? sanatorio.provincia : '',
            pref: pref ? pref.pref : '',
            especialidad: especialidad ? especialidad.value : '',
            role: role ? role.name : '',
            agenda: agenda[0]._id
          };
        });

        const datosModificados = await Promise.all(datosPromises);
        setDatos(datosModificados);
      } catch (error) {
        console.error(error);
        setIsLoading(false)
        return [];
      }
      setIsLoading(false)
    };

    fetchData().then((data) => {
      //console.log('datos:', datos)
    });

  }, []);
  //console.log('datos:', datos)

  return (
    <>
      {isLoading ? (
        <div>
          <Spin tip="Cargando listado..." size="large">
            <div className="content" />
          </Spin>
        </div>
      ) : (
        <div>
          <Table
            columns={columns}
            dataSource={(datos || []).map((record, index) => ({
              ...record,
              key: index,
            }))}
            
            pagination={{
              position: ["bottomCenter"],
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            expandable={
              (datos && datos.some(record => record.description)) ? {
                expandedRowRender: (record) => (
                  <Space size="middle">
                    {record.description}
                  </Space>
                ),
                rowExpandable: (record) => record.description !== '',
              } : null
            }
          />

          <Modal
            title="Título del Modal"
            open={modalPaciente}
            onOk={() => setModalPaciente(false)}
            onCancel={() => setModalPaciente(false)}
          >
            Contenido del Modal
          </Modal>
        </div>
      )}
    </>
  );

};

export default MostrarPaciente;
