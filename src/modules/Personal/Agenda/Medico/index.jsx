import { useParams } from 'react-router-dom'

function AgendaMedico() {
  const { medico } = useParams()
    return (
      <div>
        <h1>Agenda de un medico </h1>
        {medico && <h2>Type {medico}</h2>}
      </div>
    )
  }
  
  export default AgendaMedico