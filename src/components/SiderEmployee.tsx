import React, {FC, useEffect, useRef, useState} from 'react';
import { Menu, Avatar, Button, Tooltip, Popconfirm, Badge } from 'antd';
import { MenuFoldOutlined, UserOutlined, MenuUnfoldOutlined, DesktopOutlined,
  PieChartOutlined,QuestionCircleOutlined,ExclamationCircleOutlined,
  FileOutlined,SettingOutlined,BookOutlined,
  TeamOutlined,FullscreenOutlined, FullscreenExitOutlined
 } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { RouteNames } from '../router';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useAction } from '../hooks/useAction';
import { useTranslation } from 'react-i18next';
import { ITicket, ITicketPrpTpl } from '../models/ITicket';
import { ANALYST_DTP, EMPLOYEE_DTP, GROUP_LIST, IUser, NOT_GROUP_LIST } from '../models/IUser';
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

const SiderEmployee: FC<SiderComponentProps> = (props) => {
    const { t, i18n } = useTranslation();      
    const router = useHistory()
    const {isAuth, user, defaultRole } = useTypedSelector(state => state.auth)
    const {logout, setSelectedProperty, setProperties, setSelectedTicket, setAlert} = useAction()
    const {setUser, refreshStorage, setPathForEmpty} = useAction()
    const [queries, setQueries] =  useState([] as IQuery[]) 
    const [nowTime, setNowTime] =  useState(moment().format("DD/MM/YY HH:mm:ss")) 
    const queriesRef=useRef<RefObject>(null)
    
    useEffect(() => {
      getQueries()
    }, [])
    const dataPartition = (where: string, report: boolean = false) => {
      return EMPLOYEE_DTP.replace(/currentUser/g, user.id) + ( where !== '' ? " AND ( " + where + ")" : "" )
    }
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
    const getQueries = async () => {
      setNowTime(moment().format("DD/MM/YY HH:mm:ss"))  
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

    
    // useEffect(() => {
    //   const siderInterval = setInterval(() => {
    //     refreshSiderQueries()
    //   }, 60000);
    //   return () => clearInterval(siderInterval);
    // }, []);
 
    const refreshSiderQueries = () => {
      getQueries()
    }

    const [siderQueries, setSiderQueries] = useState([] as IQuery[])
    const [siderFolders, setSiderFolders] = useState([] as IQuery[])
    const [siderFoldersQueries, setSiderFoldersQueries] = useState([] as IQuery[])

    const goToQuery = (q:IQuery) => {
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
            icon={[<QuestionCircleOutlined />,<ExclamationCircleOutlined />]}
            >
               <Tooltip title={ t('ticket') + ' ' + t('new') } >
              { t('ticket') + ' ' + t('new') } 
              </Tooltip>
            </Menu.Item>
            {
              queries?.length>0 &&
              queries.map( q => (
               
                      <Menu.Item key={q.id}
                      icon={ 
                        props.collapsed ? 
                      <BookOutlined />
                    :
                    <Badge count={ q.count}  size="small"><BookOutlined /></Badge>
                      }
                           onClick={() => goToQuery(q)}
                           >
                             <Tooltip title={q.name  + '-' + q.count } 
                             placement="bottom" color={'cyan'}>
                            {q.name.toString().substring(0,40)} {  '-' + q.count }
                             </Tooltip> 
                           </Menu.Item>       
              ))
                           
            }
          </Menu>
    </>      
    )
  }
  
  
  export default SiderEmployee;