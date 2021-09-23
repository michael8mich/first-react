import {Form, Input, Checkbox, Button}  from 'antd';
import React, {FC} from 'react';
import { useDispatch } from 'react-redux';
import { AuthActionCreators } from '../store/reducers/auth/action-creators';


const LoginForm: FC = () => {
  const dispatch =  useDispatch()
  const onFinish = (values: any) => {
    console.log('Success:', values);
    debugger
    dispatch(AuthActionCreators.login(values.username, values.password ))

    //const where = ` login = '${values.username.value}' and password = '${values.password.value}' `
    //const response = await  axiosFn("get", '', '*', 'contact', where , ''  )  
      
  //     let hasError = false;
  //     if(response.data["error"]) hasError = true;
  //     if(!hasError) {
  //       if(response.data.length !== 0)  
  //       {
  //           setIsAuth(true) 
  //           localStorage.setItem('isAuth', 'true')  
  //       } else
  //       {
  //           setLoginError("Username or Password Incorrect")
  //       }   
  //      }
  //      else
  //      {
  //       setLoginError("Login Problem")
  //       console.log('error:',response.data["error"] )
  //      }
       
  // })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
    return (
      <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    )
  }
  
  
  export default LoginForm;