import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, TimePicker, Modal, Flex } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons'


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





//componente, ( datos del row seleccionado) , (acceco a la funcion cerrar modal) , (tranferencia de datos al padre)   
const Horarios = ({ records, cerrar , sendDataToParent }) => {

    const data = records.citas
        .map(cita => {
            const { idRecord, ...rest } = cita;
            return { ...rest, key: idRecord };
        });


    const [dataSource, setDataSource] = useState(data);
    const [count, setCount] = useState(data.length + 1);
    const [turno, setIdTurno] = useState( data[data.length-1].idTurno + 1 );


    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const defaultColumns = [
        {
            title: 'Horarios',
            dataIndex: 'hora',
            width: '20%',
        },
        {
            title: 'Consultorio',
            dataIndex: 'consultorio',
            width: '10%',
            editable: true,
        },
        {
            title: 'Turno',
            dataIndex: 'idTurno',
            width: '10%',
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
            hora: date.format('HH:MM:ss'),
            consultorio: '999',
            idTurno: turno,
        };

        setDataSource([...dataSource, newData]);
        setCount(count + 1);
        setIdTurno(turno + 1);
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
            cerrar()

            const dataCompleta = {
                idDia: records.key, 
                citas: dataSource.map(cita => {
                  const { idRecord, ...rest } = cita;
                  return { ...rest, key: idRecord };
                })
              };

            sendDataToParent(dataCompleta);
        });
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
                < TimePicker onChange={handleDatePickerChange} />
            </Modal>
            <Button onClick={handleAdd} type="primary">
                +
            </Button>

            <Form
                form={form}
                name={"editarHorarios"}
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
                        defaultPageSize: 8,
                        showQuickJumper: true,
                    }}
                />
                <Flex justify={'flex-end'} align={'center'}>
                    <Button htmlType='submit' type="primary" >
                        Guardar Cambios
                    </Button>
                </Flex>
            </Form>

            <Modal
                open={modalVisible}
                onOk={handleHideModalHorarios}
            >

            </Modal>
        </div>


    );
};
export default Horarios;