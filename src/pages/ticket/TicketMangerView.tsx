
import  {FC, useEffect, useRef, useState} from 'react';
import { Card, Col, Row, Tooltip, Avatar, Drawer, Tag, Popover, Switch, Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {  Treemap  } from '@ant-design/charts';
import { axiosFn } from '../../axios/axios';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { IChatQuery } from '../../models/IChart';
import { ReloadOutlined, PlusCircleOutlined, ToolOutlined,ShrinkOutlined,ArrowsAltOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ANALYST_DTP_REPORTS } from '../../models/IUser';
import {  DragDropContext,
  Draggable,
  Droppable,
  DropResult } from 'react-beautiful-dnd';
import { getWaitingTime, secondsToDhms, uTd } from '../../utils/formManipulation';
import { useAction } from '../../hooks/useAction';
import TicketAssignee from '../../components/tickets/TicketAssignee';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import PopoverDtl from './PopoverDtl';
import { ITicket } from '../../models/ITicket';

const TicketMangerView:FC = () => {
  const { user } = useTypedSelector(state => state.auth)
  const {setAlert,setSelectedWfsId} = useAction()
  const { t } = useTranslation();    
  const [selectedTeam, setSelectedTeam] =  useState('')
  const [ticket_open_by_team_data, setTicket_open_by_team_data ] = useState()
  const [ticket_open_by_assignee_data, setTicket_open_by_assignee_data ] = useState()
  const [ticket_open_by_team_name, setTicket_open_by_team_name ] = useState()
  const [ticket_open_by_team_name_list, setTicket_open_by_team_name_list ] = useState([] as any[])
  const [ticket_open_by_team_name_list_ass, setTicket_open_by_team_name_list_ass ] = useState([] as any[])
  const [ticketInfo, setTicketInfo] = useState('');
  const [wfInfo, setWfInfo] = useState(''); 
  const [ticketsWfls, setTicketsWfls] = useState('tickets');
  
  const  NO_ASSIGNEE_LABEL = t('non') + ' ' + t('assignee')
  const {  width } = useWindowDimensions();
  useEffect(  ()  => {
    getData(); 
    if(selectedTeam)
    getDataAssignee(selectedTeam)
  }, [ticketsWfls])
  const getData =  async (  ) => {
    let team_where = "active = 1"
    if(ticketsWfls!=='tickets') {
      team_where =  "status_name = 'Pend' "
    }
    team_where = ANALYST_DTP_REPORTS.replace(/currentUser/g, user.id) + ( team_where !== '' ? " AND ( " + team_where + ")" : "" )
    let TICKET_OPENED_BY_TEAM:IChatQuery = {
      what: "  count(id) as value, isnull(team_name, N'@none') as type, '' + isnull(team_name, N'@none') as name ",
      tname: " V_tickets ",
      where: team_where + " group by team_name order by count(id) desc " 
    } 
    if(ticketsWfls!=='tickets') {
      TICKET_OPENED_BY_TEAM.tname = " V_wfs "
      TICKET_OPENED_BY_TEAM.where = team_where + " group by team_name order by count(id) desc " 
    }
    let ticket_open_by_team_data = await  axiosFn("get", '', TICKET_OPENED_BY_TEAM.what.replace(/@none/g, t('non') + ' ' + t('team') ), TICKET_OPENED_BY_TEAM.tname, TICKET_OPENED_BY_TEAM.where , ''  )  
      if(ticket_open_by_team_data?.data)
      setTicket_open_by_team_data(ticket_open_by_team_data?.data)
  }

  const ticketsWflsRef = useRef(null);
  const getDataAssignee = async ( name:string) => {
    let _getTicketsWfls = 'tickets'
    if (ticketsWflsRef.current) {
      _getTicketsWfls = ticketsWflsRef.current['id']
  }

    setTicket_open_by_team_name_list([])
    setTicket_open_by_team_name_list_ass([])
    let TICKET_OPENED_BY_ASSIGNEE = {
      what: "  count(id) as value, isnull(assignee_name, N'@none') as type, '' + isnull(assignee_name, N'@none') as name ",
      tname: " V_tickets ",
      where: " active = 1  group by assignee_name order by count(id) desc " 
    }
    let tWhere = "active = 1  order by create_date desc "
    if(_getTicketsWfls!=='tickets') {

      TICKET_OPENED_BY_ASSIGNEE.tname = " V_wfs "
      TICKET_OPENED_BY_ASSIGNEE.where = " status_name = 'Pend'  group by assignee_name order by count(id) desc " 
      tWhere = " status_name = 'Pend' order by start_dt desc  "
    }

    const ticket_open_by_assignee_data = await  axiosFn("get", '', TICKET_OPENED_BY_ASSIGNEE.what.replace(/@none/g, t('non') + ' ' + t('assignee') ), TICKET_OPENED_BY_ASSIGNEE.tname,  "  team_name = '" + name + "' AND " + TICKET_OPENED_BY_ASSIGNEE.where  , ''  )  
    if(ticket_open_by_assignee_data?.data)
    setTicket_open_by_assignee_data(ticket_open_by_assignee_data.data) 

    const ticket_open_by_team_data_list = await  axiosFn("get", '', "*", TICKET_OPENED_BY_ASSIGNEE.tname, "  team_name = '" + name + "' AND " + tWhere, ''  )  

    if(ticket_open_by_team_data_list?.data) {
      setTicket_open_by_team_name_list(ticket_open_by_team_data_list?.data)
      const ticket_open_by_team_members = await  axiosFn("get", '', "*", "V_teammember", "  team_name = '" + name + "' AND active = 1  order by team_name" , ''  )  
      const noTeam = {
              active: 1,
              create_date: 1633781682,
              email: "",
              id: "345",
              last_mod_by: null,
              last_mod_dt: null,
              manager: 0,
              member: null,
              member_name: t('non') + ' ' + t('assignee'),
              notify: 1,
              team: "",
              team_name: name,
              state: true
      }
      if(ticket_open_by_team_members?.data) {
        let ticket_open_by_team_members_ = ticket_open_by_team_members?.data
        ticket_open_by_team_members_.map((a:any,index:number)=> {
          a.index = index + 1
          a.state = false
          return a
        })
        setTicket_open_by_team_name_list_ass([{...noTeam, index:0}, ...ticket_open_by_team_members_])
      }
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
  const onDragEnd = async (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    let tbl = 'ticket'
    if(ticketsWfls!=='tickets') {
      tbl = 'wf'
    }
    let hasError = false;
    const response = await  axiosFn("put", {assignee: result.destination.droppableId}, '*', tbl, "id" , result.draggableId  )  
          if(response.data["error"]) hasError = true;
          if(response.data&&!hasError)
          {
            setAlert({
              type: 'success' ,
              message: t('ticket') + ' ' + t('updated_success'),
              closable: true ,
              showIcon: true ,
              visible: true,
              autoClose: 10 
            })
            const new_assignee = ticket_open_by_team_name_list_ass.find(a=>a.member===result.destination?.droppableId)
            let changedTicket = ticket_open_by_team_name_list.find(t=>t.id===result.draggableId) 
            if(changedTicket)
            changedTicket = {...changedTicket, assignee_name:new_assignee?.member_name}
            setTicket_open_by_team_name_list(curr => [...curr, changedTicket])
          }
  }
  const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
    background: isDraggingOver ? "lightblue" : "transparent",
  });
  const selectTicket = (id:string, ticket ='') => 
  {
    if(ticket.length>0) {
      setTicketInfo(ticket) 
      setSelectedWfsId(id)
    } else
    setTicketInfo(id)
  }
  function  popover(event:any, record:ITicket, wf='' ) 
  {
    if(wf)
    return (
      <div key="div_hidden">{record.description}</div>
    )
    return (
         <PopoverDtl 
         record={record} 
         description={true}
         />         
    )
  }
  const changeTitleState = (id:string,state:boolean) => {
    const new_assignee_list = ticket_open_by_team_name_list_ass.map(a=> {
      if(a.member===id)
      a.state = state
      return a
    })
    
    setTicket_open_by_team_name_list_ass([...new_assignee_list])
    
  }
  function cardAssTitle (name:string,count:number,state:boolean, id:string) {
    return (
            <div style={{display:'flex', justifyContent:'space-around', justifyItems:'center'}}> 
                <span>{name}</span>
                <Avatar style={{backgroundColor:'#f56a00', fontSize:12, marginTop: -10}}>{count}</Avatar> 
                {
                  state ?
                  <ShrinkOutlined onClick={()=>changeTitleState(id,false)}
                  style={{color:'gray', fontSize:22,cursor:'pointer'}} />:
                  <ArrowsAltOutlined 
                  onClick={()=>changeTitleState(id,true)}
                  style={{color:'gray', fontSize:22,cursor:'pointer'}} />
                }
            </div>
           )

  } 
  const  onChangeTicketsWfls = (checked:boolean) => {
    let stateObj = 'tickets'
    if(!checked) stateObj = 'wf'
    setTicketsWfls(prev => stateObj)
  }
  const WaitingTime = (className:boolean = false, start_dt:number = 0) => {
   
    let classCss = 'fa fa-circle'
    let color = "#88d969"
   

    if(getWaitingTime(start_dt) > 64 * 60 * 60)
    {
      classCss += ' Waiting5'
      color = "#ff2400"
    }
    else
    if(getWaitingTime(start_dt) > 32 * 60 * 60)
    {
      classCss += ' Waiting4'
      color = "##ef7215"
    }
    else
    if(getWaitingTime(start_dt) > 16 * 60 * 60)
    {
      classCss += ' Waiting3'
      color = "#e8a317"
    }
    else
    if(getWaitingTime(start_dt) > 8 * 60 * 60)
    {
      classCss += ' Waiting2'
      color = "#ffd858"
    }
    else
    if(getWaitingTime(start_dt) > 2 * 60 * 60)
    {
      classCss += ' Waiting1'
      color = "#46cb18"
    }
    else
    {
      classCss += ' Waiting0'
      color = "#88d969"

    }
  
    if(className) 
    return classCss
    else
    return color
    
    }
  return (
    <Card>
      <Tooltip title={t('refresh')}>
      <ReloadOutlined 
      onClick={refresh}
      style={{fontSize:'24px',fontWeight:900}}/>&nbsp;&nbsp;
      {moment().format("DD/MM/YY HH:mm:ss")}
      &nbsp;&nbsp;
      <Switch defaultChecked onChange={onChangeTicketsWfls} />&nbsp;&nbsp;
      <label><b>{t(ticketsWfls)}</b></label>
      </Tooltip>
        <Row key="1">
      <Col  xs={24} xl={12} sm={12}>
         <div id={ticketsWfls} ref={ticketsWflsRef}></div>
         <h3 style={{textAlign:'center'}}>{(ticketsWfls==='tickets' ? t('TICKET_OPENED_BY_TEAM'):t('WF_OPENED_BY_TEAM') )}</h3>
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
     
        <h3 style={{textAlign:'center'}}>{(ticketsWfls==='tickets' ? t('TICKET_OPENED_BY_ASSIGNEE') : t('WF_OPENED_BY_ASSIGNEE')) + ' ' + t('team') + ' ' + ticket_open_by_team_name}</h3>
        <Treemap   {...TICKET_OPENED_BY_ASSIGNEE_TREE_MAP_CONFIG}  style={{height:150,direction:'ltr'}}
        // onReady={(plot:any) => {
        //   plot.chart.on('plot:click', (evt:any) => {
        //   const { x, y } = evt;
        //   drillDownChart(plot.chart.getTooltipItems({ x, y }), 'ticket_open_by_assignee_data');
        //    });
        //   }}
         />
        {/* <Tooltip title={t('close') + ' ' + t('TICKET_OPENED_BY_ASSIGNEE') + ' ' + t('team') + ' ' + ticket_open_by_team_name }>
        <CloseCircleOutlined onClick={() => setSelectedTeam('')} style={{fontSize:20,alignSelf:'end'}}/> 
        </Tooltip> */}
        </Col>
        }
        </Row>
        { 
         ticket_open_by_team_name_list.length && 
         <>
              <h3 style={{textAlign:'center'}}>{t('team') + ' ' + selectedTeam}</h3> 
              <Row key="2">
                <DragDropContext onDragEnd={onDragEnd} >
                { 
                  ticket_open_by_team_name_list_ass.map((ass:any, index:number) => (
                      <Droppable  key={index} droppableId={`${ass.member}`} >
                      {(provided, snapshot) => (
                        <Col  
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{...getListStyle(snapshot.isDraggingOver), padding:3}}
                        xs={24} xl={6} sm={8} key={index}    
                        >
                      <Card 
                         style={{borderColor: ass?.member_name !==  NO_ASSIGNEE_LABEL ? '#f0f0f0' : 'orange',color:'rgba(0, 0, 0, 0.85)'}}
                         title={cardAssTitle(ass.member_name,
                          ticket_open_by_team_name_list.filter(t=> {
                          let member_name = ass?.member_name || ''
                          let assignee_name = t?.assignee_name || ''
                          if(member_name ===  NO_ASSIGNEE_LABEL)   member_name  = ''
                          if(assignee_name === member_name ) return t
                        }).length, ass.state, ass.member)}
                        bodyStyle={{padding:3}}
                        headStyle={{background: ass?.member_name !==  NO_ASSIGNEE_LABEL ? '#f0f0f0' : 'orange',color:'rgba(0, 0, 0, 0.85)',
                        maxHeight:10
                          }}
                      >
                        <div style={{
                          height: ass.state ? '100%' : 200,
                          width: '100%',
                          overflow: ass.state ? 'visible' : 'auto',
                          padding: '0 16px',
                          border: '1px solid rgba(140, 140, 140, 0.35)',
                        }}
                        >{
                          ticket_open_by_team_name_list.filter(t=> {
                            let member_name = ass?.member_name || ''
                            let assignee_name = t?.assignee_name || ''
                            if(member_name ===  NO_ASSIGNEE_LABEL)   member_name  = ''
                            if(assignee_name === member_name ) return t
                          }).map((item,index)=> (
                            <Draggable key={item.id} draggableId={item.id} 
                            index={index} isDragDisabled={false}
                            >
                               {(provided, snapshot) => (
                               <Row key={index}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                   
                                  >
                                  {
                                    ticketsWfls === 'tickets' ?
                                    <div style={{
                                      paddingTop: 10,
                                      borderBottom: 1,
                                      borderBottomColor: 'grey',
                                      borderBottomStyle: 'solid',
                                      width:'100%',
                                      height: '100%',
                                    }}>
                                    <Row style={{justifyContent:'space-around',
                                     display: 'flex',
                                     flex: '1 1',
                                     alignItems: 'flex-start',
                                     maxWidth: '100%'
                                     }}>
                                    <Popover 
                                     content={(event:any)=>popover(event, item)} 
                                     title={ t('ticket') + ' ' +  t('number') + ' ' + item.name }  trigger="hover">  
                                     <Avatar style={{backgroundColor:'#49b6ba', fontSize:12}}>{item.name}</Avatar> 
                                     </Popover>
                                    
                                    <Tag icon={<ToolOutlined />} color="#55acee" style={{ fontSize:12}}>
                                     {item?.status_name}
                                     </Tag>
                                     <Tooltip title={t('go_to_ticket_details')}>
                                     <PlusCircleOutlined style={{color:'gray', fontSize:18}} onClick={() => selectTicket(item.id)}/>
                                     </Tooltip>
                                   </Row>
                                   <Row>
                                    <label><span style={{color:'black', fontSize:12}}>{t('tcategory') + ':'}</span><span>{item?.category_name}</span></label>
                                   </Row>
                                   <Row>
                                    <label><span style={{color:'black', fontSize:12}}>{t('create_date') + ':'}</span><span>{uTd(item?.create_date)}</span></label>
                                    </Row>
                                    </div> :
                                    <div style={{
                                      paddingTop: 10,
                                      borderBottom: 1,
                                      borderBottomColor: 'grey',
                                      borderBottomStyle: 'solid',
                                      width:'100%',
                                      height: '100%',
                                    }}>
                                    <Row style={{justifyContent:'space-around',
                                     display: 'flex',
                                     flex: '1 1',
                                     alignItems: 'flex-start',
                                     maxWidth: '100%'
                                     }}>
                                        <Tooltip title={<Badge.Ribbon 
                                      color={WaitingTime(false,+item.start_dt)}
                                      text={secondsToDhms(getWaitingTime(item.start_dt))}> 
                                      </Badge.Ribbon>} color={WaitingTime(false,+item.start_dt)}>
                                       <i
                                      style={{fontSize: 18}}
                                        className={WaitingTime(true, +item.start_dt)}
                                        aria-hidden="true"
                                        
                                      ></i>
                                      </Tooltip>
                                    <Popover 
                                     content={(event:any)=>popover(event, item,'wf')} 
                                     title={ t('ticket') + ' ' +  t('number') + ' ' + item.ticket_name }  trigger="hover">  
                                     <Avatar style={{backgroundColor:'#49b6ba', fontSize:12}}>{item.ticket_name}</Avatar> 
                                     </Popover>
                                    <Tag icon={<ToolOutlined />} color="#55acee" style={{ fontSize:12}}>
                                     {item?.sequence + ' '+ item?.task_name}
                                     </Tag>
                                     <Tooltip title={t('go_to_ticket_details')}>
                                     <PlusCircleOutlined style={{color:'gray', fontSize:18}} onClick={() => selectTicket(item.id,item.ticket)}/>
                                     </Tooltip>
                                   </Row>
                                   <Row>
                                    <label><span style={{color:'black', fontSize:12}}>{t('tcategory') + ':'}</span><span>{item?.tcategory_name}</span></label>
                                   </Row>
                                   <Row>
                                    {/* <label><span style={{color:'black', fontSize:12}}>{t('task') + ':'}</span><span>{item?.task_name}</span></label> */}
                                    <label><span style={{color:'black', fontSize:12}}>{t('start_dt') + ':'}</span><span>{uTd(item?.start_dt)}</span></label>
                                    </Row>
                                    </div>
                                  }  
                                 
                               </Row>
                                )}
                              </Draggable>
                          ))}
                        </div>
                      </Card>
                      {provided.placeholder} 
                        </Col>
                    )}
                    </Droppable>
                    ))  
                }
                </DragDropContext>
              </Row>
          </>     
        }
        
        <Drawer
          title=""
          placement={ user.locale === 'heIL' ? 'left' : 'right'}
          closable={false}
          onClose={() => {setTicketInfo('');setSelectedWfsId('')}}
          visible={ticketInfo.length>0}
          key={'ticketInfo'}
          // width={ width>1000 ? 640 : 340 }
          width={ width>1000 ? '80%' : '90%' }
        >
          <CloseCircleOutlined  style={{fontSize:28,color:'gray'}} onClick={() => {setTicketInfo('');setSelectedWfsId('')}} />
       {
          ticketInfo &&
          <TicketAssignee id={ticketInfo} wf={wfInfo}/>
       }
      </Drawer>
    </Card> 
  )
}
export default TicketMangerView;
