import React, { FC, useEffect, useState } from 'react';
import { Bar, Gauge, Pie, Liquid, measureTextWidth , Waterfall } from '@ant-design/charts';
import { axiosFn } from '../axios/axios';
import { useTranslation } from 'react-i18next';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { Card, Col, Row, Tooltip } from 'antd';

import { ReloadOutlined, MinusCircleOutlined,PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { CHART_CONFIG, IChatQuery } from '../models/IChart';
import { FROM, SELECT, WHERE } from '../utils/formManipulation';
import { ANALYST_DTP, ANALYST_DTP_REPORTS } from '../models/IUser';
import { PRIORITY_HIGH, PRIORITY_MEDIUM, URGENCY_HIGH, URGENCY_MEDIUM } from '../models/ITicket';
import { Treemap } from '@ant-design/charts';
import { useAction } from '../hooks/useAction';


const Dashboard: FC = () => {
  const { user, defaultRole } = useTypedSelector(state => state.auth)
  const { configs} = useTypedSelector(state => state.cache)
  const {setConfigs, setConfigsArr } = useAction()
  
  const dataPartition = (where: string, report: boolean = false) => {
    if(defaultRole)
    if(defaultRole.label !== 'Admin') {
      if(report)
     return ANALYST_DTP_REPORTS.replace(/currentUser/g, user.id) + ( where !== '' ? " AND ( " + where + ")" : "" )
     else
     return ANALYST_DTP.replace(/currentUser/g, user.id) + ( where !== '' ? " AND ( " + where + ")" : "" )
    }
    return where
   }
  
  const { t } = useTranslation();    
  let chart: any;

  // Export Image
  const downloadImage = () => {
    chart?.downloadImage();
  };

  // Get chart base64 string
  const toDataURL = () => {
    console.log(chart?.toDataURL());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getData()
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  // const [c0nfigs, setCOnfigs] = useState([] as CHART_CONFIG[])
  //const [finishConfig, setFinishConfig] =  useState(false) 
  useEffect(  ()  => {
    getData()
  }, [])

  const [getMore, setGetMore] =  useState(true) 
  const getData = async () => {
    const TICKET_OPENED_BY_TEAM:IChatQuery = {
      what: "  count(id) as value, isnull(team_name, N'@none') as type, '       ' + isnull(team_name, N'@none') as name ",
      tname: " V_tickets ",
      where: dataPartition(" active = 1 ", true) + " group by team_name order by count(id) desc " 
    } 
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
    let c0nfigs:CHART_CONFIG[] = [] 
    const ticket_open_by_team_data = await  axiosFn("get", '', TICKET_OPENED_BY_TEAM.what.replace(/@none/g, t('non') + ' ' + t('team') ), TICKET_OPENED_BY_TEAM.tname, TICKET_OPENED_BY_TEAM.where , ''  )  
    if(ticket_open_by_team_data?.data)
    c0nfigs.push({ name: 'ticket_open_by_team_data' , config: ticket_open_by_team_data.data}) 
    let ticket_open_by_priority_data = await  axiosFn("get", '', TICKET_OPENED_BY_PRIORITY.what.replace(/@none/g, t('non') + ' ' + t('priority') ), TICKET_OPENED_BY_PRIORITY.tname, TICKET_OPENED_BY_PRIORITY.where , ''  )  
    if(ticket_open_by_priority_data?.data)
    c0nfigs.push({ name: 'ticket_open_by_priority_data' , config: ticket_open_by_priority_data.data})
    let ticket_open_by_urgency_data = await  axiosFn("get", '', TICKET_OPENED_BY_URGENCY.what.replace(/@none/g, t('non') + ' ' + t('urgency') ), TICKET_OPENED_BY_URGENCY.tname, TICKET_OPENED_BY_URGENCY.where , ''  )  
    if(ticket_open_by_urgency_data?.data)
    c0nfigs.push( { name: 'ticket_open_by_urgency_data' , config: ticket_open_by_urgency_data.data})
    let ticket_open_by_category_data = await  axiosFn("get", '', TICKET_OPENED_BY_CATEGORY.what.replace(/@none/g, t('non') + ' ' + t('tcategory') ), TICKET_OPENED_BY_CATEGORY.tname, TICKET_OPENED_BY_CATEGORY.where , ''  )  
    if(ticket_open_by_category_data?.data)
    c0nfigs.push( { name: 'ticket_open_by_category_data' , config: ticket_open_by_category_data.data} )
    let ticket_opened_percent_high_priority_data = await  axiosFn("get", '', TICKET_OPENED_PERCENT_HIGH_PRIORITY.what, TICKET_OPENED_PERCENT_HIGH_PRIORITY.tname, TICKET_OPENED_PERCENT_HIGH_PRIORITY.where , ''  )  
    if(ticket_opened_percent_high_priority_data?.data)
    c0nfigs.push( { name: 'ticket_opened_percent_high_priority_data' , config: ticket_opened_percent_high_priority_data.data})
    let ticket_opened_percent_high_urgency_data = await  axiosFn("get", '', TICKET_OPENED_PERCENT_HIGH_URGENCY.what, TICKET_OPENED_PERCENT_HIGH_URGENCY.tname, TICKET_OPENED_PERCENT_HIGH_URGENCY.where , ''  )  
    if(ticket_opened_percent_high_urgency_data?.data)
    c0nfigs.push( { name: 'ticket_opened_percent_high_urgency_data' , config: ticket_opened_percent_high_urgency_data.data})
    let ticket_opened_closed_today_data = await  axiosFn("get", '', TICKET_OPENED_CLOSED_TODAY.what, TICKET_OPENED_CLOSED_TODAY.tname, TICKET_OPENED_CLOSED_TODAY.where , ''  )  
    if(ticket_opened_closed_today_data?.data)
    c0nfigs.push( { name: 'ticket_opened_closed_today_data' , config: ticket_opened_closed_today_data.data} )
    let ticket_by_weekday = await  axiosFn("get", '', TICKET_BY_WEEKDAY.what, TICKET_BY_WEEKDAY.tname, TICKET_BY_WEEKDAY.where , ''  )  
    if(ticket_by_weekday?.data)
    {
      let arr_ticket_by_weekday = ticket_by_weekday.data.map( (e: { type: any; }) => {
        return {...e ,  type: t(e.type) }
  
      } )
      c0nfigs.push( { name: 'ticket_by_weekday' , config: arr_ticket_by_weekday} )
    }
    setConfigsArr(c0nfigs)
  }
  
    
    let TICKET_OPENED_BY_TEAM_CONFIG = {
      // appendPadding: 15,
      data:  configs.find( c => c.name === 'ticket_open_by_team_data')?.config  || [] ,
      angleField: 'value',
      colorField: 'type',
      radius: 0.75,
      // legend:false,
      locale:user.locale,
      label: {
        type: 'spider',
        labelHeight: 28,
        content: '{name}\n{percentage}',
      },
      // interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    }  
    let TICKET_OPENED_BY_TEAM_TREE_MAP_CONFIG = {
      data: { name: 'root',  children:configs.find( c => c.name === 'ticket_open_by_team_data')?.config  || [] } ,
      colorField: 'name',
      // Legend:false,
  
    }
    let TICKET_OPENED_BY_PRIORITY_CONFIG = {
      appendPadding: 15,
      data: configs.find( c => c.name === 'ticket_open_by_priority_data')?.config  || [] ,
      angleField: 'value',
      colorField: 'type',
      radius: 0.75,
      // legend:false,
      locale:user.locale,
      label: {
        type: 'spider',
        labelHeight: 28,
        content: '{name}\n{percentage}',
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    }
    let TICKET_OPENED_BY_URGENCY_CONFIG = {
      appendPadding: 15,
      data:  configs.find( c => c.name === 'ticket_open_by_urgency_data')?.config  || [] ,
      angleField: 'value',
      colorField: 'type',
      radius: 0.75,
      // legend:false,
      locale:user.locale,
      label: {
        type: 'spider',
        labelHeight: 28,
        content: '{name}\n{percentage}',
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    }
    let TICKET_OPENED_BY_CATEGORY_CONFIG = {
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
    let TICKET_OPENED_PERCENT_HIGH_PRIORITY_CONFIG = {
        percent:  +(configs.find( c => c.name === 'ticket_opened_percent_high_priority_data')?.config[0].target)  / (+configs.find( c => c.name === 'ticket_opened_percent_high_priority_data')?.config[0].all)  ,
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
    let TICKET_OPENED_PERCENT_HIGH_URGENCY_CONFIG = {
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
    let liquidStyle = (percent:number) => {
      percent = percent || 0.01
      if(percent<=0) percent =  0.01
      if(percent>1) percent = 0.99
      return percent
  
    }
    let TICKET_OPENED_CLOSED_TODAY_CONFIG = {
      percent: liquidStyle( +(configs.find( c => c.name === 'ticket_opened_closed_today_data')?.config[0].target)  / (+configs.find( c => c.name === 'ticket_opened_closed_today_data')?.config[0].all))  ,
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
    
    let TICKET_BY_WEEKDAY_CONFIG = {
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
      // legend:false
    }

  return (
    <>
    {
      configs  && configs.length > 7 &&
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
     
      </Card>
    }
    </>
  

  );
};
export default Dashboard;