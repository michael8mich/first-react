import { PRIORITY_HIGH, PRIORITY_MEDIUM, URGENCY_HIGH, URGENCY_MEDIUM } from './ITicket';
import { FROM, SELECT, WHERE } from "../utils/formManipulation"


export interface IQuery  {
    what: String,
    tname: String,
    where: String 
  }

  
 export  const TICKET_OPENED_BY_TEAM:IQuery = {
    what: "  count(id) as value, isnull(team_name, N'@none') as type, '       ' + isnull(team_name, N'@none') as name ",
    tname: " V_tickets ",
    where: " active = 1 group by team_name order by count(id) desc " 
  } 
export  const TICKET_OPENED_BY_PRIORITY:IQuery = {
    what: "  count(id) as value, isnull(priority_name, N'@none') as type ",
    tname: " V_tickets ",
    where: " active = 1 group by priority_name order by count(id) desc " 
  }  
export  const TICKET_OPENED_BY_URGENCY:IQuery = {
    what: "  count(id) as value, isnull(urgency_name, N'@none') as type ",
    tname: " V_tickets ",
    where: " active = 1 group by urgency_name order by count(id) desc " 
  } 
export  const TICKET_OPENED_BY_CATEGORY:IQuery = {
    what: " top 10 count(id) as value,  isnull(category_name, N'@none') + '    '  as  type ",
    tname: " V_tickets ",
    where: " active = 1 group by category_name order by count(id) desc " 
  } 

  export  const TICKET_BY_WEEKDAY:IQuery = {
    what: "  count(id) as value,   FORMAT( ( dateadd(s, create_date+DATEDIFF (S, GETUTCDATE(), GETDATE()), '1970-01-01')),'dddd' ) as type  ",
    tname: " ticket ",
    where: "  id <> '' group by FORMAT( ( dateadd(s, create_date+DATEDIFF (S, GETUTCDATE(), GETDATE()), '1970-01-01')),'dddd' ) , datepart( weekday, dateadd(s, create_date+DATEDIFF (S, GETUTCDATE(), GETDATE()), '1970-01-01')) order by datepart( weekday, dateadd(s, create_date+DATEDIFF (S, GETUTCDATE(), GETDATE()), '1970-01-01')) " 
  } 


  let guageQuery =  ` top 1 ( ${SELECT} count(id) as cnt  ${FROM} V_tickets ${WHERE}  active = 1 and priority in ('${PRIORITY_HIGH.value}','${PRIORITY_MEDIUM.value}')  ) as [target],
  ( ${SELECT} count(id) as cnt ${FROM} V_tickets ${WHERE}  active = 1   ) as [all] `
 
  export  const TICKET_OPENED_PERCENT_HIGH_PRIORITY:IQuery = {
    what: guageQuery,
    tname: " empty ",
    where: "" 
  } 
  guageQuery =  ` top 1 ( ${SELECT} count(id) as cnt  ${FROM} V_tickets ${WHERE}  active = 1 and urgency in ('${URGENCY_HIGH.value}','${URGENCY_MEDIUM.value}')  ) as [target],
  ( ${SELECT} count(id) as cnt ${FROM} V_tickets ${WHERE}  active = 1   ) as [all] `
 
  export  const TICKET_OPENED_PERCENT_HIGH_URGENCY:IQuery = {
    what: guageQuery,
    tname: " empty ",
    where: "" 
  } 
  guageQuery =  ` top 1 ( ${SELECT} count(id) as cnt  ${FROM}  ticket ${WHERE}  CONVERT (date, SYSDATETIME()) =  CONVERT (date, dateadd(s, create_date+DATEDIFF (S, GETUTCDATE(), GETDATE()), '1970-01-01'))) as [all], 
   ( ${SELECT} count(id) as cnt  ${FROM}  ticket ${WHERE}  CONVERT (date, SYSDATETIME()) =  CONVERT (date, dateadd(s, close_date+DATEDIFF (S, GETUTCDATE(), GETDATE()), '1970-01-01'))) as [target] `
 
  export  const TICKET_OPENED_CLOSED_TODAY:IQuery = {
    what: guageQuery,
    tname: " empty ",
    where: "" 
  } 


