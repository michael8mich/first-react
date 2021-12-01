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
import { AutoComplete, Avatar, Badge, Button, Card, Col, Input, Popconfirm, Row, Tooltip } from 'antd';
import { SelectProps } from 'antd/es/select';
import { ReloadOutlined, PlusCircleOutlined, MinusCircleOutlined,EditOutlined, 
  CloseCircleOutlined, DeleteOutlined,SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useAction } from '../hooks/useAction';
import { HOME_FOLDER, IQuery } from '../models/ISearch';
import { useHistory } from 'react-router';
import { RouteNames } from '../router';
import Drd from './DrugAndDrop';
import { ANALYST_DTP, ANALYST_DTP_REPORTS, EMPLOYEE_DTP } from '../models/IUser';
import { FROM, SELECT, WHERE } from '../utils/formManipulation';
import { IIFrame, ITicket, ITicketPrpTpl, PRIORITY_HIGH, PRIORITY_MEDIUM, URGENCY_HIGH, URGENCY_MEDIUM } from '../models/ITicket';
import { IChatQuery } from '../models/IChart';
import { Content } from 'antd/lib/layout/layout';
import { IUtil } from '../models/admin/IUtil';
import classes from './HomeEmployee.module.css'
import Iframe from 'react-iframe'
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined';
import useWindowDimensions from '../hooks/useWindowDimensions';
const {Meta} = Card
  


const HomeEmployee: FC = () => {
  const { user, defaultRole } = useTypedSelector(state => state.auth)
  const { configs} = useTypedSelector(state => state.cache)
  const {setConfigs, setConfigsArr } = useAction()
  const {logout, setSelectedProperty, setProperties, setSelectedTicket,setPathForEmpty} = useAction()
  const dataPartition = (where: string, report: boolean = false) => {
     return EMPLOYEE_DTP.replace(/currentUser/g, user.id) + ( where !== '' ? " AND ( " + where + ")" : "" )
   }
  
  const { t } = useTranslation();    

  let chart: any;
  
  const [getMore, setGetMore] =  useState(false) 
  const [edit, setEdit] =  useState(false) 
  const {setQueriesCache} = useAction()
  const router = useHistory()

  const [options, setOptions] = useState<SelectProps<object>['options']>([]);

  const handleSearch = async (value: string) => {
    if(value) {
      let r = searchResult(value) || []
      setOptions( await r);
    }
    else
    setOptions([])
    
  };

  const onSelect = (value: string) => {
    console.log('onSelect', value);
  };

  function getRandomInt(max: number, min: number = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
  }
  const [knArray, setKnArray] = useState([] as IUtil[])
  const emptyFrame:IIFrame ={width:'0px', height:'0px', url:''}
  const [selectedKn, setSelectedKn] = useState(emptyFrame) 
  const searchResult = async (query: string) => {
    if(knArray.length===0) {
      let result = await axiosFn("get", '', ' * ', 'utils', "type = 'kn_document' " , '' )  
      setKnArray(result.data)
    }

    return knArray.map((kn:IUtil, idx:number) => {
      return {
        value: kn.name,
        label: (
          <div
            
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span
            onClick={() => setSelectedKn({ width:'100%', height:'600px' , url:'http://mx/kn/'+kn.code} ) }
            >
              {t('found')} <label style={{color:'green',textDecoration:'underline'}}>{query} </label>  {t('on')} {' '}
              {kn.name}
            </span>
            {/* <span>{knArray.length} results</span> */}
          </div>
        ),
      };
    });

  } 

    
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
      if(shortCats.length===0)
      getShortCats()
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
      name: t('my_last_tickets'),
      last_mod_by: '',
      last_mod_dt: '', 
      create_date: "",
      object: "22222222222222222222222222",
      query: " (  datediff(d,dateadd(s,create_date, '01/01/1970'), getdate() ) < 7 ) ",
      seq: 1,
      count: '0',
      index: 1
    },
    {
      active: 1,
      default: 0,
      factory: "ticket",
      folder: "333333333333333333",
      id: "333333333333333333",
      name: t('my_closed_tickets'),
      last_mod_by: '',
      last_mod_dt: '', 
      create_date: "",
      object: "333333333333333333",
      query: " (  active = 0 ) ",
      seq: 1,
      count: '0',
      index: 1
    }
  ]
