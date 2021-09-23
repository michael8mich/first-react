import React, {FC} from 'react';
import { Layout, Row, Menu } from 'antd';
import { useHistory } from 'react-router';
import { RouteNames } from '../router';
import { useTypedSelector } from '../hooks/useTypedSelector';

const Navbar: FC = () => {
    const router = useHistory()
    const {isAuth} = useTypedSelector(state => state.auth)
    return (
      <Layout.Header> 
          <Row justify="end">
          {
           isAuth
              ? 
              <>
              <div style={{color:'white'}} >
                  Mich TV
              </div>
                <Menu theme="dark" mode="horizontal" selectable={false}>
                    <Menu.Item 
                    onClick={() => console.log('logout')} 
                    key={1} >Logout</Menu.Item>
                </Menu>
                </>
              :
              <>
              <div style={{color:'white'}} >
               
              </div>
              <Menu theme="dark" mode="horizontal" selectable={false}>
                    <Menu.Item 
                    onClick={() => router.push(RouteNames.LOGIN)} 
                    key={1} >Login</Menu.Item>
                </Menu>
                </>  
              

          }
        </Row>
      </Layout.Header>
    )
  }
  
  
  export default Navbar;