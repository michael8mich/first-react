
import  {FC} from 'react';
import TicketsAssignee from '../../components/tickets/TicketsAssignee';
import TicketsEmployee from '../../components/tickets/TicketsEmployee';
import { useTypedSelector } from '../../hooks/useTypedSelector';

const Tickets:FC = () => {
  const {isAuth, user,defaultRole } = useTypedSelector(state => state.auth)
  return (
    <>
    {
      defaultRole && defaultRole?.label !== "Employee" ? 
      <TicketsAssignee/>  :
      <TicketsEmployee/> 
    }
    </>
  )
}
export default Tickets;
