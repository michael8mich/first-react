import React, {FC, useEffect, useRef, useState} from 'react';
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
import { ANALYST_DTP, GROUP_LIST, IUser, NOT_GROUP_LIST } from '../models/IUser';
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
import QueriesTree from './QueriesTree';
interface RefObject {
  getSiderQueries: () => void
}
const { SubMenu } = Menu;
interface SiderComponentProps {
  collapsed: boolean,
  setCollapsed: (collapsed:boolean) => void,
}

const SiderAssignee: FC<SiderComponentProps> = (props) => {
    const { t, i18n } = useTranslation();      
    const router = useHistory()
    const {isAuth, user, defaultRole } = useTypedSelector(state => state.auth)
    const {logout, setSelectedProperty, setProperties, setSelectedTicket, setAlert} = useAction()
    const {setUser, refreshStorage, setPathForEmpty} = useAction()
    const [edit, setEdit] =  useState(false) 
    const [nowTime, setNowTime] =  useState(moment().format("DD/MM/YY HH:mm:ss")) 
    const queriesRef=useRef<RefObject>(null)
    function changeLen(len:string) {
      setUser({ ...user , locale: len})
      refreshStorage({ ...user , locale: len})
      i18n.changeLanguage(len.substring(0,2));
    }
    const pathTrowEmpty = (path:string) => {
      setPathForEmpty(path)
      router.push(RouteNames.EMPTY)
    } 
    const createNewTicket = () => {
      setSelectedTicket({} as ITicket)
      setSelectedProperty({} as ITicketPrpTpl)
      setProperties([] as ITicketPrpTpl[])
      pathTrowEmpty(RouteNames.TICKETS + '/0')
    }
    useEffect(() => {
      if(user) {
        getTeams()
      }
    }, [user])
    
    // useEffect(() => {
    //   const siderInterval = setInterval(() => {
    //     refreshSiderQueries()
    //   }, 60000);
    //   return () => clearInterval(siderInterval);
    // }, []);
 
    const refreshSiderQueries = () => {
      setNowTime(moment().format("DD/MM/YY HH:mm:ss"))
      if(queriesRef.current)
      {
        queriesRef.current.getSiderQueries()
      }
    }
    const [teams, setTeams] = useState([] as IUser[])
    
    const getTeams = async () => {
      const teams_query =  await axiosFn('get', '', '* ', ' V_contacts ', GROUP_LIST + " order by name asc")
      let teams:IUser[] = teams_query.data
      setTeams(teams)
    }
    const [siderQueries, setSiderQueries] = useState([] as IQuery[])
    const [siderFolders, setSiderFolders] = useState([] as IQuery[])
    const [siderFoldersQueries, setSiderFoldersQueries] = useState([] as IQuery[])

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
           if(queriesRef.current)
        {
          queriesRef.current.getSiderQueries()
        }
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
    return (
      <>
      <div className="logo" />
       { !props.collapsed && 
        <div style={{fontSize:'14px',fontWeight:400,color:'white',padding:'10px'}}>
        <Tooltip title={t('refresh')}>
      <ReloadOutlined 
      onClick={()=>refreshSiderQueries()}
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
          forceSubMenuRender={true}
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
           
            <QueriesTree 
            collapsed={props.collapsed}
            setCollapsed={props.setCollapsed} 
            sider={true} 
            edit={edit} 
            user={user}
            ref={queriesRef}
            />
            { 
            defaultRole?.label === 'Admin' &&
            <>
            <SubMenu key="admin" icon={<SettingOutlined />} title={t('admin')}>
              <Menu.Item key="utils" onClick={() => router.push(RouteNames.UTILS) } >{ t('utils') }</Menu.Item>
              <Menu.Item key="users" onClick={() => router.push(RouteNames.USERS) } >{ t('users') }</Menu.Item>
              <Menu.Item key="orgs" onClick={() => router.push(RouteNames.ORGS ) } >{ t('orgs') }</Menu.Item>
              <Menu.Item key="notifications" onClick={() => router.push(RouteNames.NOTIFICATIONS ) } >{ t('notifications') }</Menu.Item>
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
            </>
            }
          </Menu>
    </>      
    )
  }
  
  
  export default SiderAssignee;