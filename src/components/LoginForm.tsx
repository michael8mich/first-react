import {Form, Input, Checkbox, Button}  from 'antd';
import  {FC} from 'react';
import { useAction } from '../hooks/useAction';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { UnlockOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';

const LoginForm: FC = () => {
  const { t, i18n } = useTranslation();      
  const {error, isLoading, user } = useTypedSelector(state => state.auth)
  const {login} = useAction()
  const [form] = Form.useForm()
  const onFinish =  (values: any) => {
    console.log('Success:', values);
    login(values.username, values.password )
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
    return (
      <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {error && <div style={{color: 'red'}}>
        {error}
        </div>}
      <Form.Item
        label={ t('username') }
        name="username"
        rules={[{ required: true, message: t('err_req_username') }]}
      >
        <Input
        prefix={<UserOutlined />}
        />
      </Form.Item>

      <Form.Item
        label={ t('password') }
        name="password"
        rules={[{ required: true, message:  t('password') }]}
      >
        <Input.Password 
        prefix={<UnlockOutlined />}
        />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>{t('remember_me')}</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={isLoading}

        >
        { t('login') }
        </Button>
      </Form.Item>
    </Form>
    )
  }
  
  
  export default LoginForm;