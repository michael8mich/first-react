import {Form, Input, Button, Select, DatePicker,TimePicker, Row, Alert, AlertProps}  from 'antd';
import  {FC, useEffect, useState} from 'react';
import { useAction } from '../hooks/useAction';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { IEvent } from '../models/IEvent';
import { IUser } from '../models/IUser';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { validators } from '../utils/validators';
import { IQuery } from '../models/ISearch';
import { axiosFn } from '../axios/axios';
import { AlertPrp } from '../models/admin/IUtil';


const AlertComponent: FC<AlertPrp> = (props) => {
  const {setAlert} = useAction()
    useEffect(() => 
      autoClose()
    , [props])
    
    const autoClose = () => {
    const seconds = props?.autoClose || 0
    if(seconds > 0) 
        setTimeout(() => {
          let new_alert = {} as AlertPrp
          setAlert({...new_alert , visible: false
          })
        }, seconds*1000);

    }

    return (
      <div style={{width:'30%'}}>
        {
          props.visible && 
          <Alert 
          message={props.message}
          type={props.type}  
          closable={props.closable}  
          showIcon={props.showIcon}  
          />
        }
      </div>
    )
}
  export default AlertComponent