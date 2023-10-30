
import { Button, Space, Badge, Calendar, Modal } from 'antd';
import events from '../../../../data/agendas.json'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeTwoTone } from '@ant-design/icons';

import ListaTurnos from './lista'

const AgendaMedico = ({ doctorKey }) => {

  const doctorData = events.find((doctor) => doctor.key === doctorKey);

  const cellRender = (current) => {
    const fecha = current.format("YYYY-MM-DD");
    const disponibilidadDelDia = doctorData.disponibilidad.find(
      (disponibilidad) => disponibilidad.fecha === fecha
    );

    if (disponibilidadDelDia) {
      const mostrarTipo = doctorData.tags.includes("Pendiente");
      const type = mostrarTipo ? doctorData.type : disponibilidadDelDia.type;
      const description = mostrarTipo ? doctorData.descripcion : disponibilidadDelDia.descripcion;

      return (
        <ul className="events">
          <li>
            <Badge status={type} text={description} />
          </li>
        </ul>
      );
    } else {
      return null;
    }
  };


  const [modalCitas, setModalVisible] = useState(false);

  const [availabilityData, setAvailabilityData] = useState([]);

  const handleCellClick = (value) => {
    const fechaSeleccionada = value.format('YYYY-MM-DD');
    const disponibilidadDelDia = doctorData.disponibilidad.find(
      (disponibilidad) => disponibilidad.fecha === fechaSeleccionada
    );

    if (disponibilidadDelDia) {
      setAvailabilityData(disponibilidadDelDia.citas);
      setModalVisible(true);
    }
  };


  return (
    <Space wrap>
      <Calendar
        cellRender={cellRender}
        mode="month"
        onSelect={handleCellClick}
      />;

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
  )

}

export default AgendaMedico

