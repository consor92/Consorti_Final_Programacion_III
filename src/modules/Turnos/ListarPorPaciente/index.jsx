import { useParams } from 'react-router-dom'

function ListarPorPacientes() {

  const { paciente } = useParams()
    return (
      <div>
        <h1>Turnos de un paciente</h1>
        {paciente && <h2>Type {paciente}</h2>}
      </div>
    )
  }
  
  export default ListarPorPacientes