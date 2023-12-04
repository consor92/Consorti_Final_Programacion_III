import { EditFilled, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import React, { useRef, useState, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, Tag } from 'antd';

//import datos from '../../../data/agendas.json'
import agendaService from '../../../service/agenda';


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


const Agenda = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);


  const [isLoading, setIsLoading] = useState(true)
  const [datos, setAgenda] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await agendaService.getAllAgendas();

        setAgenda(response);
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

  const getColorForTag = (tag) => {
    if (tag.length > 9) {
      return 'green';
    } else if (tag === 'Cancelada') {
      return 'volcano';
    } else {
      return 'geekblue';
    }
  };

  const columns = [
    {
      title: 'Apellido',
      dataIndex: 'apellido',
      key: 'apellido',
      width: '20%',
      ...getColumnSearchProps('apellido'),
      render: (_, record) => <Link to={`/personal/${record.idUser}`}> {record.apellido} </Link>
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      width: '20%',
      ...getColumnSearchProps('nombre'),
    },
    {
      title: 'Especialidad',
      dataIndex: 'especialidad',
      key: 'especialidad',
      width: '20%',
      ...getColumnSearchProps('especialidad'),
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      width: '10%',
      ...getColumnSearchProps('fecha'),
    },
    Table.EXPAND_COLUMN,
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {Array.isArray(tags) ? (
            // Si tags es un array
            tags.map((tag) => (
              <Tag color={getColorForTag(tag)} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            ))
          ) : (
            // Si tags es una cadena
            <Tag color={getColorForTag(tags)} key={tags}>
              {tags.toUpperCase()}
            </Tag>
          )}
        </>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/personal/Agenda/${record.idUser}`}> <EditFilled /> </Link>
        </Space>
      ),
    },
  ];



  return <Table
    columns={columns}
    dataSource={datos}
    pagination={{
      position: ["bottomCenter"],
      defaultPageSize: 10,
      showQuickJumper: true,
    }}
    expandable={{
      expandedRowRender: (record) => (
        <Space size="middle">
          <p>
            {record.descripcion}
          </p>
        </Space>
      ),
      rowExpandable: (record) => record.description !== '',
    }}
  />;

};
export default Agenda;