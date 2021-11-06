import  {FC} from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import HomeAssignee from './HomeAssignee';
import HomeEmployee from './HomeEmployee';



const Home:FC = () => {
  const {isAuth, user,defaultRole } = useTypedSelector(state => state.auth)
  return (
    <>
    {
      defaultRole && defaultRole?.label !== "Employee" ? 
      <HomeAssignee/>  :
      <HomeEmployee/> 
    }
    </>
  )
}
export default Home;
