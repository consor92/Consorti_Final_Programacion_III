import { EditFilled , BookFilled , SearchOutlined} from '@ant-design/icons';
import { Link } from 'react-router-dom'
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Radio, Table } from 'antd';
import datos from '../../data/data.json'



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


const App = () => {
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
      title: 'Matricula',
      dataIndex: 'matricula',
      key: 'matricula',
      width: '10%',
      ...getColumnSearchProps('matricula'),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Especialidad',
      dataIndex: 'especialidad',
      key: 'especialidad',
      width: '20%',
      ...getColumnSearchProps('especialidad'),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      render: (_,record) => (
        <Space size="middle">
          
          <Link to={`/personal/${record.matricula}`}> <EditFilled /> </Link> 
          <Link to="/personal/agenda/4"> <BookFilled /> </Link>
        </Space>
      ),
    },
  ];


  
  return <Table
    columns={columns}
    dataSource={datos}
    rowSelection={{
      type: 'radio',
      ...rowSelection,
    }}
    pagination={{
      position: [ "bottomCenter"],
      defaultPageSize: 10, 
      showQuickJumper: true,
    }}
    expandable={{
      expandedRowRender: (record) => (
        <Space size="middle">
          {record.description}
        </Space>
      ),
      rowExpandable: (record) => record.name !== 'Not Expandable',
    }}
  />;

};
export default App;