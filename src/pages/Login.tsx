import { Card, Layout, Row } from 'antd';
import React, {FC} from 'react';
import LoginForm from '../components/LoginForm';
import { useTypedSelector } from '../hooks/useTypedSelector';

const Login:FC = () => {
  const {isAuth} = useTypedSelector(state => state.auth)
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