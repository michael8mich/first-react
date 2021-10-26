import React, {FC, useEffect, useState} from 'react';
import { Menu, Avatar, Button, Tooltip, Popconfirm } from 'antd';
import { MenuFoldOutlined, UserOutlined, MenuUnfoldOutlined, DesktopOutlined,
  PieChartOutlined,
  FileOutlined,SettingOutlined,
  TeamOutlined,FullscreenOutlined, FullscreenExitOutlined
 } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { RouteNames } from '../router';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useAction } from '../hooks/useAction';
import { useTranslation } from 'react-i18next';
import { ITicket, ITicketPrpTpl } from '../models/ITicket';
import { GROUP_LIST, IUser, NOT_GROUP_LIST } from '../models/IUser';
import { axiosFn } from '../axios/axios';
import { FROM, SELECT, WHERE } from '../utils/formManipulation';
import { replace } from 'lodash';
import { relativeTimeRounding } from 'moment';
import { HOME_FOLDER, IQuery, SIDER_NO_FOLDER } from '../models/ISearch';
import ReloadOutlined from '@ant-design/icons/lib/icons/ReloadOutlined';
import moment from 'moment';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import CloseCircleOutlined from '@ant-design/icons/lib/icons/CloseCircleOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

const { SubMenu } = Menu;
interface SiderComponentProps {
  collapsed: boolean,
  setCollapsed: (collapsed:boolean) => void,
}

