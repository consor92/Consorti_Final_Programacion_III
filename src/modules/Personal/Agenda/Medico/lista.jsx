import React, { useState } from 'react';
import { Modal, List, Button, Space ,Card  } from 'antd';
import { EyeTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ListaPacientes from '../../../Paciente'



const App = ({ availabilityData }) => {
    const [modalPaciente, setModalPaciente] = useState(false);

    return (
        <>

            <List
                itemLayout="vertical"
                pagination={{
                    position: "bottomCenter",
                    aling: "center",
                    pageSize: 5,
                    defaultCurrent: 1,
                    current: 5,

                }}
                dataSource={availabilityData}
                renderItem={(item, index) => (


                    <List.Item
                        extra={
                            item.type === 'success' ? (
                                <Link to={`/Paciente/AsignarTurno/${item.idTurno}`} >
                                    <Button type="primary" style={{ backgroundColor: 'green' }} >Asignar Turno</Button>
                                </Link>
                            ) : (
                                <Space wrap>    
                                    <Link to={`/Paciente/CancelarTurno/${item.idTurno}/${item.paciente}`} >
                                        <Button type="primary" danger ghost >Cancelar Turno</Button>
                                    </Link>
                                </Space>
                            )}
                    >

                        <List.Item.Meta
                            title={<p><strong>Hora:</strong> {item.hora}</p>}
                        />
                        <Space wrap>
                            <p><strong>Consultorio:</strong> {item.consultorio}</p>
                            <p><strong>Paciente:</strong>
                                <Button type="link" onClick={() => setModalPaciente(true)}>
                                    <EyeTwoTone />
                                </Button>
                            </p>
                        </Space>


                        <Modal
                            open={false}
                            onOk={() => setModalPaciente(false)}
                            onCancel={() => setModalPaciente(false)}
                            width={"80%"}
                        >


                             <ListaPacientes id={ item.paciente }/>   
                            
                        </Modal>

                    </List.Item>


                )}
            />
        </>
    );
};

export default App;