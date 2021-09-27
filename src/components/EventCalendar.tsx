import { Badge, Calendar, Card } from 'antd';
import moment from 'moment';
import { Moment } from 'moment';
import  {FC} from 'react';
import { IEvent } from '../models/IEvent';

interface EventCalendarProps {
  events: IEvent[]
  me: string
}
const EventCalendar: FC<EventCalendarProps> = ({events, me} ) => {
  function dateCellRender(value: Moment) {

    const unixDate = value.format("MM/DD/YYYY");
 
    const events_list: IEvent[] = events
    const currentDateEvents =  events_list.filter(ev => moment(+ev.event_dt*1000).format("MM/DD/YYYY")  === unixDate);
    return (
      <ul className="events">
        {currentDateEvents.map((item , index) => (
          <Badge.Ribbon
          color={item.author.id === me ? 'green' : 'blue'} 
          text={item.author.id === me ? item.guest.name : item.author.name} 
          key={index}>
          {item.description}
        </Badge.Ribbon>
          
        
        ))}
      </ul>
    );
  }
    return (
      <Calendar 
      dateCellRender={dateCellRender}
      />
    )
  }
  export default EventCalendar;