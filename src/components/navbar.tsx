import React, {FC} from 'react';
import { Layout, Row, Menu } from 'antd';
import { useHistory } from 'react-router';
import { RouteNames } from '../router';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useAction } from '../hooks/useAction';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useTranslation } from 'react-i18next';


const Navbar: FC = () => {
    const { t, i18n } = useTranslation();      
    const router = useHistory()
    const {isAuth, user } = useTypedSelector(state => state.auth)
    const {logout} = useAction()
    const {setUser, refreshStorage} = useAction()
    
    function changeLen(len:string) {
      setUser({ ...user , locale: len})
      refreshStorage({ ...user , locale: len})
      i18n.changeLanguage(len.substring(0,2));
    }
    return (
      <Layout.Header> 
          <Row justify="end">
          {
           isAuth
              ? 
              <>
              <div style={{color:'white'}} >
                 {user.name} - {user.email} {user.locale === 'heIL' ? 'עברית' : 'English'}
              </div>
                <Menu theme="dark" mode="horizontal" selectable={false}>
                    <Menu.Item 
                    onClick={logout} 
                    key={1} >{ t('logout') }
                    </Menu.Item>
                    <Menu.Item key="events" onClick={() => router.push(RouteNames.EVENT) } >{ t('events') }</Menu.Item>
                    <SubMenu key="Language" title={ t('language') }>
                      <Menu.Item disabled={user.locale === 'enUS'} onClick={() => changeLen('enUS') }  key="enUS">{ t('english') }</Menu.Item>
                      <Menu.Item disabled={user.locale === 'heIL'}  onClick={() => changeLen('heIL') }  key="heIL">{ t('hebrew') }</Menu.Item>
                    </SubMenu>
                    <SubMenu key="admin" title={ t('admin') }>
                      <Menu.Item key="utils" onClick={() => router.push(RouteNames.UTILS) } >{ t('utils') }</Menu.Item>
                      <Menu.Item key="users" onClick={() => router.push(RouteNames.USERS) } >{ t('users') }</Menu.Item>
                      <Menu.Item key="orgs" onClick={() => router.push(RouteNames.ORGS ) } >{ t('orgs') }</Menu.Item>
                    </SubMenu>
                </Menu>
                </>
              :
              <>
              <div style={{color:'white'}} >
               
              </div>
              <Menu theme="dark" mode="horizontal" selectable={false}>
                    <Menu.Item 
                    onClick={() => router.push(RouteNames.LOGIN)} 
                    key={1} >{ t('Login') }.</Menu.Item>
                </Menu>
                </>  
          }
        </Row>
      </Layout.Header>
    )
  }
  
  
  export default Navbar;