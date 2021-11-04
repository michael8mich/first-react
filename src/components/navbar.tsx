import React, {FC, useEffect, useState} from 'react';
import { Layout, Row, Menu, Avatar, Button } from 'antd';
import { MenuFoldOutlined, UserOutlined, MenuUnfoldOutlined,LogoutOutlined, LoginOutlined, CrownOutlined, RiseOutlined, GlobalOutlined,
  SettingOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { RouteNames } from '../router';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useAction } from '../hooks/useAction';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useTranslation } from 'react-i18next';
import { ITicket, ITicketPrpTpl } from '../models/ITicket';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { axiosFn } from '../axios/axios';
import { IUser, NOT_GROUP_LIST } from '../models/IUser';
import { setSourceMapRange } from 'typescript';
import { SelectOption } from '../models/ISearch';
// import CodeTagsIcon from '@2fd/ant-design-icons/lib/CodeTagsIcon'


const Navbar: FC = () => {
    const { t, i18n } = useTranslation();      
    const router = useHistory()
    const {isAuth, user,defaultRole } = useTypedSelector(state => state.auth)
    const {logout, setSelectedProperty, setProperties, setSelectedTicket, setPathForEmpty, setDefaultRole} = useAction()
    const {setUser, refreshStorage} = useAction()
    const [collapsed,setCollapsed] =  useState(true)
 
    const toggleCollapsed = () => {
      setCollapsed(!collapsed)
    };

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
    // const [defaultRole, setDefaultRole] = useState({} as SelectOption)
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
      
    }, [defaultRole,user.roles ])

    

    const { height, width } = useWindowDimensions();
    return (
        <>
        {/* <button onClick={() => window.location.reload()}>Click to reload!</button> */}
          {/* <Row justify="start" style={{width:'100%'}}> */}
          {
           isAuth
              ? 
              <div style={{display:'flex', justifyContent:'space-between',background:'#001529'}} >
                <div hidden={width<400} style={{color:'rgba(255, 255, 255, 0.65)',background:'#00152'}} >
                <Avatar size={32} icon={<UserOutlined />} 
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />&nbsp;
                  {user.name} - {user.email} {user.locale === 'heIL' ? 'עברית' : 'English'}
                </div> 
                <div  style={{ width: '100vh',background:'#001529' }} >
                  <Menu theme="dark" mode="horizontal" 
                  selectable={true}
                  forceSubMenuRender={true}
                  title="Menu"
                  >
                      <Menu.Item  onClick={logout}  key="logout" ><LogoutOutlined />{ t('logout') }</Menu.Item>
                      {/* <Menu.Item key="events" onClick={() => router.push(RouteNames.EVENT) } >
                        { t('events') }</Menu.Item> */}
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
                  
          
                      <SubMenu key="Language" title={ t('language') }
                      icon={<GlobalOutlined />}
                      >
                        <Menu.Item key="enUS" disabled={user.locale === 'enUS'} onClick={() => changeLen('enUS') }  >{ t('english') }</Menu.Item>
                        <Menu.Item key="heIL" disabled={user.locale === 'heIL'}  onClick={() => changeLen('heIL') }  >{ t('hebrew') }</Menu.Item>
                      </SubMenu>
                    
                    {
                      defaultRole?.label === 'Admin' &&
                    
                      <SubMenu key="admin" title={ t('admin') } 
                      icon={<SettingOutlined />}
                      >
                        <Menu.Item key="utils" onClick={() => router.push(RouteNames.UTILS) } >{ t('utils') }</Menu.Item>
                        <Menu.Item key="users" onClick={() => router.push(RouteNames.USERS) } >{ t('users') }</Menu.Item>
                        <Menu.Item key="orgs" onClick={() => router.push(RouteNames.ORGS ) } >{ t('orgs') }</Menu.Item>
                        <Menu.Item key="tcategories" onClick={() => router.push(RouteNames.TCATEGORIES) } >{ t('tcategories') }</Menu.Item>
                      </SubMenu>
                      }
                      <SubMenu key="ticketsMain" 
                      title={ t('tickets') }
                      onTitleClick={() => router.push(RouteNames.TICKETS) }
                      >
                        <Menu.Item key="ticket" onClick={() => createNewTicket() } >{ t('ticket') + ' ' + t('new') }</Menu.Item>
                        <Menu.Item key="tickets" onClick={() => router.push(RouteNames.TICKETS) } >{ t('tickets') }</Menu.Item>
                      </SubMenu>
                      <SubMenu key="charts" title={ t('charts') }
                      icon={<RiseOutlined />}
                      >
                        <Menu.Item key="dashboard" onClick={() => router.push(RouteNames.DASHBOARD) } >{ t('dashboard') }</Menu.Item>
                      </SubMenu>
                  </Menu>
                </div>
              </div>
              :
              <>
              <Menu theme="dark" mode="horizontal" selectable={false}>
                    <Menu.Item 
                    onClick={() => router.push(RouteNames.LOGIN)} 
                    key={1} ><LoginOutlined />{ t('Login') }</Menu.Item>
              </Menu>
              </>  
          }
          {/* </Row> */}
  </>
    )
  }
  
  
  export default Navbar;