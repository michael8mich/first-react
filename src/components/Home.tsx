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
import { TICKET_BY_WEEKDAY, TICKET_OPENED_BY_CATEGORY, TICKET_OPENED_BY_PRIORITY, TICKET_OPENED_BY_TEAM, TICKET_OPENED_BY_URGENCY, TICKET_OPENED_CLOSED_TODAY, TICKET_OPENED_PERCENT_HIGH_PRIORITY, TICKET_OPENED_PERCENT_HIGH_URGENCY } from '../models/IChart';
import { ReloadOutlined, PlusCircleOutlined, MinusCircleOutlined,EditOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useAction } from '../hooks/useAction';
import { HOME_FOLDER, IQuery } from '../models/ISearch';
import { useHistory } from 'react-router';
import { RouteNames } from '../router';
import Drd from './DrugAndDrop';



const Home: FC = () => {
  const { t } = useTranslation();    
  const { user } = useTypedSelector(state => state.auth)
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
      getData()
      getQueries()
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  const [configs, setCOnfigs] = useState([] as CHART_CONFIG[])
  const {fetchQueries,setAlert} = useAction()
  const [queries, setQueries] = useState([] as IQuery[])

  useEffect(  ()  => {
    getData()
    getQueries()
  }, [])

const getQueries = async () => {
  let result_query = await axiosFn("get", '', '*', 'queries', " object='"+user.id+"' AND folder = '" + HOME_FOLDER + "' order by seq " , '' )  
  let result_query_Arr:IQuery[] =  result_query?.data 
  
  if(result_query_Arr)
  result_query_Arr.map(async ( q, index) =>  {
    let q_result = await axiosFn("get", '', ' count(id) as cnt ', 'V_' + q.factory + 's', q.query , '' )  
    q.count = q_result.data[0].cnt
    q.index = index
  })
  setQueries(result_query_Arr)
}  
const getData = async () => {
  const ticket_open_by_team_data = await  axiosFn("get", '', TICKET_OPENED_BY_TEAM.what.replace(/@none/g, t('non') + ' ' + t('team') ), TICKET_OPENED_BY_TEAM.tname, TICKET_OPENED_BY_TEAM.where , ''  )  
  if(ticket_open_by_team_data?.data)
  setCOnfigs( configs => [...configs , { name: 'ticket_open_by_team_data' , config: ticket_open_by_team_data.data} ] )

  let ticket_open_by_priority_data = await  axiosFn("get", '', TICKET_OPENED_BY_PRIORITY.what.replace(/@none/g, t('non') + ' ' + t('priority') ), TICKET_OPENED_BY_PRIORITY.tname, TICKET_OPENED_BY_PRIORITY.where , ''  )  
  if(ticket_open_by_priority_data?.data)
  setCOnfigs(configs => [ ...configs, { name: 'ticket_open_by_priority_data' , config: ticket_open_by_priority_data.data} ])
  
  let ticket_open_by_urgency_data = await  axiosFn("get", '', TICKET_OPENED_BY_URGENCY.what.replace(/@none/g, t('non') + ' ' + t('urgency') ), TICKET_OPENED_BY_URGENCY.tname, TICKET_OPENED_BY_URGENCY.where , ''  )  
  if(ticket_open_by_urgency_data?.data)
  setCOnfigs(configs => [ ...configs, { name: 'ticket_open_by_urgency_data' , config: ticket_open_by_urgency_data.data} ])

  let ticket_open_by_category_data = await  axiosFn("get", '', TICKET_OPENED_BY_CATEGORY.what.replace(/@none/g, t('non') + ' ' + t('tcategory') ), TICKET_OPENED_BY_CATEGORY.tname, TICKET_OPENED_BY_CATEGORY.where , ''  )  
  if(ticket_open_by_category_data?.data)
  setCOnfigs(configs => [ ...configs, { name: 'ticket_open_by_category_data' , config: ticket_open_by_category_data.data} ])

  let ticket_opened_percent_high_priority_data = await  axiosFn("get", '', TICKET_OPENED_PERCENT_HIGH_PRIORITY.what, TICKET_OPENED_PERCENT_HIGH_PRIORITY.tname, TICKET_OPENED_PERCENT_HIGH_PRIORITY.where , ''  )  
  if(ticket_opened_percent_high_priority_data?.data)
  setCOnfigs(configs => [ ...configs, { name: 'ticket_opened_percent_high_priority_data' , config: ticket_opened_percent_high_priority_data.data} ])

  let ticket_opened_percent_high_urgency_data = await  axiosFn("get", '', TICKET_OPENED_PERCENT_HIGH_URGENCY.what, TICKET_OPENED_PERCENT_HIGH_URGENCY.tname, TICKET_OPENED_PERCENT_HIGH_URGENCY.where , ''  )  
  if(ticket_opened_percent_high_urgency_data?.data)
  setCOnfigs(configs => [ ...configs, { name: 'ticket_opened_percent_high_urgency_data' , config: ticket_opened_percent_high_urgency_data.data} ])

  let ticket_opened_closed_today_data = await  axiosFn("get", '', TICKET_OPENED_CLOSED_TODAY.what, TICKET_OPENED_CLOSED_TODAY.tname, TICKET_OPENED_CLOSED_TODAY.where , ''  )  
  if(ticket_opened_closed_today_data?.data)
  setCOnfigs(configs => [ ...configs, { name: 'ticket_opened_closed_today_data' , config: ticket_opened_closed_today_data.data} ])

  let ticket_by_weekday = await  axiosFn("get", '', TICKET_BY_WEEKDAY.what, TICKET_BY_WEEKDAY.tname, TICKET_BY_WEEKDAY.where , ''  )  
  if(ticket_by_weekday?.data)
  {
    let arr_ticket_by_weekday = ticket_by_weekday.data.map( (e: { type: any; }) => {
      return {...e ,  type: t(e.type) }

    } )
    setCOnfigs(configs => [ ...configs, { name: 'ticket_by_weekday' , config: arr_ticket_by_weekday} ])
  }
 
  
}
  
  const TICKET_OPENED_BY_TEAM_CONFIG = {
    appendPadding: 15,
    data: configs.find( c => c.name === 'ticket_open_by_team_data')?.config  || [],
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    legend:false,
    locale:user.locale,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  }  
  const TICKET_OPENED_BY_TEAM_TREE_MAP_CONFIG = {
    data: { name: 'root', children:configs.find( c => c.name === 'ticket_open_by_team_data')?.config  || [] },
    colorField: 'name',
    Legend:false,

  }

  const TICKET_OPENED_BY_PRIORITY_CONFIG = {
    appendPadding: 15,
    data: configs.find( c => c.name === 'ticket_open_by_priority_data')?.config  || [] ,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    legend:false,
    locale:user.locale,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  }
  const TICKET_OPENED_BY_URGENCY_CONFIG = {
    appendPadding: 15,
    data: configs.find( c => c.name === 'ticket_open_by_urgency_data')?.config  || [] ,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    legend:false,
    locale:user.locale,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  }
  const TICKET_OPENED_BY_CATEGORY_CONFIG = {
    data: configs.find( c => c.name === 'ticket_open_by_category_data')?.config  || [] ,
    xField: 'value',
    yField: 'type',
    meta: {
      type: { alias: '' },
      value: { alias: t('tickets') },
    },
    isRange: true,
    // label: {
    //   position: 'middle',
    //   layout: [{ type: 'adjust-color' }],
    // },
    // barBackground: { style: { fill: 'rgba(0,0,0,0.1)' } },
    // interactions: [
    //   {
    //     type: 'active-region',
    //     enable: false,
    //   },
    // ],
  }
 const TICKET_OPENED_PERCENT_HIGH_PRIORITY_CONFIG = {
      percent: +(configs.find( c => c.name === 'ticket_opened_percent_high_priority_data')?.config[0].target)  / (+configs.find( c => c.name === 'ticket_opened_percent_high_priority_data')?.config[0].all) ,
      style:{width:300, height:300},
      type: 'meter',
      innerRadius: 0.75,
      range: {
        ticks: [0, 1 / 3, 2 / 3, 1],
        color: ['#F4664A', '#FAAD14', '#30BF78'].reverse(),
      },
      indicator: {
        pointer: { style: { stroke: '#D0D0D0' } },
        pin: { style: { stroke: '#D0D0D0' } },
      },
      axis: {
        label: {
          formatter: function formatter(v:any) {
            return Number(v) * 100;
          },
        },
        subTickLine: { count: 10 },
      },
      statistic: {
        content: {
          formatter: function formatter(_ref:any) {
            var percent = _ref.percent;
            return t('rate')+': '.concat((percent * 100).toFixed(0), '%') ;
          },
          style: {
            color: 'rgba(0,0,0,0.65)',
            fontSize: '18px',
          },
        },
      }
  }
  const TICKET_OPENED_PERCENT_HIGH_URGENCY_CONFIG = {
    percent: +(configs.find( c => c.name === 'ticket_opened_percent_high_urgency_data')?.config[0].target)  / (+configs.find( c => c.name === 'ticket_opened_percent_high_urgency_data')?.config[0].all) ,
    style:{width:300, height:300},
    range: {
      ticks: [0, 1 / 3, 2 / 3, 1],
      color: ['#F4664A', '#FAAD14', '#30BF78'].reverse(),
    },
    indicator: {
      pointer: { style: { stroke: '#D0D0D0' } },
      pin: { style: { stroke: '#D0D0D0' } },
    },
    axis: {
      label: {
        formatter: function formatter(v:any) {
          return Number(v) * 100;
        },
      },
      subTickLine: { count: 10 },
    },
    statistic: {
      content: {
        formatter: function formatter(_ref:any) {
          var percent = _ref.percent;
          return t('rate')+': '.concat((percent * 100).toFixed(0), '%') ;
        },
        style: {
          color: 'rgba(0,0,0,0.65)',
          fontSize: '18px',
        },
      },
    }
  }
  const liquidStyle = (percent:number) => {
    percent = percent || 0.01
    if(percent<=0) percent =  0.01
    if(percent>1) percent = 0.99
    return percent

  }
  const TICKET_OPENED_CLOSED_TODAY_CONFIG = {
    percent:  liquidStyle( +(configs.find( c => c.name === 'ticket_opened_closed_today_data')?.config[0].target)  / (+configs.find( c => c.name === 'ticket_opened_closed_today_data')?.config[0].all)) ,
    outline: {
      border: 8,
      distance: 4,
      radius: 0.8,
    },
    statistic: {
      title: {
        formatter: function formatter() {
          return configs.find( c => c.name === 'ticket_opened_closed_today_data')?.config[0].all + '/' + configs.find( c => c.name === 'ticket_opened_closed_today_data')?.config[0].target
        },
        style: function style(_ref:any) {
          var percent = _ref.percent;
          return { fill: percent > 0.65 ? 'green' : 'red' };
        },
      },
      content: {
        style: function style(_ref2:any) {
          var percent = _ref2.percent;
          return {
            fontSize: '18px',
            lineHeight: 1,
            fill: percent > 0.65 ? 'green' : 'red',
          };
        },
        
      },
    },
    liquidStyle: function liquidStyle(_ref4:any) {
      var percent = _ref4.percent;
      return {
        fill: percent > 0.45 ? 'green' : 'red',
        stroke: percent > 0.45 ? '#5B8FF9' : '#FAAD14',
      };
    },
    color: function color() {
      return '#5B8FF9';
    },
    wave: { length: 128 },
    style:{width:300, height:300, paddingTop:'20px'},
  }
  
  const TICKET_BY_WEEKDAY_CONFIG = {
    data: configs.find( c => c.name === 'ticket_by_weekday')?.config  || [] ,
    // padding: 'auto',
    appendPadding: [20, 0, 0, 0],
    xField: 'type',
    yField: 'value',
    meta: {
      type: { alias:  t('weekday') },
      value: {
        alias: t('tickets'),
        formatter: function formatter(v:any) {
          return ''.concat(v, '');
        },
      },
    },
    total: {
      label:t('total'),
      style: { fill: '#96a6a6' },
    },
    // labelMode: "absolute",
    label: {
      style: { fontSize: 10 },
      background: {
        style: {
          fill: '#f6f6f6',
          radius: 1,
        },
        padding: 1.5,
      },
    },
    legend:false
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
  const deleteQuery = async (id:string) => {
    
      let result_query = await axiosFn("delete", '', '*', 'queries', "id" , id ) 
        let hasError = false;
        if(result_query.data["error"]) hasError = true;
        if(!hasError) { 
          setAlert({
            type: 'success' ,
            message: t('deleted_success'),
            closable: true ,
            showIcon: true ,
            visible: true,
            autoClose: 10 
           })
           getQueries()
        }
        else {
          setAlert({
            type: 'warning' ,
            message: result_query.data["error"],
            closable: true ,
            showIcon: true ,
            visible: true,
            autoClose: 10 
           })
        }
  }
  //---------------------------------------
  const onDragEnd = (result: DropResult): void => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
     let queries_ = [...queries]
     queries_[result.source.index].index = result.destination.index
     queries_[result.destination.index].index = result.source.index
     queries_ = queries_.sort((a,b) => a.index - b.index) 
     setQueries(queries_)
     queries_.map(async q => {
      let js = {seq:q.index} as Object
      let q_result = await axiosFn("put", js,  '', 'queries', 'id',  q.id  )  
      console.log(q_result);
      }
      ) 
  }
  const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
    background: isDraggingOver ? "lightblue" : "transparent",
  });

  return (
    <Card>
       <Tooltip title={t('refresh')}>
      <ReloadOutlined 
      onClick={()=>getData()}
      style={{fontSize:'24px',fontWeight:900}}/>&nbsp;&nbsp;
      {moment().format("DD/MM/YY HH:mm:ss")}
      </Tooltip>
      <Row key="1">
        <Col  xs={24} xl={4} sm={12}>
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_PERCENT_HIGH_PRIORITY')}</h3>
         <Gauge  {...TICKET_OPENED_PERCENT_HIGH_PRIORITY_CONFIG} />
        </Col>
        <Col  xs={24} xl={4} sm={12}>
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_PERCENT_HIGH_URGENCY')}</h3>
         <Gauge  {...TICKET_OPENED_PERCENT_HIGH_URGENCY_CONFIG} />
        </Col>
        <Col  xs={24} xl={4} sm={12}>
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_CLOSED_TODAY')}</h3>
         <Liquid  {...TICKET_OPENED_CLOSED_TODAY_CONFIG} />
        </Col>
        <Col  xs={24} xl={12} sm={12}>
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_TEAM')}</h3>
         <Treemap   {...TICKET_OPENED_BY_TEAM_TREE_MAP_CONFIG} />
        </Col>

        
        <Col  xs={2} xl={2} style={{display:'flex',justifyContent:'flex-end', alignSelf: 'flex-end'}} >
       
          {
            getMore ?
            <Tooltip title={t('getMore')}>
            <MinusCircleOutlined  style={{fontSize: '36px'}}
            onClick={() => setGetMore(false)}
            />
            </Tooltip> :
             <Tooltip title={t('getMore')}>
             <PlusCircleOutlined style={{fontSize: '36px'}}
             onClick={() => setGetMore(true)}
             />
             </Tooltip>

          }
         
        </Col>
      </Row>
      { getMore &&
      <>
      <Row key="2">
        <Col  xs={24} xl={8} sm={12}>
        <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_TEAM')}</h3>
        <Pie  {...TICKET_OPENED_BY_TEAM_CONFIG} />
       </Col>
       <Col  xs={24} xl={8} sm={12}>
        <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_PRIORITY')}</h3>
        <Pie  {...TICKET_OPENED_BY_PRIORITY_CONFIG} />
       </Col>
       <Col  xs={24} xl={8} sm={12}>
        <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_URGENCY')}</h3>
        <Pie  {...TICKET_OPENED_BY_URGENCY_CONFIG} />
       </Col>
       </Row>
       <Row key="3">
       <Col  xs={24} xl={12} >
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_CATEGORY')}</h3>
         <Bar  {...TICKET_OPENED_BY_CATEGORY_CONFIG} />
        </Col>  
       <Col  xs={24} xl={12} >
        <h3 style={{textAlign:'center'}}>{t('TICKET_BY_WEEKDAY')}</h3>
        <Waterfall  {...TICKET_BY_WEEKDAY_CONFIG} />
       </Col>
        
      </Row>
      </>
       }
        <DragDropContext onDragEnd={onDragEnd} >
           <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <Row key="4"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                {queries.map((q, index) =>( 
                <Draggable key={q.id} draggableId={q.id} index={index} isDragDisabled={!edit}>
                {(provided, snapshot) => (
                        <Col  xs={24} xl={6} lg={8}  sm={12} key={q.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        >
                        <Card   key={q.id} 
                        className={!edit ? 'homeQueryCard' : 'homeQueryCardEdit'}
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
                        {
                          edit &&
                          <Tooltip title={t('delete')}>
                            <Popconfirm title={t('are_you_sure')} okText={t('yes')} cancelText={t('no')}  onConfirm={() => deleteQuery(q.id)}>
                            <DeleteOutlined 
                            ></DeleteOutlined>
                            </Popconfirm>
                          </Tooltip>
                        }
                        </Card>
                      </Col>
                       )}
                      </Draggable>
          ))  
        }
        <Col  xs={2} xl={2} style={{display:'flex',justifyContent:'flex-end', alignSelf: 'flex-end'}} key="867">
                {
                  !edit ?
                  <Tooltip title={t('edit')}>
                  <EditOutlined  style={{fontSize: '36px'}}
                  onClick={() => setEdit(true)}
                  />
                  </Tooltip> :
                    <Tooltip title={t('cancel')}>
                    <CloseCircleOutlined  style={{fontSize: '36px'}}
                    onClick={() => setEdit(false)}
                    />
                    </Tooltip>
                }      
        </Col>
        {provided.placeholder}
     </Row>
        )}
      </Droppable>
        </DragDropContext>
    </Card>
  );
  }
  
  
  export default Home;