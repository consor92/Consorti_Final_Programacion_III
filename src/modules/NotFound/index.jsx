import { Button, Result } from 'antd'
import { useNavigate  } from 'react-router-dom';


const App = () => {

  const navigate  = useNavigate();

  const redirectToLogin = () => {
    navigate('/');
  };

  return (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary" onClick={redirectToLogin} >Back Home</Button>}
  />
  )
}

export default App