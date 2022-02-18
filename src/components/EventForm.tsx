import {Form, Input, Button, Select, DatePicker, Row}  from 'antd';
import  {FC, useEffect, useState} from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { IEvent } from '../models/IEvent';
import { IUser } from '../models/IUser';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { validators } from '../utils/validators';

interface EventFormProps {
  guests: IUser[],
  submit: (event: IEvent) => void,
  modalVisible: boolean
}

const EventForm: FC<EventFormProps> = (props) => {

  const {error, isLoading } = useTypedSelector(state => state.event)
  const {user } = useTypedSelector(state => state.auth)
  
  const { t } = useTranslation();
  const [initialForm] = useState({})
  const [form] = Form.useForm()
  useEffect(() => {
    //console.log('props.modalVisible',props.modalVisible );
    
    form.resetFields()
  },[props.modalVisible])


  const onFinish = (values: any) => {
    console.log('Success:', values); 
    let values_ = {...values, author: user.id}
    Object.keys(values_).map(k=> {
      if(values_[k] instanceof moment )
      {
       return values_[k] = values_[k].unix()
      }
      return values[k] = ''
    })
    form.resetFields()
    props.submit(values_)

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
    return (
      <Row justify="center"> 
      <Form
      form={form}
      name="form"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={initialForm}   
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {error && <div style={{color: 'red'}}>
        {error}
        </div>}
      <Form.Item
        label={t('event_name')}
        name="description"
        rules={[{ required: true, message: t('err_req_event_name') }]}
      >
        <Input 
        value="description"
        />
      </Form.Item>

      <Form.Item
        label={t('guest')}
        name="guest"
        rules={[{ required: true, message: t('err_req_guest') }]}
      >
        <Select 
         size="large"
         value="guest"
        >
          {
        
        
          props.guests.map(g => 
            <Select.Option
            key={g.name} 
            value={g.id}
            >
              {g.name}
              </Select.Option>
            ) 
          }
         
        </Select>
      </Form.Item>
      <Form.Item
        label={t('date')}
        name="event_dt"
        rules={[{ required: true, message: t('err_req_date') }, validators.isDateAfter()]}
      >  
        <DatePicker 
         showTime={{ format: 'HH:mm' }} 
        >
        </DatePicker>
      </Form.Item>
      <Row justify="end"> 
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={isLoading} 
       
        >
          {t('create')}
        </Button>
      </Form.Item>
      </Row>
    </Form>
    </Row>
    )
  }
  
  
  export default EventForm;