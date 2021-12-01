import {Form, Input, Button, Select, DatePicker,TimePicker, Row, Col, Card}  from 'antd';
import  {FC, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { ITicket, ITicketLog } from '../../models/ITicket';
import { axiosFn } from '../../axios/axios';
import { uTd } from '../../utils/formManipulation';
import UserAddOutlined from '@ant-design/icons/lib/icons/UserAddOutlined';
import { useTypedSelector } from '../../hooks/useTypedSelector';

const { TextArea } = Input;

interface PopoverDtlProps {
  record:ITicket
}

const PopoverDtl: FC<PopoverDtlProps> =  (props)  => {
  const {defaultRole } = useTypedSelector(state => state.auth)
  const { t } = useTranslation();
  const [last_log_records, setLast_log_records]  = useState([] as ITicketLog[])
  useEffect(() => {
    getLog()
    
  }, [last_log_records.length])
  let extra = defaultRole && defaultRole?.label !== "Employee" ? "" : " and name = 'New Log Comment' "  ;
  const getLog = async () => {
    
    const last_log_records =  await axiosFn('get', '', 'top 3 * ', ' V_ticket_log ', " ticket = '" +props.record.id+ "' " + extra + " order by create_date desc")
    let tickets_log:ITicketLog[] = last_log_records.data
    tickets_log = tickets_log.map(e => {
      return { ...e, name: t(e.name) }  
       }
      ) 
    
    setLast_log_records(tickets_log)
  }
  const  buildTitle = () =>
  {
    return (
      <>
      {
        last_log_records?.length > 0 &&
        <Card 
    style={{border:'solid 1px gray'}}
    >
      <>
      {/* {
        extra.length !== 0 &&
        <Row key="description">
               <Col key="description_col" xs={24} xl={24} sm={24} lg={24}>
                 <label> {t('description')}</label>
                 <TextArea 
                 rows={4}
                 disabled={true}
                 value={props.record.description}
                 />
                </Col>
       </Row>
      } */}
      </>
              
          {
            last_log_records.length > 0 &&
            last_log_records.map((r:ITicketLog) => 
              (
              <div key={r.id} style={{borderTop:'solid 1px gray'}}>
                <Row key={'top_'+r.id}>
                <Col key="1" xs={24} xl={8} sm={8} lg={8} ><span style={{fontSize:'11px'}}><b>{r.name}</b></span></Col>
                <Col key="5" xs={24} xl={8} sm={8} lg={8}><span style={{fontSize:'11px'}}>{uTd(r.create_date)}</span> </Col>
                <Col key="2" xs={24} xl={8} sm={8} lg={8} > <UserAddOutlined /> <span style={{fontSize:'11px'}}>{r.last_mod_by_name}</span></Col>
                </Row>
                <Row key={'bottom_'+r.id} >
               {
                 r.old_value ? 
                 <Col key="3" xs={24} xl={24} sm={24} lg={24}>
                   {/* <TextArea
                   disabled={true}
                   value={ t('from') +': ' + r.old_value + ' ' + t('to') + ': ' + r.new_value }
                   >
                   </TextArea> */}
                   <div>
                   { t('from') +': ' + r.old_value + ' ' + t('to') + ': ' + r.new_value }
                   </div>
                </Col>
                 :
                 <Col key="4" xs={24} xl={24} sm={24} lg={24} > 
                  {/* <TextArea
                  disabled={true}
                  value={r.new_value}
                  >
               
                 </TextArea> */}
                 <div>
                 {r.new_value}
                 </div>
                 </Col>
               }
                </Row>
               
              </div>

              )
            )
          }
        </Card>
      }
    </>
    )
  }
  return (
          <>
          {buildTitle()}
          </>
        
      )
  }


  
  export default PopoverDtl;