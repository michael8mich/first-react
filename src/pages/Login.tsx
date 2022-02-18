import { Card, Layout, Row } from 'antd';
import  {FC, useEffect} from 'react';
import { TOKEN } from '../axios/axios';
import LoginForm from '../components/LoginForm';
import { useAction } from '../hooks/useAction';

const Login:FC = () => {
  const {logout} = useAction()
  useEffect(  ()  => {
    if(TOKEN.token)
    logout()
  }, [])
  return (
    <Layout>
      <Row justify="center" align="middle" className="h100">
       <Card>
           <LoginForm/>
       </Card>
      </Row>
    </Layout>
  )
}
export default Login;