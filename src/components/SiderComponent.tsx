import  {FC} from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import SiderAssignee from './SiderAssignee';
import SiderEmployee from './SiderEmployee';

interface SiderComponentProps {
  collapsed: boolean,
  setCollapsed: (collapsed:boolean) => void,
}

const SiderComponent:FC<SiderComponentProps> = (props) => {
  const {isAuth, user,defaultRole } = useTypedSelector(state => state.auth)
  return (
    <>
    {
      defaultRole && defaultRole?.label !== "Employee" ? 
      <SiderAssignee 
      {...props} />  :
      <SiderEmployee
      {...props}
      /> 
    }
    </>
  )
}
export default SiderComponent;
