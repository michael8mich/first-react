import React, {FC, useEffect, useState } from 'react';
import {  DragDropContext,
  Draggable,
  Droppable,
  DropResult } from 'react-beautiful-dnd';
import { Gauge, Pie, Liquid,  Waterfall, Treemap  } from '@ant-design/charts';
import { Bar } from '@ant-design/plots';
import { axiosFn } from '../axios/axios';
import { useTranslation } from 'react-i18next';
import { useInterval } from '../hooks/useInterval'
import { useTypedSelector } from '../hooks/useTypedSelector';
import { Badge, Card, Col, Popconfirm, Row, Tooltip } from 'antd';
import { ReloadOutlined, PlusCircleOutlined, MinusCircleOutlined,EditOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useAction } from '../hooks/useAction';
import { HOME_FOLDER, IQuery } from '../models/ISearch';
import { useHistory } from 'react-router';
import { RouteNames } from '../router';
import { ANALYST_DTP, ANALYST_DTP_REPORTS } from '../models/IUser';
import { FROM, SELECT, WHERE } from '../utils/formManipulation';
import { PRIORITY_HIGH, PRIORITY_MEDIUM, URGENCY_HIGH, URGENCY_MEDIUM } from '../models/ITicket';
import { IChatQuery } from '../models/IChart';
  

interface HomeAssigneeProps {
  defaultRoleLabel: string
}

