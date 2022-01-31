import  {FC} from 'react';
import {  Menu} from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { RouteNames } from '../router';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useTranslation } from 'react-i18next';
const AdminBar: FC = () => {
    const { t } = useTranslation();      
    const router = useHistory()
    return (
    
                      <SubMenu key="admin" title={ t('admin') } 
                      icon={<SettingOutlined />}
                      >
                        <Menu.Item key="utils" onClick={() => router.push(RouteNames.UTILS) } >{ t('utils') }</Menu.Item>
                        <Menu.Item key="users" onClick={() => router.push(RouteNames.USERS) } >{ t('users') }</Menu.Item>
                        <Menu.Item key="cis" onClick={() => router.push(RouteNames.CIS) } >{ t('cis') }</Menu.Item>
                        <Menu.Item key="orgs" onClick={() => router.push(RouteNames.ORGS ) } >{ t('orgs') }</Menu.Item>
                        <Menu.Item key="notifications" onClick={() => router.push(RouteNames.NOTIFICATIONS ) } >{ t('notifications') }</Menu.Item>
                        <Menu.Item key="tcategories" onClick={() => router.push(RouteNames.TCATEGORIES) } >{ t('tcategories') }</Menu.Item>
                        <Menu.Item key="import" onClick={() => router.push(RouteNames.IMPORT) } >{ t('import') }</Menu.Item>
                      </SubMenu>
    )
  }
  export default AdminBar;