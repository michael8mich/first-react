import { Card, Layout, Row } from 'antd';
import React, {FC, useEffect} from 'react';
import { TOKEN } from '../axios/axios';
import LoginForm from '../components/LoginForm';
import { useAction } from '../hooks/useAction';
import { useTypedSelector } from '../hooks/useTypedSelector';

const Login:FC = () => {
  const {isAuth} = useTypedSelector(state => state.auth)
  const {login,logout} = useAction()
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