import { Alert, Layout, Menu } from 'antd';
import  {FC, useEffect, useState} from 'react';
import './App.css';
import AppRouter from './components/AppRouter';
import Navbar from './components/navbar';
import { useAction } from './hooks/useAction';
import { IUser } from './models/IUser';
import { ConfigProvider } from 'antd';
import heIL from 'antd/lib/locale/he_IL';
import enUS from 'antd/lib/locale/en_US'
import { useTypedSelector } from './hooks/useTypedSelector';
import './i18n/config';
import { useTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next'; 
import BreadCrumb from './components/BreadCrumb';
import AlertComponent from './components/AlertComponent';
import SiderComponent from './components/SiderComponent';
import useWindowDimensions from './hooks/useWindowDimensions';
import { useHistory } from 'react-router-dom';
import { RouteNames } from './router';
import Login from './pages/Login';
import FooterComponent from './components/FooterComponent';
import axios from 'axios'
import { SSO_PATH, TOKEN } from './axios/axios';


const { Header, Sider, Content } = Layout;
const App:FC = () => {
  let defaultLen = 'heIL'
  const { i18n } = useTranslation();   
  const {setUser, setIsAuth, setFromLocation, fetchLoginUser, fetchNotificationsAll, sso} = useAction()
  const {isAuth, user } = useTypedSelector(state => state.auth) 
  const {alert } = useTypedSelector(state => state.admin) 
  const [collapsed, setCollapsed] = useState(true)
  const { height, width } = useWindowDimensions();
  const router = useHistory()

  useEffect(() => {
    if(TOKEN.token_error) {
      goToLogin()
      TOKEN.token_error = false
    }
    
    if(localStorage.getItem('isAuth')) {
      let user = JSON.parse(localStorage.getItem('isAuth')?.toString() || "") as IUser
      setUser(user)
      fetchLoginUser(user.id)
      i18n.changeLanguage(user.locale.substring(0,2));
      setIsAuth(true)  
      let token = localStorage.getItem('token') || ''
      TOKEN.token = token
    }
    else
    {
      goToLogin()
      //check_sso()
    }
    fetchNotificationsAll()
  }, [])
 
  const  check_sso = async () => {
      try {
        let fromLocation = router?.location?.pathname.toString() || ''
        const headers = { 'Content-Type': 'text'}
        let ssoName =  await axios.get(SSO_PATH, { headers: headers })
        let username = ''
        let ssoName_: string = ssoName?.data|| '';
            if (ssoName_ != '') {
              let usernameAr: string[] = [];
              usernameAr = ssoName_.split('\\');
              if (usernameAr.length === 2) {
                username = usernameAr[1];
              }
            }
        if(username.length>0)  {
          sso(username, fromLocation) 
        }
        else {
          throw new Error
        }
      } catch {
        goToLogin()
      }
  }
  const  goToLogin =  () => {
    setFromLocation(router?.location?.pathname.toString() || '')
    let user_obj = {} as IUser
    setUser({...user_obj, locale: defaultLen })
    i18n.changeLanguage(defaultLen.substring(0,2));
  }
  const direction = user.locale === 'heIL' ? 'rtl' : 'ltr'
  return (
    <ConfigProvider locale={user.locale === 'heIL' ? heIL : enUS } direction={direction}>
    <Layout style={{ minHeight: '100vh' }}>
     
     {
       isAuth ? 
       <> 
        <Sider hidden={width<500} trigger={null} collapsible collapsed={collapsed} onCollapse={() => setCollapsed(collapsed ? false : true)}>
        <SiderComponent
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        />
        </Sider>
        <Layout className="site-layout">
      <Header className="site-layout-background" style={{ padding: 0 }} 
      >   
      <Navbar />
      </Header>
      <Content style={{ margin: '0 16px' }}>
      <BreadCrumb />
      <AlertComponent {...alert} />
        <AppRouter />
      </Content>
      <FooterComponent />
        </Layout> 
      </> :
     <>
     <Login/>
     <FooterComponent />
     </>
     }
    </Layout>
    </ConfigProvider>
  )
}


export default withTranslation()(App);

