import  {FC, useEffect} from 'react';
import {  Menu, Avatar } from 'antd';
import {  UserOutlined,LogoutOutlined, LoginOutlined, CrownOutlined, RiseOutlined, GlobalOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { RouteNames } from '../router';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useAction } from '../hooks/useAction';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useTranslation } from 'react-i18next';
import { ITicket, ITicketPrpTpl } from '../models/ITicket';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { DEFAULT_ROLE } from '../models/IUser';
import AdminBar from './Adminbar';

const Navbar: FC = () => {
    const { t, i18n } = useTranslation();      
    const router = useHistory()
    const {isAuth, user,defaultRole } = useTypedSelector(state => state.auth)
    const {logout, setSelectedProperty, setProperties, setSelectedTicket, setPathForEmpty, fetchNotificationsAll,
      setDefaultRole} = useAction()
    const {setUser, refreshStorage} = useAction()
 

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
      if(Object.keys(defaultRole).length !== 0 ) return
      if(user)
      if(user.roles)
      if(user.roles.length > 0) {
        let default_role = user.roles.find(r =>+r.code === 1)
        if(default_role) { 
          setDefaultRole(default_role)
          setUser({...user, defaultRole: default_role} )
        }
      }
      else
      {
        setDefaultRole(DEFAULT_ROLE)
        setUser({...user, roles: [DEFAULT_ROLE],  defaultRole: DEFAULT_ROLE} )
      }
      
    }, [defaultRole,user.roles ])

    useEffect(() => {
    fetchNotificationsAll() }, [])

    const { height, width } = useWindowDimensions();
    return (
        <>
          {
           isAuth
              ? 
                  <Menu theme="dark" mode="horizontal" 
                  selectable={true}
                  forceSubMenuRender={true}
                  title="Menu"
                  >
                      <Menu.Item    key="user" >
                        <Avatar size={32} icon={<UserOutlined />} 
                         src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        />&nbsp;
                        {user.name}
                      </Menu.Item>
                      <Menu.Item  onClick={logout}  key="logout" ><LogoutOutlined />{ t('logout') }</Menu.Item>
                      {
                         user.roles &&
                         <SubMenu  key="roles" title={ defaultRole ? defaultRole.label : '' } 
                         icon={<CrownOutlined />}>
                        {
                          
                          user.roles.map(r =>(
                         <Menu.Item 
                          onClick={() => { setUser({...user, defaultRole: r});setDefaultRole(r) }} 
                          key={r.value} >{ r.label }
                          </Menu.Item>
                          ))
                        }
                        
                       </SubMenu>
                      }
                  
          
                      <SubMenu key="Language" title={ t(user.locale) }  

                      icon={<GlobalOutlined />}
                      >
                        <Menu.Item key="enUS" disabled={user.locale === 'enUS'} onClick={() => changeLen('enUS') }  >{ t('english') }</Menu.Item>
                        <Menu.Item key="heIL" disabled={user.locale === 'heIL'}  onClick={() => changeLen('heIL') }  >{ t('hebrew') }</Menu.Item>
                      </SubMenu>
                    
                    {
                      defaultRole?.label === 'Admin' &&
                      <AdminBar />
                      }
                      <SubMenu key="ticketsMain" 
                      title={ t('tickets') }
                      onTitleClick={() => router.push(RouteNames.TICKETS) }
                      >
                        <Menu.Item key="ticket" onClick={() => createNewTicket() } >{ t('ticket') + ' ' + t('new') }</Menu.Item>
                        <Menu.Item key="tickets" onClick={() => router.push(RouteNames.TICKETS) } >{ t('tickets') }</Menu.Item>
                        <Menu.Item key="wfs" onClick={() => router.push(RouteNames.WFS) } >{ t('wfs') }</Menu.Item>
                      </SubMenu>
                      {
                        defaultRole?.label !== 'Employee' &&
                        <SubMenu key="charts" title={ t('charts') }
                        icon={<RiseOutlined />}
                        >
                          <Menu.Item key="dashboard" onClick={() => router.push(RouteNames.DASHBOARD) } >{ t('dashboard') }</Menu.Item>
                        </SubMenu>
                      }
                      
                  </Menu>
              :
              <>
              <Menu theme="dark" mode="horizontal" selectable={false}>
                    <Menu.Item 
                    onClick={() => router.push(RouteNames.LOGIN)} 
                    key={1} ><LoginOutlined />{ t('Login') }</Menu.Item>
              </Menu>
              </>  
          }
         
  </>
    )
  }
  
  
  export default Navbar;