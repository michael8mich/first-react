import { PRIORITY_HIGH, PRIORITY_MEDIUM, URGENCY_HIGH, URGENCY_MEDIUM } from './ITicket';
import { FROM, SELECT, WHERE } from "../utils/formManipulation"


export interface IChatQuery  {
    what: string,
    tname: string,
    where: string
  }

 export interface CHART_CONFIG  {
    name: String
    config: any[]
  }


