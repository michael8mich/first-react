import { Layout } from 'antd';
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
const App:FC = () => {
  let defaultLen = 'heIL'
  const { i18n } = useTranslation();   
  const {setUser, setIsAuth} = useAction()
  const {isAuth, user } = useTypedSelector(state => state.auth) 

  
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
      <Layout.Content>
        <AppRouter />
      </Layout.Content>
    </Layout>
    </ConfigProvider>
  )
}


export default withTranslation()(App);