const HomeAssignee: FC<HomeAssigneeProps> = (props) => {
  const { user, defaultRole } = useTypedSelector(state => state.auth)
  const { t } = useTranslation();    

  
  const [getMore, setGetMore] =  useState(false) 
  const [edit, setEdit] =  useState(false) 
  const [selectedTeam, setSelectedTeam] =  useState('')
  const {setQueriesCache} = useAction()
  const router = useHistory()
  const dataPartition = (where: string, report: boolean = false, userDefaultRole = defaultRole) => {
        if(userDefaultRole.label !== 'Admin') {
            if(report)
          return ANALYST_DTP_REPORTS.replace(/currentUser/g, user.id) + ( where !== '' ? " AND ( " + where + ")" : "" )
          else
          return ANALYST_DTP.replace(/currentUser/g, user.id) + ( where !== '' ? " AND ( " + where + ")" : "" )
      }
      return where
   }
  
  // Export Image
  // const downloadImage = () => {
  //   chart?.downloadImage();
  // };

  // Get chart base64 string
  // const toDataURL = () => {
  //   console.log(chart?.toDataURL());
  // };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refresh.bind(null, defaultRole)()
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, []);


  useInterval(() => {
    refresh.bind(null, defaultRole)()
  }, 10000);

  const {setAlert} = useAction()
  const [queries, setQueries] = useState([] as IQuery[])
  const [ticket_open_by_team_data, setTicket_open_by_team_data ] = useState()
  const [ticket_open_by_assignee_data, setTicket_open_by_assignee_data ] = useState()
  const [ticket_open_by_team_name, setTicket_open_by_team_name ] = useState()

  const [ticket_open_by_priority_data, setTicket_open_by_priority_data ] = useState([])
  const [ticket_open_by_urgency_data, setTicket_open_by_urgency_data ] = useState([])
  const [ticket_open_by_category_data, setTicket_open_by_category_data ] = useState([])
  const [ticket_opened_percent_high_priority_data, setTicket_opened_percent_high_priority_data ] = useState({target:0,all:0})
  const [ticket_opened_percent_high_urgency_data, setTicket_opened_percent_high_urgency_data ] = useState({target:0,all:0})
  const [ticket_opened_closed_today_data, setTicket_opened_closed_today_data ] = useState({target:0,all:0})
  const [ticket_by_weekday, setTicket_by_weekday ] = useState([])
  
  useEffect(  ()  => {
    if(defaultRole?.label) {
      getData()
      getQueries()
    }
  }, [defaultRole])

  useEffect(  ()  => {
    if(getMore) {
      getData()
    }
  }, [getMore])

 
  const getQueries = async () => {
    try {
      let result_query = await axiosFn("get", '', '*', 'queries', " object='"+user.id+"' AND folder = '" + HOME_FOLDER + "' order by seq " , '' )  
      let result_query_Arr:IQuery[] =  result_query?.data 
      if(result_query_Arr) {
        result_query_Arr.map(async ( q, index) =>  {
          let q_result = await axiosFn("get", '', ' count(id) as cnt ', 'V_' + q.factory + 's', q.factory === 'ticket' ? dataPartition(q.query) : q.query , '' )  
          q.count = q_result.data[0].cnt
          q.index = index
          setQueries( prevQueries => {
            const CurrQuery = prevQueries.find(currQ => currQ.index === q.index)
            if(CurrQuery) {
              prevQueries[index].count = q.count
              return [...prevQueries]
            }
            else
           return [...prevQueries, {...q, countPrev:q.count}]
          }
            )
        }) 
      }
    } catch(e){}
  
  } 


  const getData =  async ( ) => {
  const TICKET_OPENED_BY_TEAM:IChatQuery = {
    what: "  count(id) as value, isnull(team_name, N'@none') as type, '       ' + isnull(team_name, N'@none') as name ",
    tname: " V_tickets ",
    where: dataPartition(" active = 1 ", true) + " group by team_name order by count(id) desc " 
  } 
  const ticket_open_by_team_data = await  axiosFn("get", '', TICKET_OPENED_BY_TEAM.what.replace(/@none/g, t('non') + ' ' + t('team') ), TICKET_OPENED_BY_TEAM.tname, TICKET_OPENED_BY_TEAM.where , ''  )  
  if(ticket_open_by_team_data?.data)
  setTicket_open_by_team_data(ticket_open_by_team_data?.data)
   
    const TICKET_OPENED_BY_PRIORITY:IChatQuery = {
      what: "  count(id) as value, isnull(priority_name, N'@none') as type ",
      tname: " V_tickets ",
      where: dataPartition(" active = 1 ", true) + " group by priority_name order by count(id) desc " 
    }  
    const TICKET_OPENED_BY_URGENCY:IChatQuery = {
      what: "  count(id) as value, isnull(urgency_name, N'@none') as type ",
      tname: " V_tickets ",
      where: dataPartition(" active = 1 ", true) + " group by urgency_name order by count(id) desc " 
    } 
    const TICKET_OPENED_BY_CATEGORY:IChatQuery = {
      what: " top 10 count(id) as value,  isnull(category_name, N'@none') + '    '  as  type ",
      tname: " V_tickets ",
      where: dataPartition(" active = 1 ", true) + " group by category_name order by count(id) desc " 
    } 
    const TICKET_BY_WEEKDAY:IChatQuery = {
      what: "  count(id) as value,   FORMAT( ( dateadd(s, create_date+DATEDIFF (S, GETUTCDATE(), GETDATE()), '1970-01-01')),'dddd' ) as type  ",
      tname: " ticket ",
      where: dataPartition(" id <> '1' ", true) + "  group by FORMAT( ( dateadd(s, create_date+DATEDIFF (S, GETUTCDATE(), GETDATE()), '1970-01-01')),'dddd' ) , datepart( weekday, dateadd(s, create_date+DATEDIFF (S, GETUTCDATE(), GETDATE()), '1970-01-01')) order by datepart( weekday, dateadd(s, create_date+DATEDIFF (S, GETUTCDATE(), GETDATE()), '1970-01-01')) " 
    } 
    
    let guageQuery:string =  ` top 1 ( ${SELECT} count(id) as cnt  ${FROM} V_tickets ${WHERE}  ${dataPartition(" active = 1 ", true)} and priority in ('${PRIORITY_HIGH.value}','${PRIORITY_MEDIUM.value}')  ) as [target],
    ( ${SELECT} count(id) as cnt ${FROM} V_tickets ${WHERE}  ${dataPartition(" active = 1 ", true)}   ) as [all] `
    
    const TICKET_OPENED_PERCENT_HIGH_PRIORITY:IChatQuery = {
      what: guageQuery,
      tname: " empty ",
      where: "" 
    } 
    guageQuery =  ` top 1 ( ${SELECT} count(id) as cnt  ${FROM} V_tickets ${WHERE}  ${dataPartition(" active = 1 ", true)} and urgency in ('${URGENCY_HIGH.value}','${URGENCY_MEDIUM.value}')  ) as [target],
    ( ${SELECT} count(id) as cnt ${FROM} V_tickets ${WHERE}  ${dataPartition(" active = 1 ", true)}   ) as [all] `
    
    const TICKET_OPENED_PERCENT_HIGH_URGENCY:IChatQuery = {
      what: guageQuery,
      tname: " empty ",
      where: "" 
    } 
    guageQuery =  ` top 1 ( ${SELECT} count(id) as cnt  ${FROM}  ticket ${WHERE}  ${dataPartition(" CONVERT (date, SYSDATETIME()) =  CONVERT (date, dateadd(s, create_date+DATEDIFF (S, GETUTCDATE(), GETDATE()), '1970-01-01')) ", true)} ) as [all], 
     ( ${SELECT} count(id) as cnt  ${FROM}  ticket ${WHERE}  ${dataPartition(" CONVERT (date, SYSDATETIME()) =  CONVERT (date, dateadd(s, close_date+DATEDIFF (S, GETUTCDATE(), GETDATE()), '1970-01-01'))", true)} ) as [target] `
    
    const TICKET_OPENED_CLOSED_TODAY:IChatQuery = {
      what: guageQuery,
      tname: " empty ",
      where: "" 
    } 
    if(getMore) {
      let ticket_open_by_priority_data = await  axiosFn("get", '', TICKET_OPENED_BY_PRIORITY.what.replace(/@none/g, t('non') + ' ' + t('priority') ), TICKET_OPENED_BY_PRIORITY.tname, TICKET_OPENED_BY_PRIORITY.where , ''  )  
      if(ticket_open_by_priority_data?.data )
      setTicket_open_by_priority_data(ticket_open_by_priority_data?.data)
      let ticket_open_by_urgency_data = await  axiosFn("get", '', TICKET_OPENED_BY_URGENCY.what.replace(/@none/g, t('non') + ' ' + t('urgency') ), TICKET_OPENED_BY_URGENCY.tname, TICKET_OPENED_BY_URGENCY.where , ''  )  
      if(ticket_open_by_urgency_data?.data )
      setTicket_open_by_urgency_data(ticket_open_by_urgency_data?.data)
      
      let ticket_open_by_category_data = await  axiosFn("get", '', TICKET_OPENED_BY_CATEGORY.what.replace(/@none/g, t('non') + ' ' + t('tcategory') ), TICKET_OPENED_BY_CATEGORY.tname, TICKET_OPENED_BY_CATEGORY.where , ''  )  
      if(ticket_open_by_category_data?.data )
      setTicket_open_by_category_data(ticket_open_by_category_data?.data)
      let ticket_by_weekday = await  axiosFn("get", '', TICKET_BY_WEEKDAY.what, TICKET_BY_WEEKDAY.tname, TICKET_BY_WEEKDAY.where , ''  )  
      if(ticket_by_weekday?.data )
      {
        let arr_ticket_by_weekday = ticket_by_weekday.data.map( (e: { type: any; }) => {
          return {...e ,  type: t(e.type) }
    
        } )
        setTicket_by_weekday(arr_ticket_by_weekday)
      }
    }
  
    
    
    let ticket_opened_percent_high_priority_data = await  axiosFn("get", '', TICKET_OPENED_PERCENT_HIGH_PRIORITY.what, TICKET_OPENED_PERCENT_HIGH_PRIORITY.tname, TICKET_OPENED_PERCENT_HIGH_PRIORITY.where , ''  )  
    if(ticket_opened_percent_high_priority_data?.data[0])
    setTicket_opened_percent_high_priority_data(ticket_opened_percent_high_priority_data?.data[0])
    let ticket_opened_percent_high_urgency_data = await  axiosFn("get", '', TICKET_OPENED_PERCENT_HIGH_URGENCY.what, TICKET_OPENED_PERCENT_HIGH_URGENCY.tname, TICKET_OPENED_PERCENT_HIGH_URGENCY.where , ''  )  
    if(ticket_opened_percent_high_urgency_data?.data[0])
    setTicket_opened_percent_high_urgency_data(ticket_opened_percent_high_urgency_data?.data[0])
    let ticket_opened_closed_today_data = await  axiosFn("get", '', TICKET_OPENED_CLOSED_TODAY.what, TICKET_OPENED_CLOSED_TODAY.tname, TICKET_OPENED_CLOSED_TODAY.where , ''  )  
    if(ticket_opened_closed_today_data?.data[0])
    setTicket_opened_closed_today_data(ticket_opened_closed_today_data?.data[0])
    
  }
  

  const getDataAssignee = async ( name:string) => {
    
    const TICKET_OPENED_BY_ASSIGNEE = {
      what: "  count(id) as value, isnull(assignee_name, N'@none') as type, '       ' + isnull(assignee_name, N'@none') as name ",
      tname: " V_tickets ",
      where: " active = 1  group by assignee_name order by count(id) desc " 
    }
    const ticket_open_by_assignee_data = await  axiosFn("get", '', TICKET_OPENED_BY_ASSIGNEE.what.replace(/@none/g, t('non') + ' ' + t('assignee') ), TICKET_OPENED_BY_ASSIGNEE.tname,  "  team_name = '" + name + "' AND " + TICKET_OPENED_BY_ASSIGNEE.where  , ''  )  
    if(ticket_open_by_assignee_data?.data)
    setTicket_open_by_assignee_data(ticket_open_by_assignee_data.data) 
  }

  const TICKET_OPENED_BY_TEAM_CONFIG = {
    appendPadding: 15,
    data: ticket_open_by_team_data  || [] ,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    // legend:false,
    locale:user.locale,
    label: {
      // type: 'spider',
      type: 'inner',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    // title: {
    //   visible: true,
    //   text: '日流量统计图',
    // },
    // label: {
    //   type: 'inner',
    //   offset: '-30%',
    //   content: function content(_ref:any) {
    //     return ''.concat(_ref.value, '%');
    //   },
    //   style: {
    //     fontSize: 14,
    //     textAlign: 'center',
    //   },
    // },
    // interactions: [{ type: 'element-selected' }, { type: 'element-active' }]
    
  } 
  const TICKET_OPENED_BY_TEAM_TREE_MAP_CONFIG = {
    data: { name: 'root', children:ticket_open_by_team_data  || [] },
    colorField: 'name',
    // Legend:false,

  }
  const TICKET_OPENED_BY_ASSIGNEE_TREE_MAP_CONFIG = {
    data: { name: 'root', children:ticket_open_by_assignee_data  || [] },
    colorField: 'name',
    // Legend:false,
    

  }
  const TICKET_OPENED_BY_PRIORITY_CONFIG = {
    appendPadding: 15,
    data: ticket_open_by_priority_data ,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    // legend:false,
    locale:user.locale,
    label: {
      type: 'inner',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  }
  const TICKET_OPENED_BY_URGENCY_CONFIG = {
    appendPadding: 15,
    data: ticket_open_by_urgency_data ,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    // legend:false,
    locale:user.locale,
    label: {
      type: 'inner',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  }
  const TICKET_OPENED_BY_CATEGORY_CONFIG = {
    data: ticket_open_by_category_data ,
    xField: 'value',
    yField: 'type',
    barBackground: { style: { fill: 'rgba(0,0,0,0.1)' } },
    interactions: [
      {
        type: 'active-region',
        enable: false,
      },
    ],
    meta: {
      type: { alias: '' },
      value: { alias: t('tickets') },
    },
    seriesField: 'type',
    // legend: null,
    // // legend: {
    //   position: 'top-left',
    // },
    // isRange: true
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
      percent: +(ticket_opened_percent_high_priority_data?.target)  / (+ticket_opened_percent_high_priority_data?.all) ,
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
    percent: +(ticket_opened_percent_high_urgency_data?.target)  / (+ticket_opened_percent_high_urgency_data?.all) ,
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
    percent:  liquidStyle( +(ticket_opened_closed_today_data?.target)  / (+ticket_opened_closed_today_data?.all)) ,
    outline: {
      border: 8,
      distance: 4,
      radius: 0.8,
    },
    statistic: {
      title: {
        formatter: function formatter() {
          return ticket_opened_closed_today_data?.all + '/' + ticket_opened_closed_today_data?.target
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
    data: ticket_by_weekday ,
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
    // legend:false
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
           setQueries( prevQueries => prevQueries.filter(pQ=>pQ.id!==id))
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
  
  const refresh = () => {
    getData(); 
    getQueries(); 
    if(selectedTeam)
    getDataAssignee(selectedTeam)
  }
  const goTo = (q:IQuery) => {
    if(edit) return
    setQueriesCache({ [q.factory]: q.query, [q.factory+'_label']: q.name })
    if(q.factory === 'ticket') {
      router.push(RouteNames.TICKETS)
    } else if(q.factory === 'contact') { 
      router.push(RouteNames.USERS)
    } 
    else if(q.factory === 'ci') {
      router.push(RouteNames.CIS)
    } 
    else if(q.factory === 'allWf') {
      router.push(RouteNames.WFS)
    } 
  }
  const drillDownChart = (event: any, reportName: string) => {

  if(reportName === 'ticket_open_by_team_data') {
    if(event[0]?.data?.name) {
      let name = event[0]?.data?.name.toString().trim()
      setSelectedTeam(name)
      getDataAssignee(name)
      setTicket_open_by_team_name(name)
    }
  } else if(reportName === 'ticket_open_by_assignee_data') {
    if(event[0]?.data?.name) {
      let name = event[0]?.data?.name.toString().trim()
      let ass_name =  name.replace( t('non') + ' ' + t('assignee') , '')
      let query = dataPartition(" active = 1 ", true) + " AND  team_name = N'" + selectedTeam + "' AND " + "  isnull(assignee_name, '') = N'" + ass_name + "'"
      let q:IQuery = {factory:'ticket', name: t('TICKET_OPENED_BY_ASSIGNEE'), query: query } as IQuery
      goTo(q)
    }
  }
    
  }

  return (
    <Card>
       <Tooltip title={t('refresh')}>
      <ReloadOutlined 
      onClick={refresh}
      style={{fontSize:'24px',fontWeight:900}}/>&nbsp;&nbsp;
      {moment().format("DD/MM/YY HH:mm:ss")}
      </Tooltip>
      <Row key="1">
        <Col  xs={24} xl={4} sm={12}>
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_PERCENT_HIGH_PRIORITY')}</h3>
         <Gauge  {...TICKET_OPENED_PERCENT_HIGH_PRIORITY_CONFIG}  style={{height:200}} />
        </Col>
        <Col  xs={24} xl={4} sm={12}>
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_PERCENT_HIGH_URGENCY')}</h3>
         <Gauge  {...TICKET_OPENED_PERCENT_HIGH_URGENCY_CONFIG}  style={{height:200}} />
        </Col>
        <Col  xs={24} xl={4} sm={12}>
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_CLOSED_TODAY')}</h3>
         <Liquid  {...TICKET_OPENED_CLOSED_TODAY_CONFIG}  style={{height:200}} />
        </Col>
        <Col  xs={24} xl={12} sm={12}>
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_TEAM')}</h3>
         <Treemap   {...TICKET_OPENED_BY_TEAM_TREE_MAP_CONFIG}  style={{height:200}}
         onReady={(plot:any) => {
          plot.chart.on('plot:click', (evt:any) => {
          const { x, y } = evt;
          drillDownChart(plot.chart.getTooltipItems({ x, y }), 'ticket_open_by_team_data');
           });
          }}
        />
        </Col>
        {
        selectedTeam.length > 0 &&
        <Col  xs={24} xl={24} sm={24}>
        <Tooltip title={t('close') + ' ' + t('TICKET_OPENED_BY_ASSIGNEE') + ' ' + t('team') + ' ' + ticket_open_by_team_name }>
        <CloseCircleOutlined onClick={() => setSelectedTeam('')} style={{fontSize:26}}/> 
        </Tooltip>
        <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_ASSIGNEE') + ' ' + t('team') + ' ' + ticket_open_by_team_name}</h3>
        <Treemap   {...TICKET_OPENED_BY_ASSIGNEE_TREE_MAP_CONFIG}  style={{height:150}}
        onReady={(plot:any) => {
          plot.chart.on('plot:click', (evt:any) => {
          const { x, y } = evt;
          drillDownChart(plot.chart.getTooltipItems({ x, y }), 'ticket_open_by_assignee_data');
           });
          }}
        />
        </Col>
        }
       
        
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
             onClick={() => { setGetMore(true)}}
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
        <Pie  {...TICKET_OPENED_BY_TEAM_CONFIG} style={{direction:'ltr'}}/>
       </Col>
       <Col  xs={24} xl={8} sm={12}>
        <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_PRIORITY')}</h3>
        <Pie  {...TICKET_OPENED_BY_PRIORITY_CONFIG} style={{direction:'ltr'}} />
       </Col>
       <Col  xs={24} xl={8} sm={12}>
        <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_URGENCY')}</h3>
        <Pie  {...TICKET_OPENED_BY_URGENCY_CONFIG} style={{direction:'ltr'}}/>
       </Col>
       </Row>
       <Row key="3">
       <Col  xs={24} xl={12} >
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_CATEGORY')}</h3>
         <Bar  {...TICKET_OPENED_BY_CATEGORY_CONFIG} 
        style={{direction:'ltr'}}
  />
        </Col>  
       <Col  xs={24} xl={12} >
        <h3 style={{textAlign:'center'}}>{t('TICKET_BY_WEEKDAY')}</h3>
        <Waterfall  {...TICKET_BY_WEEKDAY_CONFIG} 
        style={{direction:'ltr'}}/>
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
                        <Col  xs={24} xl={4} lg={6}  sm={8} key={q.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        >
                        <Tooltip title={q.name + ' ' + q.count}>
                        <div   key={q.id} 
                        className={!edit ? 'homeQueryCard' : 'homeQueryCardEdit'}
                        onClick={()=>goTo(q)}
                        >
                         
                        <Badge.Ribbon  text={q.count + '' + (q.count !== q.countPrev ? ('<=' + q.countPrev) : '' ) } color="#f5222d">
                        
                        <Card size="small" title= {q.name.toString().substring(0,40)}    style={{alignItems:'center',textAlign:'center',color:'white'}}
                        bodyStyle={{height:1,padding:1}}
                        headStyle={{background: '#49b6ba',
                        border: '1px solid #28a4ae',
                        borderRadius:5,
                        color:'white'
                          }}
                        type="inner"
                        >
                        </Card>  
                        </Badge.Ribbon>   
                      
                        {/* <h3  key={1} style={{alignItems:'center',textAlign:'center',color:'white'}}>
                        <Tooltip title={q.name + ' ' + q.count}>
                        {q.name.toString().substring(0,40)} 
                        </Tooltip>
                        </h3>  */}
                        {/* <div key={2} style={{alignItems:'center',textAlign:'center'}}>
                         <b>{q.count}</b>
                        </div>  */}
                        {
                          edit &&
                          <Tooltip title={t('delete')}>
                            <Popconfirm title={t('are_you_sure')} okText={t('yes')} cancelText={t('no')}  onConfirm={() => deleteQuery(q.id)}>
                            <DeleteOutlined 
                            ></DeleteOutlined>
                            </Popconfirm>
                          </Tooltip>
                        }
                        </div>
                        </Tooltip>
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
  
  
  export default HomeAssignee;
  ///https://github.com/ant-design/ant-design-charts#readme