import  {FC} from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import HomeAssignee from './HomeAssignee';
import HomeEmployee from './HomeEmployee';



const Home:FC = () => {
  const {defaultRole } = useTypedSelector(state => state.auth)
  return (
    <>
    {
      defaultRole && defaultRole?.label !== "Employee" ? 
      <HomeAssignee defaultRoleLabel={defaultRole?.label}/>  :
      <HomeEmployee/> 
    }
    </>
  )
}
export default Home;
