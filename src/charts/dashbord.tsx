import React, { FC, useEffect, useState } from 'react';
import { Bar, Gauge, Pie, Liquid, measureTextWidth  } from '@ant-design/charts';
import { axiosFn } from '../axios/axios';
import { useTranslation } from 'react-i18next';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { Card, Col, Row, Tooltip } from 'antd';
import { TICKET_OPENED_BY_CATEGORY, TICKET_OPENED_BY_PRIORITY, TICKET_OPENED_BY_TEAM, TICKET_OPENED_BY_URGENCY, TICKET_OPENED_CLOSED_TODAY, TICKET_OPENED_PERCENT_HIGH_PRIORITY, TICKET_OPENED_PERCENT_HIGH_URGENCY } from '../models/IChart';
import { ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';


const Dashboard: FC = () => {
  const { t } = useTranslation();    
  const { user } = useTypedSelector(state => state.auth)
  let chart: any;

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
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  const [configs, setCOnfigs] = useState([] as CHART_CONFIG[])
  useEffect(  ()  => {
    getData()
  }, [])
const getData = async () => {
  const ticket_open_by_team_data = await  axiosFn("get", '', TICKET_OPENED_BY_TEAM.what.replace('@none', t('non') + ' ' + t('team') ), TICKET_OPENED_BY_TEAM.tname, TICKET_OPENED_BY_TEAM.where , ''  )  
  if(ticket_open_by_team_data?.data)
  setCOnfigs( configs => [...configs , { name: 'ticket_open_by_team_data' , config: ticket_open_by_team_data.data} ] )

  let ticket_open_by_priority_data = await  axiosFn("get", '', TICKET_OPENED_BY_PRIORITY.what.replace('@none', t('non') + ' ' + t('priority') ), TICKET_OPENED_BY_PRIORITY.tname, TICKET_OPENED_BY_PRIORITY.where , ''  )  
  if(ticket_open_by_priority_data?.data)
  setCOnfigs(configs => [ ...configs, { name: 'ticket_open_by_priority_data' , config: ticket_open_by_priority_data.data} ])
  
  let ticket_open_by_urgency_data = await  axiosFn("get", '', TICKET_OPENED_BY_URGENCY.what.replace('@none', t('non') + ' ' + t('urgency') ), TICKET_OPENED_BY_URGENCY.tname, TICKET_OPENED_BY_URGENCY.where , ''  )  
  if(ticket_open_by_urgency_data?.data)
  setCOnfigs(configs => [ ...configs, { name: 'ticket_open_by_urgency_data' , config: ticket_open_by_urgency_data.data} ])

  let ticket_open_by_category_data = await  axiosFn("get", '', TICKET_OPENED_BY_CATEGORY.what.replace('@none', t('non') + ' ' + t('tcategory') ), TICKET_OPENED_BY_CATEGORY.tname, TICKET_OPENED_BY_CATEGORY.where , ''  )  
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
    legend: true,
    barBackground: { style: { fill: 'rgba(0,0,0,0.1)' } },
    interactions: [
      {
        type: 'active-region',
        enable: false,
      },
    ],
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
  const TICKET_OPENED_CLOSED_TODAY_CONFIG = {
    percent:  +(configs.find( c => c.name === 'ticket_opened_closed_today_data')?.config[0].target)  / (+configs.find( c => c.name === 'ticket_opened_closed_today_data')?.config[0].all) ,
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

  return (
    <Card>
       <Tooltip title={t('refresh')}>
      <ReloadOutlined 
      onClick={()=>getData()}
      style={{fontSize:'24px',fontWeight:900}}/>&nbsp;&nbsp;
      {moment().format("DD/MM/YY HH:mm:ss")}
      </Tooltip>
      <Row key="1">
        <Col  xs={24} xl={6} >
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_CATEGORY')}</h3>
         <Bar  {...TICKET_OPENED_BY_CATEGORY_CONFIG} />
        </Col>
        <Col  xs={24} xl={6} >
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_PERCENT_HIGH_PRIORITY')}</h3>
         <Gauge  {...TICKET_OPENED_PERCENT_HIGH_PRIORITY_CONFIG} />
        </Col>
        <Col  xs={24} xl={6} >
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_PERCENT_HIGH_URGENCY')}</h3>
         <Gauge  {...TICKET_OPENED_PERCENT_HIGH_URGENCY_CONFIG} />
        </Col>
        <Col  xs={24} xl={6} >
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_CLOSED_TODAY')}</h3>
         <Liquid  {...TICKET_OPENED_CLOSED_TODAY_CONFIG} />
        </Col>
      </Row>
      <Row key="2">
        <Col  xs={24} xl={8} >
        <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_TEAM')}</h3>
        <Pie  {...TICKET_OPENED_BY_TEAM_CONFIG} />
       </Col>
       <Col  xs={24} xl={8} >
        <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_PRIORITY')}</h3>
        <Pie  {...TICKET_OPENED_BY_PRIORITY_CONFIG} />
       </Col>
       <Col  xs={24} xl={8} >
        <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_URGENCY')}</h3>
        <Pie  {...TICKET_OPENED_BY_URGENCY_CONFIG} />
       </Col>
      </Row>
      
    </Card>

  );
};
export default Dashboard;