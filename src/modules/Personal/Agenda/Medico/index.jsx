
import { Button, Space, Badge, Calendar, Modal , List } from 'antd';
import events from '../../../../data/agendas.json'
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EyeTwoTone } from '@ant-design/icons';

import agendaService from '../../../../service/agenda'

import ListaTurnos from './lista'

const AgendaMedico = () => {

  const  medico  = useParams()

  //const doctorData = events.find((doctor) => doctor.key === doctorKey);

  const [isLoading, setIsLoading] = useState(true)
  const [doctorData, setAgenda] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await agendaService.getAgenda(medico.medico);
        setAgenda(response[0]);
      } catch (error) {
        console.error(error);
        setIsLoading(false)
        return [];
      }
      setIsLoading(false)
    };

    fetchData().then((data) => {
      //console.log('datos:', disponibilidadDelDia)
    });

  }, []);




  const cellRender = (current) => {
    const fecha = current.format("YYYY-MM-DD");

    if (doctorData && Array.isArray(doctorData.disponibilidad)) {
      const disponibilidadDelDia = doctorData.disponibilidad.find(
        (d) => new Date(d.fecha).toISOString().split('T')[0] === fecha
      );

      if (disponibilidadDelDia) {
        const mostrarTipo = doctorData.tags.includes("Pendiente");
        const type = mostrarTipo ? doctorData.type : disponibilidadDelDia.type;
        const description = mostrarTipo ? doctorData.descripcion : disponibilidadDelDia.descripcion;

        return (
          <List className="events">
            <List.Item>
              <Badge status={type} text={description} />
            </List.Item>
          </List>

        )

      } else {
        return null;
      }
    }
  };


  const [modalCitas, setModalVisible] = useState(false);

  const [availabilityData, setAvailabilityData] = useState([]);

  const handleCellClick = (value) => {
    const fechaSeleccionada = value.format('YYYY-MM-DD');
    const disponibilidadDelDia = doctorData.disponibilidad.find(

      (disponibilidad) =>  new Date(disponibilidad.fecha).toISOString().split('T')[0] === fechaSeleccionada
    );

    if (disponibilidadDelDia) {
      setAvailabilityData(disponibilidadDelDia.citas);
      setModalVisible(true);
    }
  };


  return (
    <>

      <Space wrap>
        <Calendar
          cellRender={cellRender}
          mode="month"
          onSelect={handleCellClick}
        />

        <Modal
          title={`Información de Disponibilidad - Fecha: ${availabilityData[0]?.fecha || ''}`}
          open={modalCitas}
          onOk={() => setModalVisible(false)}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <ListaTurnos availabilityData={availabilityData} />

        </Modal>


      </Space>

    </>
  )
}

export default AgendaMedico

