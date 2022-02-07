
import  {FC, useEffect, useState} from 'react';
import { Badge, Card, Col, Popconfirm, Row, Tooltip, List, message, Avatar } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {  Treemap  } from '@ant-design/charts';
import VirtualList from 'rc-virtual-list';

import { axiosFn } from '../../axios/axios';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IChatQuery } from '../../models/IChart';
import { ReloadOutlined, PlusCircleOutlined, MinusCircleOutlined,EditOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { ANALYST_DTP_REPORTS } from '../../models/IUser';
import ScrollList from '../../components/ScrollList';
import { ITicket } from '../../models/ITicket';

const TicketMangerView:FC = () => {
  const { user, defaultRole } = useTypedSelector(state => state.auth)
  const { t } = useTranslation();    
  const [selectedTeam, setSelectedTeam] =  useState('')
  const [ticket_open_by_team_data, setTicket_open_by_team_data ] = useState()
  const [ticket_open_by_assignee_data, setTicket_open_by_assignee_data ] = useState()
  const [ticket_open_by_team_name, setTicket_open_by_team_name ] = useState()
  const [ticket_open_by_team_name_list, setTicket_open_by_team_name_list ] = useState([] as any[])
  const [ticket_open_by_team_name_list_ass, setTicket_open_by_team_name_list_ass ] = useState([] as any[])
  const [ticket_open_by_team_name_list_ass_name, setTicket_open_by_team_name_list_ass_name ] = useState([] as string[])
  const  NO_ASSIGNEE_LABEL = t('non') + ' ' + t('assignee')
  useEffect(  ()  => {
      getData()
  }, [])
  const getData =  async (  ) => {
    let team_where = "active = 1"
    team_where = ANALYST_DTP_REPORTS.replace(/currentUser/g, user.id) + ( team_where !== '' ? " AND ( " + team_where + ")" : "" )
    const TICKET_OPENED_BY_TEAM:IChatQuery = {
      what: "  count(id) as value, isnull(team_name, N'@none') as type, '' + isnull(team_name, N'@none') as name ",
      tname: " V_tickets ",
      where: team_where + " group by team_name order by count(id) desc " 
    } 
    
    const ticket_open_by_team_data = await  axiosFn("get", '', TICKET_OPENED_BY_TEAM.what.replace(/@none/g, t('non') + ' ' + t('team') ), TICKET_OPENED_BY_TEAM.tname, TICKET_OPENED_BY_TEAM.where , ''  )  
      if(ticket_open_by_team_data?.data)
      setTicket_open_by_team_data(ticket_open_by_team_data?.data)
    
      
 
  }
  const getDataAssignee = async ( name:string) => {
    setTicket_open_by_team_name_list([])
    setTicket_open_by_team_name_list_ass([])
    const TICKET_OPENED_BY_ASSIGNEE = {
      what: "  count(id) as value, isnull(assignee_name, N'@none') as type, '' + isnull(assignee_name, N'@none') as name ",
      tname: " V_tickets ",
      where: " active = 1  group by assignee_name order by count(id) desc " 
    }
    const ticket_open_by_assignee_data = await  axiosFn("get", '', TICKET_OPENED_BY_ASSIGNEE.what.replace(/@none/g, t('non') + ' ' + t('assignee') ), TICKET_OPENED_BY_ASSIGNEE.tname,  "  team_name = '" + name + "' AND " + TICKET_OPENED_BY_ASSIGNEE.where  , ''  )  
    if(ticket_open_by_assignee_data?.data)
    setTicket_open_by_assignee_data(ticket_open_by_assignee_data.data) 

    const ticket_open_by_team_data_list = await  axiosFn("get", '', "*", "V_tickets", "  team_name = '" + name + "' AND active = 1  order by create_date desc" , ''  )  

    if(ticket_open_by_team_data_list?.data) {
      setTicket_open_by_team_name_list(ticket_open_by_team_data_list?.data)
      const ticket_open_by_team_members = await  axiosFn("get", '', "*", "V_teammember", "  team_name = '" + name + "' AND active = 1  order by team_name" , ''  )  
      const noTeam = {
              active: 1,
              create_date: 1633781682,
              email: "",
              id: "",
              last_mod_by: null,
              last_mod_dt: null,
              manager: 0,
              member: null,
              member_name: t('non') + ' ' + t('assignee'),
              notify: 1,
              team: "",
              team_name: name
      }
      if(ticket_open_by_team_members?.data)
      setTicket_open_by_team_name_list_ass([noTeam, ...ticket_open_by_team_members?.data])
      //const withoutDuplicates_name:string[] = Array.from(new Set(ticket_open_by_team_data_list?.data.map((ass:any) => ass.assignee_name === null ? t('non') + ' ' + t('assignee') : ass.assignee_name)));
      //const withoutDuplicates:string[] = Array.from(new Set(ticket_open_by_team_data_list?.data.map((ass:any) => ass.assignee_name  )));
    }
      
  }

  const TICKET_OPENED_BY_TEAM_TREE_MAP_CONFIG = {
    data: { name: 'root', children:ticket_open_by_team_data  || [] },
    colorField: 'name',
  }
  const TICKET_OPENED_BY_ASSIGNEE_TREE_MAP_CONFIG = {
    data: { name: 'root', children:ticket_open_by_assignee_data  || [] },
    colorField: 'name',
  }
  
  
  const drillDownChart = (event: any, reportName: string) => {
    if(reportName === 'ticket_open_by_team_data') {
      if(event[0]?.data?.name) {
        let name = event[0]?.data?.name.toString().trim()
        setSelectedTeam(name)
        setTicket_open_by_team_name(name)
        getDataAssignee(name)
      }
    }  
  }
  const refresh = () => {
    getData(); 
    if(selectedTeam)
    getDataAssignee(selectedTeam)
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
      <Col  xs={24} xl={12} sm={12}>
         <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_TEAM')}</h3>
         <Treemap   {...TICKET_OPENED_BY_TEAM_TREE_MAP_CONFIG}  
         style={{height:150,direction:'ltr'}}
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
        <Col  xs={24} xl={12} sm={12}>
     
        <h3 style={{textAlign:'center'}}>{t('TICKET_OPENED_BY_ASSIGNEE') + ' ' + t('team') + ' ' + ticket_open_by_team_name}</h3>
        <Treemap   {...TICKET_OPENED_BY_ASSIGNEE_TREE_MAP_CONFIG}  style={{height:150,direction:'ltr'}}
        onReady={(plot:any) => {
          plot.chart.on('plot:click', (evt:any) => {
          const { x, y } = evt;
          drillDownChart(plot.chart.getTooltipItems({ x, y }), 'ticket_open_by_assignee_data');
           });
          }}
        />
        <Tooltip title={t('close') + ' ' + t('TICKET_OPENED_BY_ASSIGNEE') + ' ' + t('team') + ' ' + ticket_open_by_team_name }>
        <CloseCircleOutlined onClick={() => setSelectedTeam('')} style={{fontSize:20,alignSelf:'end'}}/> 
        </Tooltip>
        </Col>
        }
        </Row>
        { 
         ticket_open_by_team_name_list.length && 
         <Row>
           {
            ticket_open_by_team_name_list_ass.map((ass:any, index:number) => (
              <Col  xs={24} xl={6} sm={8} key={index}>
                <Card title={ass.member_name + ' ' + ticket_open_by_team_name_list.filter(t=> {
                   let member_name = ass?.member_name || ''
                   let assignee_name = t?.assignee_name || ''
                   if(member_name ===  NO_ASSIGNEE_LABEL)   member_name  = ''
                   if(assignee_name === member_name ) return t
                 }).length} 
                headStyle={{height:10,fontSize:12,background:'lightgray'}}>
                 <ScrollList
                 data={ticket_open_by_team_name_list.filter(t=> {
                   let member_name = ass?.member_name || ''
                   let assignee_name = t?.assignee_name || ''
                   if(member_name ===  NO_ASSIGNEE_LABEL)   member_name  = ''
                   if(assignee_name === member_name ) return t
                 })
                  
                }
                   />
                </Card>
              </Col>))
           }
         </Row>
        }
      </Card>
  )
}
export default TicketMangerView;
