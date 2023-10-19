import { useParams } from 'react-router-dom'

function EditarPersonal() {
  const { personal } = useParams()
    return (
      <div>
        <h1>Editar Personal </h1>
        {personal && <h2>Type {personal}</h2>}
      </div>
    )
  }
  
  export default EditarPersonal