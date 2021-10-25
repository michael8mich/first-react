import { Alert, Layout } from 'antd';
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
const App:FC = () => {
  let defaultLen = 'heIL'
  const { i18n } = useTranslation();   
  const {setUser, setIsAuth} = useAction()
  const {isAuth, user } = useTypedSelector(state => state.auth) 
  const {alert } = useTypedSelector(state => state.admin) 

  
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
    <Layout>
      <Navbar />
      <Layout.Content style={{ overflow: 'scroll' }}>
      <BreadCrumb />
      <AlertComponent {...alert} />
        <AppRouter />
      </Layout.Content>
      <Layout.Footer style={{height:'10px'}}>
        <div style={{fontSize:'8px'}}>
        UTA System(Users Tickets Assets) Michael Khokhlinov Co 2021
        </div>
      </Layout.Footer>
    </Layout>
    </ConfigProvider>
  )
}


export default withTranslation()(App);
