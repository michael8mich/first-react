import React, {FC, useEffect, useState } from 'react';
import {  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle } from 'react-beautiful-dnd';
import { Bar, Gauge, Pie, Liquid, measureTextWidth, Waterfall, Treemap  } from '@ant-design/charts';
import { axiosFn } from '../axios/axios';
import { useTranslation } from 'react-i18next';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { Card, Col, Popconfirm, Row, Tooltip } from 'antd';
import { ReloadOutlined, PlusCircleOutlined, MinusCircleOutlined,EditOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useAction } from '../hooks/useAction';
import { HOME_FOLDER, IQuery } from '../models/ISearch';
import { useHistory } from 'react-router';
import { RouteNames } from '../router';
import Drd from './DrugAndDrop';
import { ANALYST_DTP, ANALYST_DTP_REPORTS, EMPLOYEE_DTP } from '../models/IUser';
import { FROM, SELECT, WHERE } from '../utils/formManipulation';
import { PRIORITY_HIGH, PRIORITY_MEDIUM, URGENCY_HIGH, URGENCY_MEDIUM } from '../models/ITicket';
import { IChatQuery } from '../models/IChart';
  



const HomeEmployee: FC = () => {
  const { user, defaultRole } = useTypedSelector(state => state.auth)
  const { configs} = useTypedSelector(state => state.cache)
  const {setConfigs, setConfigsArr } = useAction()
  const dataPartition = (where: string, report: boolean = false) => {
     return EMPLOYEE_DTP.replace(/currentUser/g, user.id) + ( where !== '' ? " AND ( " + where + ")" : "" )
   }
  
  const { t } = useTranslation();    

  let chart: any;
  
  const [getMore, setGetMore] =  useState(false) 
  const [edit, setEdit] =  useState(false) 
  const {setQueriesCache} = useAction()
  const router = useHistory()
  // useEffect(() => {
  //   debugger
  //   console.log(router);
    
  // }, [])
  // Export Image
  const downloadImage = () => {
    chart?.downloadImage();
  };

  // Get chart base64 string
  const toDataURL = () => {
    console.log(chart?.toDataURL());
  };
  interface CHART_CONFIG  {
    name: String
    config: any[]
  }

  useEffect(() => {
    const interval = setInterval(() => {
        getQueries()     
    }, 300000);
    return () => clearInterval(interval);
  }, []);
  const {fetchQueries,setAlert} = useAction()
  const [queries, setQueries] = useState([] as IQuery[])
  useEffect(  ()  => {
    if(user) {
      if(queries.length===0) {
        getQueries()
      }
      
    }
  }, [user])

  const result_query_Arr:IQuery[] =  [
    {
      active: 1,
      default: 0,
      factory: "ticket",
      folder: "111111111111111111",
      id: "1111111111111111111111111",
      name: t('my_opened_tickets'),
      last_mod_by: '',
      last_mod_dt: '', 
      create_date: "",
      object: "11111111111111111111111111",
      query: " (  active = 1 ) ",
      seq: 1,
      count: '0',
      index: 1
    },
    {
      active: 1,
      default: 0,
      factory: "ticket",
      folder: "222222222222222222",
      id: "22222222222222222222",
      name: t('my_closed_tickets'),
      last_mod_by: '',
      last_mod_dt: '', 
      create_date: "",
      object: "22222222222222222222222222",
      query: " (  active = 0 ) ",
      seq: 1,
      count: '0',
      index: 1
    }
  ]
const [nowDate, setNowDate] =  useState(moment().format("DD/MM/YY HH:mm:ss"))  
const getQueries = async () => {
  setNowDate(moment().format("DD/MM/YY HH:mm:ss"))  
  let index = 1
  result_query_Arr.map(async ( q) =>  {
    let q_result = await axiosFn("get", '', ' count(id) as cnt ', 'V_' + q.factory + 's', q.factory === 'ticket' ? dataPartition(q.query) : q.query , '' )  
    q.count = q_result.data[0].cnt
    q.index = index
    if(index === result_query_Arr.length)
      setQueries(result_query_Arr)
    index++  
  })
  
}  

  const goTo = (q:IQuery) => {
    if(edit) return
    if(q.factory === 'ticket') {
      setQueriesCache({ [q.factory]: q.query })
      router.push(RouteNames.TICKETS)
    } else if(q.factory === 'contact') {
      setQueriesCache({ [q.factory]: q.query })
      router.push(RouteNames.USERS)
    } 
  }
  //---------------------------------------

  const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
    background: isDraggingOver ? "lightblue" : "transparent",
  });

  return (
    <Card>
       <Tooltip title={t('refresh')}>
      <ReloadOutlined 
      onClick={()=> getQueries()}
      style={{fontSize:'24px',fontWeight:900}}/>&nbsp;&nbsp;
      {nowDate}
      </Tooltip>
      <Row>
      <Col  xs={24} xl={6} lg={8}  sm={12} key={'q_col_first'}></Col>
      {queries.map((q, index) =>( 
                
                        <Col  xs={24} xl={6} lg={8}  sm={12} key={q.id}
                        >
                        <Card   key={q.id} 
                        className={'homeQueryCard'}
                        onClick={()=>goTo(q)}
                        >
                        <div  key={1} style={{alignItems:'center',textAlign:'center'}}>
                        <Tooltip title={q.name}>
                        {q.name.toString().substring(0,40)} 
                        </Tooltip>
                        </div> 
                        <div key={2} style={{alignItems:'center',textAlign:'center'}}>
                         <b>{q.count}</b>
                        </div> 
                        </Card>
                       </Col>                   
          )) 
    }    
    <Col  xs={24} xl={6} lg={8}  sm={12} key={'q_col_last'}></Col>
    </Row>
    </Card>
  );
  }
  
  
  export default HomeEmployee;