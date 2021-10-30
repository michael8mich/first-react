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


const { Header, Sider, Content } = Layout;
const App:FC = () => {
  let defaultLen = 'heIL'
  const { i18n } = useTranslation();   
  const {setUser, setIsAuth, setFromLocation} = useAction()
  const {isAuth, user } = useTypedSelector(state => state.auth) 
  const {alert } = useTypedSelector(state => state.admin) 
  const [collapsed, setCollapsed] = useState(true)
  const { height, width } = useWindowDimensions();
  const router = useHistory()

  useEffect(() => {
    
    if(localStorage.getItem('isAuth')) {
      let user = JSON.parse(localStorage.getItem('isAuth')?.toString() || "") as IUser
      setUser(user)
      i18n.changeLanguage(user.locale.substring(0,2));
      setIsAuth(true)  
    }
    else
    {
      setFromLocation(router?.location?.pathname.toString() || '')
      let user_obj = {} as IUser
      setUser({...user_obj, locale: defaultLen })
      i18n.changeLanguage(defaultLen.substring(0,2));
    }
  }, [])

  
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

