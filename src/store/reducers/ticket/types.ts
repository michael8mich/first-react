import { ITicketsAllWfs, ITicketSlaEvents, ITicketWfTpl } from './../../../models/ITicket';
import { ITicket, ITicketCategory, ITicketPrpTpl } from '../../../models/ITicket';

export interface TicketState {
    tickets: ITicket[]
    ticketsCount: number
    selectedTicket: ITicket
    copiedTicket: ITicket
    ticketsAllWfs: ITicketsAllWfs[]
    ticketsAllWfsCount: number
    selectedWfsId: string

    categories: ITicketCategory[]
    categoriesCount: number
    selectedCategory: ITicketCategory

    properties: ITicketPrpTpl[]
    propertiesCount: number
    selectedProperty: ITicketPrpTpl

    wfs: ITicketWfTpl[]
    wfsCount: number
    selectedWf: ITicketWfTpl

    ticketSlaEvents:  ITicketSlaEvents[]

    isLoading: boolean
    error: string
}

export enum TicketActionEnum {
    SET_TICKETS = "SET_TICKETS",
    SET_SELECTED_TICKET = "SET_SELECTED_TICKET",
    SET_COPIED_TICKET = "SET_COPIED_TICKET",
    SET_SELECTED_TICKET_PROPERTIES = "SET_SELECTED_TICKET_PROPERTIES",
    SET_SELECTED_TICKET_WFS = "SET_SELECTED_TICKET_WFS",
    SET_TICKETS_COUNT = "SET_TICKETS_COUNT",
    SET_TICKETS_ALL_WFS = "SET_TICKETS_ALL_WFS",
    SET_TICKETS_ALL_WFS_COUNT = "SET_TICKETS_ALL_WFS_COUNT",
    SET_SELECTED_WF_ID = "SET_SELECTED_WF_ID",
    
    SET_CATEGORIES = "SET_CATEGORIES",
    SET_SELECTED_CATEGORY = "SET_SELECTED_CATEGORY",
    SET_CATEGORIES_COUNT = "SET_CATEGORIES_COUNT",

    SET_PROPERTIES = "SET_PROPERTIES",
    SET_SELECTED_PROPERTY = "SET_SELECTED_PROPERTY",
    SET_PROPERTIES_COUNT = "SET_PROPERTIES_COUNT",

    SET_WFS = "SET_WFS",
    SET_SELECTED_WF = "SET_SELECTED_WF",
    SET_WFS_COUNT = "SET_WFS_COUNT",

    SET_TICKET_SLA_EVENTS =  "SET_TICKET_SLA_EVENTS",

    SET_ERROR = "SET_ERROR",
    SET_IS_LOADING = "SET_IS_LOADING",

    GET_TICKET_STATE = "GET_TICKET_STATE"

}

export interface SetTicketsAction {
    type: TicketActionEnum.SET_TICKETS,
    payload: ITicket[]
}
export interface SetSelectedTicketAction {
    type: TicketActionEnum.SET_SELECTED_TICKET,
    payload: ITicket
}

export interface SetCopiedTicketAction {
    type: TicketActionEnum.SET_COPIED_TICKET,
    payload: ITicket
}

export interface SetSelectedTicketPropertiesAction {
    type: TicketActionEnum.SET_SELECTED_TICKET_PROPERTIES,
    payload: ITicketPrpTpl[]
}

export interface SetSelectedTicketWfsAction {
    type: TicketActionEnum.SET_SELECTED_TICKET_WFS,
    payload: ITicketWfTpl[]
}
export interface SetTicketsCountAction {
    type: TicketActionEnum.SET_TICKETS_COUNT,
    payload: number
}

export interface SetTicketsAllWfsAction {  
    type: TicketActionEnum.SET_TICKETS_ALL_WFS,
    payload: ITicketsAllWfs[]
}

export interface SetTicketsAllWfsCountAction {
    type: TicketActionEnum.SET_TICKETS_ALL_WFS_COUNT,
    payload: number
}

export interface SetSelectedWfIdAction {
    type: TicketActionEnum.SET_SELECTED_WF_ID,
    payload: string
}


//---------
export interface SetCategoriesAction {
    type: TicketActionEnum.SET_CATEGORIES,
    payload: ITicketCategory[]
}
export interface SetSelectedCategoryAction {
    type: TicketActionEnum.SET_SELECTED_CATEGORY,
    payload: ITicketCategory
}
export interface SetCategoriesCountAction {
    type: TicketActionEnum.SET_CATEGORIES_COUNT,
    payload: number
}

//---------
export interface SetPropertiesAction {
    type: TicketActionEnum.SET_PROPERTIES,
    payload: ITicketPrpTpl[]
}
export interface SetSelectedPropertyAction {
    type: TicketActionEnum.SET_SELECTED_PROPERTY,
    payload: ITicketPrpTpl
}
export interface SetPropertiesCountAction {
    type: TicketActionEnum.SET_PROPERTIES_COUNT,
    payload: number
}

//---------
export interface SetWfsAction {
    type: TicketActionEnum.SET_WFS,
    payload: ITicketWfTpl[]
}
export interface SetSelectedWfAction {
    type: TicketActionEnum.SET_SELECTED_WF,
    payload: ITicketWfTpl
}
export interface SetWfsCountAction {
    type: TicketActionEnum.SET_WFS_COUNT,
    payload: number
}
//------------------
export interface SetTicketSlaEventsAction {
    type: TicketActionEnum.SET_TICKET_SLA_EVENTS,
    payload: ITicketSlaEvents[]
}
//------------------
export interface SetErrorAction {
    type: TicketActionEnum.SET_ERROR,
    payload: string
}

export interface SetIsLoadingAction {
    type: TicketActionEnum.SET_IS_LOADING,
    payload: boolean
}



export type TicketAction = 
SetTicketsAction |
SetSelectedTicketAction |
SetCopiedTicketAction |
SetSelectedTicketPropertiesAction |
SetSelectedTicketWfsAction |
SetSelectedWfIdAction |
SetTicketsCountAction |
SetCategoriesAction |
SetSelectedCategoryAction | 
SetCategoriesCountAction |
SetErrorAction | 
SetIsLoadingAction |
SetPropertiesAction | 
SetSelectedPropertyAction | 
SetPropertiesCountAction |
SetWfsAction | 
SetSelectedWfAction | 
SetWfsCountAction | 
SetTicketsAllWfsAction | 
SetTicketsAllWfsCountAction |
SetTicketSlaEventsAction




