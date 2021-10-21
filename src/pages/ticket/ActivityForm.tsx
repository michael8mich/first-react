import {Form, Input, Button, Select, DatePicker,TimePicker, Row, Col, Card}  from 'antd';
import  {FC, useEffect, useState} from 'react';
import { useAction } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IEvent } from '../../models/IEvent';
import { IUser } from '../../models/IUser';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { validators } from '../../utils/validators';
const { TextArea } = Input;

interface ActivityFormProps {
  submit: (description: string) => void,
  modalVisible: boolean,
  type:string
}

const ActivityForm: FC<ActivityFormProps> = (props) => {

  const {error, isLoading } = useTypedSelector(state => state.ticket)
  const {} = useAction()
  const {user } = useTypedSelector(state => state.auth)
  
  const { t } = useTranslation();
  const [initialForm, setInitialForm] = useState({})
  const [form] = Form.useForm()
  useEffect(() => {
    console.log('props.modalVisible',props.modalVisible );
    
    form.resetFields()
  },[props.modalVisible])


  const onFinish = (values: any) => {
    console.log('Success:', values); 
    // let values_ = {...values, author: user.id}
    // Object.keys(values_).map(k=> {
    //   if(values_[k] instanceof moment )
    //   {
    //    values_[k] = values_[k].unix()
    //   }
    //   values[k] = ''
    // })
    form.resetFields()
    props.submit(values)

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
    return (
      <Card>
      <Form
      layout="vertical"
      form={form}
      name="form"
      initialValues={initialForm}   
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {error && <div style={{color: 'red'}}>
        {error}
        </div>}
      <Row >
      <Col xs={24} xl={24} sm={24} lg={24} 
    >
      <Form.Item
        label={t('description')}
        name="new_value"
        rules={[{ required: true }]}
      >
        <TextArea 
        rows={5}
        showCount maxLength={3999}
        //  style={{ height:'38px', width: 'maxContent'}}
         placeholder={ t('description') }
        />
      </Form.Item>
      </Col>
      </Row> 
      
      <Row justify="end"> 
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={isLoading} 
        >
          {t('create')}
        </Button>
      </Form.Item>
      </Row>
    </Form>
    </Card>
    )
  }
  
  
  export default ActivityForm;