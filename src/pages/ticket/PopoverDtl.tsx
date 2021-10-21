import {Form, Input, Button, Select, DatePicker,TimePicker, Row, Col, Card}  from 'antd';
import  {FC, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { ITicket, ITicketLog } from '../../models/ITicket';
import { axiosFn } from '../../axios/axios';
import { uTd } from '../../utils/formManipulation';

const { TextArea } = Input;

interface PopoverDtlProps {
  record:ITicket
}

const PopoverDtl: FC<PopoverDtlProps> =  (props)  => {
  const { t } = useTranslation();
  const [last_log_records, setLast_log_records]  = useState([] as ITicketLog[])
  useEffect(() => {
    getLog()
    
  }, [last_log_records.length])
  const getLog = async () => {
    const last_log_records =  await axiosFn('get', '', 'top 4 * ', ' V_ticket_log ', " ticket = '" +props.record.id+ "' order by create_date desc")
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
    <Card >
      <Row key="description">
               <Col key="description_col" xs={24} xl={24} sm={24} lg={24}>
                 <label> {t('description')}</label>
                 <TextArea 
                 rows={5}
                 style={{width:'100%', minWidth:'50hv'}}
                 disabled={true}
                 value={props.record.description}
                 />
                </Col>
       </Row>        
          {
            last_log_records.length > 0 &&
            last_log_records.map((r:ITicketLog) => 
              (
              <Row key={r.id} style={{borderBottom:'solid 1px gray'}}>
               <Col key="1" xs={24} xl={8} sm={8} lg={8} >{r.name}</Col>
               <Col key="2" xs={24} xl={8} sm={8} lg={8} >{r.last_mod_by_name}</Col>
               {
                 r.old_value ? 
                 <Col key="3" xs={24} xl={8} sm={8} lg={8}>{ t('from') +': ' + r.old_value + ' ' + t('to') + ': ' + r.new_value}</Col>
                 :
                 <Col key="3" xs={24} xl={8} sm={8} lg={8}> {r.new_value}</Col>
               }
               <Col key="5" xs={24} xl={8} sm={8} lg={8}>{uTd(r.create_date)}</Col>
              </Row>
              )
            )
          }
        </Card>
    )
  }
  return (
          <>
          {buildTitle()}
          </>
        
      )
  }


  
  export default PopoverDtl;