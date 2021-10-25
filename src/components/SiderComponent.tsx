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
import { IQuery, SIDER_NO_FOLDER } from '../models/ISearch';
import ReloadOutlined from '@ant-design/icons/lib/icons/ReloadOutlined';
import moment from 'moment';
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined';
import CloseCircleOutlined from '@ant-design/icons/lib/icons/CloseCircleOutlined';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';

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
    const getSiderQueries = async () => {
      setNowTime(moment().format("DD/MM/YY HH:mm:ss"))
      let result_query = await axiosFn("get", '', '*', 'queries', " object='"+user.id+"' AND folder = '" +SIDER_NO_FOLDER + "' order by seq " , '' )  
      let result_query_Arr:IQuery[] =  result_query?.data 
      console.log('result_query_Arr', result_query_Arr);
      let index = 1
      if(result_query_Arr)
      result_query_Arr.map(async ( q) =>  {
        
        let q_result = await axiosFn("get", '', ' count(id) as cnt ', 'V_' + q.factory + 's', q.query , '' )  
        q.count = q_result.data[0].cnt
        q.index = index
    
        if(result_query_Arr.length === index)
        setSiderQueries(result_query_Arr)
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
    return (
      <>
      <div className="logo" />

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
    
          <Menu theme="dark" 
          // defaultSelectedKeys={['1','2']} 
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

            <SubMenu key="queries" icon={<FileOutlined />} title={t('queries')}>
              {
                siderQueries.map( q => (
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
                ))
              }
            </SubMenu>

          </Menu>
    </>      
    )
  }
  
  
  export default SiderComponent;