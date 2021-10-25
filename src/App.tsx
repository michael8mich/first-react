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


const { Header, Sider, Content } = Layout;
const App:FC = () => {
  let defaultLen = 'heIL'
  const { i18n } = useTranslation();   
  const {setUser, setIsAuth} = useAction()
  const {isAuth, user } = useTypedSelector(state => state.auth) 
  const {alert } = useTypedSelector(state => state.admin) 
  const [collapsed, setCollapsed] = useState(true)
  const { height, width } = useWindowDimensions();
  
  useEffect(() => {
    if(localStorage.getItem('isAuth')) {
      let user = JSON.parse(localStorage.getItem('isAuth')?.toString() || "") as IUser
      setUser(user)
      i18n.changeLanguage(user.locale.substring(0,2));
      setIsAuth(true)
    }
    else
    {
      let user_obj = {} as IUser
      setUser({...user_obj, locale: defaultLen })
      i18n.changeLanguage(defaultLen.substring(0,2));
    }
  
    
  }, [])

  
  const direction = user.locale === 'heIL' ? 'rtl' : 'ltr'
  return (
    <ConfigProvider locale={user.locale === 'heIL' ? heIL : enUS } direction={direction}>
    <Layout style={{ minHeight: '100vh' }}>
   
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
      <Layout.Footer style={{height:'10px'}}>
        <div style={{fontSize:'8px'}}>
        UTA System(Users Tickets Assets) v(1.0.0) Michael Khokhlinov Co 2021
        </div>
      </Layout.Footer>
      </Layout> 
    </Layout>
    {/* <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              nav 1
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(collapsed ? false : true),
            })}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout> */}
    </ConfigProvider>
  )
}


export default withTranslation()(App);
