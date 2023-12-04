import { EditFilled, BookFilled, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import React, { useRef, useState, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, Tag, Modal } from 'antd';


//import datos from '../../data/pacientes.json'
import userService from '../../service/user'
import ListaPacientes from '../Paciente/Mostrar'



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


const Pacientes = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [modalPaciente, setModalPaciente] = useState(false);


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
      title: 'Nº',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
      ...getColumnSearchProps('id'),

    },
    {
      title: 'Apellido',
      dataIndex: 'apellido',
      key: 'apellido',
      width: '20%',
      ...getColumnSearchProps('apellido'),
      render: (text, record) => (
        <Link onClick={() => setModalPaciente(true)}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      width: '20%',
      ...getColumnSearchProps('nombre'),
    },
    {
      title: 'Cobertura',
      dataIndex: 'cobertura',
      key: 'cobertura',
      width: '10%',
      ...getColumnSearchProps('cobertura'),
    },
    {
      title: 'Saldo',
      key: 'saldo',
      dataIndex: 'saldo',
      render: (_, { saldo }) => (
        <>
          {
            typeof saldo === 'number' ? (
              saldo < 0 ? (
                <Tag color="volcano" key={saldo}>
                  {"Deudor"}
                </Tag>
              ) : null
            ) : null
          }
        </>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/Paciente/Editar/${record._id}`}> <EditFilled /> </Link>
          <Link to={`/Turnos/Alta/${record._id}`}> <EditFilled /> </Link>
          <Link to={`/Turnos/ListaPorPaciente/${record._id}`}> <EditFilled /> </Link>
        </Space>
      ),
    },
  ];


  const [isLoading, setIsLoading] = useState(true)
  const [datos, setPacientes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const pacientes = await userService.getAllPacientes();


        const datosPromises = await Promise.all(pacientes.map( item => {
          const { localidad, cobertura, pref,  role, ...resto } = item;

          return {
            ...resto,
            localidad: localidad ? localidad.provincia : '',
            cobertura: cobertura ? cobertura.value : '',
            pref: pref ? pref.pref : '',
            role: role ? role.name : '',
          };
        }));

        setPacientes(datosPromises);
      } catch (error) {
        setIsLoading(false)
        return [];
      }
      setIsLoading(false)
    };

    fetchData().then((data) => {
      console.log('llamada:', datos)
    });

  }, []);




  return (

    <>

      <Modal
        open={modalPaciente}
        onOk={() => setModalPaciente(false)}
        onCancel={() => setModalPaciente(false)}
        width={"80%"}
      >

        <ListaPacientes id={2} />

      </Modal>

      <Table
        columns={columns}
        dataSource={datos.map((record, index) => ({
          ...record,
          key: index,
        }))}
        pagination={{
          position: ["bottomCenter"],
          defaultPageSize: 10,
          showQuickJumper: true,
        }}
        expandable={{
          expandedRowRender: (record) => (
            <Space size="middle">
              {record.descripcion}
            </Space>
          ),
          rowExpandable: (record) => record.descripcion !== '',
        }}
      />
    </>
  );

};
export default Pacientes;