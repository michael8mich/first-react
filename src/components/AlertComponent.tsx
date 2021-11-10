import {Form, Input, Button, Select, DatePicker,TimePicker, Row, Alert, AlertProps, message}  from 'antd';
import  {FC, useEffect, useState} from 'react';
import { useAction } from '../hooks/useAction';

import { AlertPrp } from '../models/admin/IUtil';


const AlertComponent: FC<AlertPrp> = (props) => {
  const {setAlert} = useAction()
    useEffect(() => {
      if(props?.message?.length > 0 && props.type) {
        message[props.type](props.message)
        let new_alert = {} as AlertPrp
            setAlert({...new_alert , visible: false
            })
      }
    }
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
      <div></div>
      // <div style={{width:'30%'}}>
      //   {
      //     props.visible && 
      //     <Alert 
      //     message={props.message}
      //     type={props.type}  
      //     closable={props.closable}  
      //     showIcon={props.showIcon}  
      //     />
      //   }
      // </div>
    )
}
  export default AlertComponent