const SiderComponent: FC<SiderComponentProps> = (props) => {
    const { t, i18n } = useTranslation();      
    const router = useHistory()
    const {isAuth, user } = useTypedSelector(state => state.auth)
    const {logout, setSelectedProperty, setProperties, setSelectedTicket, setAlert} = useAction()
    const {setUser, refreshStorage} = useAction()
    const [edit, setEdit] =  useState(false) 
    const [nowTime, setNowTime] =  useState(moment().format("DD/MM/YY HH:mm:ss")) 

    function changeLen(len:string) {
      setUser({ ...user , locale: len})
      refreshStorage({ ...user , locale: len})
      i18n.changeLanguage(len.substring(0,2));
    }
    const createNewTicket = () => {
      setSelectedTicket({} as ITicket)
      setSelectedProperty({} as ITicketPrpTpl)
      setProperties([] as ITicketPrpTpl[])
      router.push(RouteNames.TICKETS + '/0')
    }
    useEffect(() => {
      if(user) {
        getTeams()
        getSiderQueries()
      }
    }, [user])
    
    useEffect(() => {
      const siderInterval = setInterval(() => {
        getSiderQueries()
      }, 60000);
      return () => clearInterval(siderInterval);
    }, []);

    const [teams, setTeams] = useState([] as IUser[])
    
    const getTeams = async () => {
      const teams_query =  await axiosFn('get', '', '* ', ' V_contacts ', GROUP_LIST + " order by name asc")
      let teams:IUser[] = teams_query.data
      setTeams(teams)
    }
    const [siderQueries, setSiderQueries] = useState([] as IQuery[])
    const [siderFolders, setSiderFolders] = useState([] as IQuery[])
    const [siderFoldersQueries, setSiderFoldersQueries] = useState([] as IQuery[])
    const getSiderQueries = async () => {
      if(!user?.id) return
      setNowTime(moment().format("DD/MM/YY HH:mm:ss"))
      let result_query = await axiosFn("get", '', '*', 'queries', " object='"+user.id+"' AND folder <> '" +HOME_FOLDER + "' order by seq " , '' )  
      let result_query_Arr:IQuery[] =  result_query?.data 
      let folders:IQuery[] = result_query_Arr.filter( r => r.factory === 'folder' )
      setSiderFolders(folders)
      //result_query_Arr = result_query_Arr.filter( r => r.folder === SIDER_NO_FOLDER )
      console.log('result_query_Arr', result_query_Arr);
      let index = 1
      if(result_query_Arr)
      result_query_Arr.map(async ( q,i) =>  {
        q.index = i
        if(q.factory!=='folder') {
          let q_result = await axiosFn("get", '', ' count(id) as cnt ', 'V_' + q.factory + 's', q.query , '' )  
          q.count = q_result.data[0].cnt
          if(result_query_Arr.length === index)
          setSiderQueries(result_query_Arr)
        }
        index++
      })
        
        console.log('result_query_Arr', result_query_Arr);
        
    }
    const goToQuery = (q:IQuery) => {
      if(edit) return
      if(q.factory === 'ticket') {
        setQueriesCache({ [q.factory]: q.query })
        router.push(RouteNames.TICKETS)
      } else if(q.factory === 'contact') {
        setQueriesCache({ [q.factory]: q.query })
        router.push(RouteNames.USERS)
      } 
  
    }
    const {setQueriesCache} = useAction()
    const goTo = (factory:string, query:string) => {

      if(factory === 'ticket') {
        setQueriesCache({ [factory]: query })
        router.push(RouteNames.TICKETS)
      } else if(factory === 'contact') {
        setQueriesCache({ [factory]: query })
        router.push( RouteNames.USERS )
      } 
  
    }
    const deleteQuery = async (id:string, folder=false) => {
    
       if(folder) {
        siderQueries.map(async q => {
         if(q.folder === id )
          await axiosFn("delete", '', '*', 'queries', "id" , q.id ) 
        })
       }  
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
           getSiderQueries()
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
     let queries_:IQuery[] = [...siderQueries]
     let from_index = result.source.index
     let to_index = result.destination.index
     let from_index_id = ''
     let to_index_id = ''
     let fromObj =  queries_.find(q=>q.index===from_index) || undefined
     if(fromObj) from_index_id = fromObj?.id
     let toObj =  queries_.find(q=>q.index===to_index) || undefined
     if(toObj) to_index_id = toObj?.id
    queries_.map(q=>{
      if(q.id===from_index_id) q.index = to_index
      if(q.id===to_index_id) q.index = from_index
    })


     queries_ = queries_.sort((a,b) => a.index - b.index) 
     setSiderQueries(queries_)
     queries_.map(async q => {
      let js = {seq:q.index} as Object
      let q_result = await axiosFn("put", js,  '', 'queries', 'id',  q.id  )  
      console.log(q_result);
      }
      ) 
  }
  const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
    // background: isDraggingOver ? "lightblue" : "transparent",
    paddingRight:'5px'
  });
    return (
      <>
      <div className="logo" />
       { !props.collapsed && 
        <div style={{fontSize:'14px',fontWeight:400,color:'white',padding:'10px'}}>
        <Tooltip title={t('refresh')}>
      <ReloadOutlined 
      onClick={()=>getSiderQueries()}
      style={{fontSize:'14px',fontWeight:400,color:'white'}} />
        </Tooltip>
      &nbsp;&nbsp;
       {nowTime}  &nbsp;&nbsp;
       {
                  !edit ?
                  <Tooltip title={t('edit')}>
                  <EditOutlined  style={{fontSize: '14px'}}
                  onClick={() => setEdit(true)}
                  />
                  </Tooltip> :
                    <Tooltip title={t('cancel')}>
                    <CloseCircleOutlined  style={{fontSize: '14px'}}
                    onClick={() => setEdit(false)}
                    />
                    </Tooltip>
                }      
       </div>
    }
          <Menu theme="dark" 
          // defaultSelectedKeys={['1','2']} 
          defaultSelectedKeys={[]} 
            mode="inline">
            <Menu.Item key="1" 
            onClick={() => props.setCollapsed(!props.collapsed)}
            icon={ !props.collapsed ? <FullscreenExitOutlined /> : <FullscreenOutlined /> }>
              { }
            </Menu.Item>
            <Menu.Item key="ticket" 
            onClick={() => createNewTicket() } 
            icon={<DesktopOutlined />}
            >{ t('ticket') + ' ' + t('new') } 
            </Menu.Item>
            
          <DragDropContext  onDragEnd={onDragEnd} >
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
            <div {...provided.droppableProps}  
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            key="Droppable_1"
            >   
            <SubMenu key="queries" 
            icon={<FileOutlined />} title={t('queries')}
            >
              {   
                siderQueries.filter(f=>f.folder===SIDER_NO_FOLDER&&f.factory!=='folder').map( (q,index) => (
                  <Draggable key={'drag_'+q.id} draggableId={q.id}  index={q.index} isDragDisabled={!edit}>
                  {(provided, snapshot) => (
                  <div  
                  key={'div_'+q.id}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                    >
                  <Menu.Item key={q.id}
                  onClick={() => goToQuery(q)}
                  >
                    {
                          edit &&
                          <Tooltip title={t('delete')}>
                            <Popconfirm title={t('are_you_sure')} okText={t('yes')} cancelText={t('no')}  onConfirm={() => deleteQuery(q.id)}>
                            <DeleteOutlined 
                            ></DeleteOutlined>
                            </Popconfirm>
                          </Tooltip>
                        }
                    <Tooltip title={q.name}>
                        {q.name.toString().substring(0,40)}-{q.count}
                    </Tooltip>

                  </Menu.Item>
                  </div>
                  )}
                  </Draggable>
                ))
              }
              {
                siderFolders.map( f => (
                  <SubMenu key={f.id} 
                    icon= 
                    {
                                  edit ?
                                  <Tooltip title={t('delete')}>
                                    <Popconfirm title={t('are_you_sure')} okText={t('yes')} cancelText={t('no')}  onConfirm={() => deleteQuery(f.id, true)}>
                                    <DeleteOutlined 
                                    ></DeleteOutlined>
                                    </Popconfirm>
                                  </Tooltip> :
                                  <FileOutlined />
                    }
                    title={f.name}>
                  {
                  siderQueries.filter(fq=>fq.folder===f.id).map( q => (
                   <Draggable key={'drag_sub'+q.id} draggableId={q.id}  index={q.index} isDragDisabled={!edit}>
                  {(index, snapshot) => (
                  <div style={{paddingRight:'15px'}}  key={'div_'+f.id}
                  ref={index.innerRef}
                  {...index.draggableProps}
                  {...index.dragHandleProps}
                    >
                          <Menu.Item key={q.id}
                          onClick={() => goToQuery(q)}
                          >
                            {
                                  edit &&
                                  <Tooltip title={t('delete')}>
                                    <Popconfirm title={t('are_you_sure')} okText={t('yes')} cancelText={t('no')}  onConfirm={() => deleteQuery(q.id)}>
                                    <DeleteOutlined 
                                    ></DeleteOutlined>
                                    </Popconfirm>
                                  </Tooltip>
                                }
                            <Tooltip title={q.name}>
                                {q.name.toString().substring(0,40)}-{q.count} 
                            </Tooltip> 
                          </Menu.Item>
                             </div>
                             )}
                  </Draggable>
                        ))
                    } 
                  </SubMenu> 
               
                ))
              }
            </SubMenu>
            </div>  
             )}
            </Droppable>
          </DragDropContext>

            <SubMenu key="admin" icon={<SettingOutlined />} title={t('admin')}>
              <Menu.Item key="utils" onClick={() => router.push(RouteNames.UTILS) } >{ t('utils') }</Menu.Item>
              <Menu.Item key="users" onClick={() => router.push(RouteNames.USERS) } >{ t('users') }</Menu.Item>
              <Menu.Item key="orgs" onClick={() => router.push(RouteNames.ORGS ) } >{ t('orgs') }</Menu.Item>
              <Menu.Item key="tcategories" onClick={() => router.push(RouteNames.TCATEGORIES) } >{ t('tcategories') }</Menu.Item>
            </SubMenu>
            <SubMenu key="teams" icon={<TeamOutlined />} title={t('teams')}>
              {
                teams.map( t => (
                  <Menu.Item key={t.id}
                  onClick={() => goTo('contact', " id in ("+SELECT+" member "+FROM+" [dbo].[V_teammember] "+WHERE+" team = '"+t.id+"' ) " )}
                  >{t.name}</Menu.Item>
                ))
              }
            </SubMenu>
          </Menu>
    </>      
    )
  }
  
  
  export default SiderComponent;