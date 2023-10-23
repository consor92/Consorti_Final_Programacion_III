import React from 'react';
import { Descriptions } from 'antd';

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
        if ([ 'usuario'].includes(label)) {
          item.span = {
            xs: 2,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
            xxl: 2,
          };
        }

        if ([ 'genero','email', 'cobertura'].includes(label)) {
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
    const order = ['nombre', 'apellido', 'email', 'usuario', 'nacimiento', 'edad', 'pref', 'tel', 'saldo', 'genero', 'coberura','numeroAfiliado'];
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



const Paciente = ( props ) => {
  
  const data = transformData(2, datosPacientes);
console.log(data)
  return (
    <Descriptions
      title={`Datos del Paciente:   ${props.id}`} 
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
  );
};



export default Paciente;
