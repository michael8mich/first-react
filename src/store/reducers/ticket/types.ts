import { ITicket, ITicketCategory, ITicketPrpTpl } from '../../../models/ITicket';

export interface TicketState {
    tickets: ITicket[]
    ticketsCount: number
    selectedTicket: ITicket

    categories: ITicketCategory[]
    categoriesCount: number
    selectedCategory: ITicketCategory

    properties: ITicketPrpTpl[]
    propertiesCount: number
    selectedProperty: ITicketPrpTpl

    isLoading: boolean
    error: string
}

export enum TicketActionEnum {
    SET_TICKETS = "SET_TICKETS",
    SET_SELECTED_TICKET = "SET_SELECTED_TICKET",
    SET_TICKETS_COUNT = "SET_TICKETS_COUNT",
    
    SET_CATEGORIES = "SET_CATEGORIES",
    SET_SELECTED_CATEGORY = "SET_SELECTED_CATEGORY",
    SET_CATEGORIES_COUNT = "SET_CATEGORIES_COUNT",

    SET_PROPERTIES = "SET_PROPERTIES",
    SET_SELECTED_PROPERTY = "SET_SELECTED_PROPERTY",
    SET_PROPERTIES_COUNT = "SET_PROPERTIES_COUNT",

    SET_ERROR = "SET_ERROR",
    SET_IS_LOADING = "SET_IS_LOADING"
}

export interface SetTicketsAction {
    type: TicketActionEnum.SET_TICKETS,
    payload: ITicket[]
}
export interface SetSelectedTicketAction {
    type: TicketActionEnum.SET_SELECTED_TICKET,
    payload: ITicket
}
export interface SetTicketsCountAction {
    type: TicketActionEnum.SET_TICKETS_COUNT,
    payload: number
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
SetTicketsCountAction |
SetCategoriesAction |
SetSelectedCategoryAction | 
SetCategoriesCountAction |
SetErrorAction | 
SetIsLoadingAction |
SetPropertiesAction | 
SetSelectedPropertyAction | 
SetPropertiesCountAction




