
import  {FC} from 'react';
import TicketAssignee from '../../components/tickets/TicketAssignee';
import TicketEmployee from '../../components/tickets/TicketEmployee';
import { useTypedSelector } from '../../hooks/useTypedSelector';

const TicketDtl:FC = () => {
  const {isAuth, user,defaultRole } = useTypedSelector(state => state.auth)
  return (
    <>
    {
      defaultRole && defaultRole?.label !== "Employee" ? 
      <TicketAssignee/>  :
      <TicketEmployee/> 
    }
    </>
  )
}
export default TicketDtl;