const [nowDate, setNowDate] =  useState(moment().format("DD/MM/YY HH:mm:ss")) 
const [shortCats, setShortCats] =  useState([] as IUtil[])
const getShortCats = async () => {
  let result = await axiosFn("get", '', ' * ', 'utils', "type = 'employee_open_ticket_cat' " , '' )  
  setShortCats(result?.data)
}
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
  const pathTrowEmpty = (path:string) => {
    setPathForEmpty(path)
    router.push(RouteNames.EMPTY)
  }
  const openTicketWithParameters = (code:string) => {
      setSelectedTicket({} as ITicket)
      setSelectedProperty({} as ITicketPrpTpl)
      setProperties([] as ITicketPrpTpl[])
      let sended = ''
      code = code || ''
      if(code.split(';').length>0) sended = '?search=' + code.split(';')[1]
      pathTrowEmpty(RouteNames.TICKETS + '/0' + sended)
  }
  //---------------------------------------

  const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
    background: isDraggingOver ? "lightblue" : "transparent",
  });
  const { height, width } = useWindowDimensions();
  const autocompleteStyle = () => {
    let width_ = width<400 ? 250 : 700
    return { width: width_, height: '32px'}
  }
  return (
    <Card>
       <Tooltip title={t('refresh')}>
      <ReloadOutlined 
      onClick={()=> getQueries()}
      style={{fontSize:'24px',fontWeight:900}}/>&nbsp;&nbsp;
      {nowDate}
      </Tooltip>
    <Row>
      <Col  xs={24} xl={3} lg={5}  sm={12} key={'q_col_first'}></Col>
      {queries.map((q, index) =>( 
                
                        <Col  xs={24} xl={6} sm={24} lg={6}   key={q.id}
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
    <Col  xs={24} xl={3} lg={5}  sm={12} key={'q_col_last'}></Col>
    </Row>
    <br/><br/>
    <Row>
    <Col  xs={24} xl={6}  sm={4}  lg={2}></Col>
    <Col  xs={24} xl={12} sm={16} lg={24}>
    <AutoComplete
      dropdownMatchSelectWidth={252}
      style={autocompleteStyle()}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
      filterOption={(inputValue, option) =>
        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
      }
    >
      <Input.Search 
       placeholder={t('how-can-i-help-you')} 
      enterButton={<Button type="primary"
        style={{height:'53px'}}
      ><SearchOutlined /></Button>} 
      size="large"
      allowClear       />
      
    </AutoComplete>
    
    <Col  xs={24} xl={8} ></Col>
    </Col>
    <Col  xs={24} xl={6}  sm={4}  lg={2}  ></Col>
    </Row>
    <br/><br/>
    <Row>
    <Col  xs={24} xl={24} >
      {
        selectedKn.url.length>0 &&
        <Tooltip title={t('close') + ' ' + t('knowledge')}>
        <CloseOutlined 
        style={{fontSize:'28px'}}
        onClick={()=>setSelectedKn(emptyFrame)}
        />
        </Tooltip>
      }
    
    

    <Iframe url={selectedKn.url}
        width={selectedKn.width}
        height={selectedKn.height}
        id="myId"
        className="myClassname"
        // display="initial"
        position="relative"/>
    </Col>
    </Row>
    <br/><br/>
    <Row>
    <Col  xs={24} xl={2} lg={2}  sm={2}></Col>
    <Col  xs={24} xl={22} sm={24} lg={22}  ><h1 style={{color:'gray',fontSize:'24px'}}>{t('shortCats')}</h1></Col>
    <Col  xs={24} xl={2} lg={2}  sm={2}></Col> 
    </Row>
    <Row> 
      {
        shortCats.length>0 &&
        shortCats.map( q => (
        <Col    xl={8}  lg={8} sm={12} xs={24}
        onClick={() => openTicketWithParameters(q.code) }
        style={{cursor:'pointer'}}
        >
          <div className={classes.ribonUta}>
    <br/>
	<div className={classes.ribbonWrapper}> 
    <div className={classes.glow}>&nbsp;</div>
		<div className={classes.ribbonFront}>
    {q.name}&nbsp;&nbsp;
    <i className={q.code.split(';').length>1 ? q.code.split(';')[0] : 'fa-question-circle-o'} 
           aria-hidden="true" ></i>
		</div>
		<div className={classes.ribbonEdgeTopleft}></div>
		<div className={classes.ribbonEdgeTopright}></div>
		<div className={classes.ribbonEdgeBottomleft}></div>
		<div className={classes.ribbonEdgeBottomright}></div>
	</div>
	</div>
       </Col>
        ))
     }
    </Row>
    
    </Card>
  );
  }
  
  
  export default HomeEmployee;