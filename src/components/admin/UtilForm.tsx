import {Form, Input, Checkbox, Button}  from 'antd';
import  {FC, useEffect, useState} from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { UnlockOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import { validators } from '../../utils/validators';
import { IUtil } from '../../models/admin/IUtil';
import { useAction } from '../../hooks/useAction';

interface UtilFormProps {
  utils: IUtil[],
  submit: (event: IUtil) => void,
  clearSelectedId: () => void,
  modalVisible: boolean,
  selectedId: string
}

const UtilForm: FC<UtilFormProps> = (props) => {
  const { t } = useTranslation();      
  const { user } = useTypedSelector(state => state.auth)
  const {error, isLoading  } = useTypedSelector(state => state.admin)
  const [form] = Form.useForm()
  useEffect(() => {
    console.log('props.modalVisible',props.modalVisible );
    form.resetFields()
  },[props.modalVisible])

  const { createUtil} = useAction()
  const [util, setUtil] = useState({
    name:'',
    id:'',
    type:'',
    code:'',
    active: 1
  } as IUtil)

  useEffect(() => {
  form.resetFields()
  let util = {} as IUtil
  if(props.selectedId) {
     let selectedObj = props.utils.find(u=>u.id===props.selectedId)
     if(selectedObj)
     {
      util = selectedObj
     }
     setUtil(util)
     form.setFieldsValue(util)
     console.log('util', util);
  }
  }
    ,[props])

  const onFinish = async (values: any) => {
    console.log('Success:', values);
    console.log('Util:', util);
    values.active = values.active ? 1 : 0
    values.code = values.code || ''
    if(util.id) {
      values.id = util.id
    }
    form.resetFields()
    setUtil({
      name:'',
      id:'',
      type:'',
      code:'',
      active: 1
    } as IUtil)
    await createUtil(values)
    props.submit(values)
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
    return (
      <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 30 }}
      initialValues={{active: 1}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {error && <div style={{color: 'red'}}>
        {error}
        </div>}
      <Form.Item
        label={ t('name') }
        name="name"
        rules={[validators.required()]}
        
      >
        <Input
        prefix={<UserOutlined />}
        value={util.name} 
        />
      </Form.Item>

      <Form.Item
        label={ t('type') }
        name="type"
        rules={[validators.required()]}
      >
        <Input 
        value={util.type} 
        prefix={<UnlockOutlined />}
        />
      </Form.Item>

      <Form.Item
        label={ t('code') }
        name="code"
        rules={[]}
      >
        <Input 
        value={util.code}
        prefix={<UnlockOutlined />}
        />
      </Form.Item>

      <Form.Item name="active" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox
         value={util.active ? true : false}
        >{t('active_object')}</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={isLoading}

        >
        { t('submit') }
        </Button>
      </Form.Item>
    </Form>
    )
  }
  
  
  export default UtilForm;