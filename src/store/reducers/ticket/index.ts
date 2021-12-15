import { ITicket, ITicketCategory, ITicketPrpTpl, ITicketWfTpl } from "../../../models/ITicket"
import { TicketAction, TicketActionEnum, TicketState } from "./types"


const initialState: TicketState = {
    tickets: [] as ITicket[],
    selectedTicket: {} as ITicket,
    copiedTicket: {} as ITicket,

    ticketsCount: 0,
    categories: [] as ITicketCategory[],
    categoriesCount: 0,
    selectedCategory: {} as ITicketCategory,

    properties: [] as ITicketPrpTpl[],
    propertiesCount: 0,
    selectedProperty: {} as ITicketPrpTpl,

    wfs: [] as ITicketWfTpl[],
    wfsCount: 0,
    selectedWf: {} as ITicketWfTpl,

    isLoading: false,
    error: ''

}
export default function TicketReducer(state = initialState, action:TicketAction ):TicketState {

    switch (action.type) {
        case TicketActionEnum.SET_TICKETS:
           return {...state, tickets: action.payload, isLoading: false }
        case  TicketActionEnum.SET_SELECTED_TICKET:
            return {...state, selectedTicket: action.payload } 
        case  TicketActionEnum.SET_COPIED_TICKET:
                return {...state, copiedTicket: action.payload }     

        case  TicketActionEnum.SET_SELECTED_TICKET_PROPERTIES:
                return {...state,  selectedTicket:  { ...state.selectedTicket,  ticketProperties: action.payload }}  

        case  TicketActionEnum.SET_SELECTED_TICKET_WFS:
                    return {...state,  selectedTicket:  { ...state.selectedTicket,  ticketWfs: action.payload }}  

        case  TicketActionEnum.SET_TICKETS_COUNT:
            return {...state, ticketsCount: action.payload }   
        
        case TicketActionEnum.SET_CATEGORIES:
                return {...state, categories: action.payload, isLoading: false }
        case  TicketActionEnum.SET_SELECTED_CATEGORY:
                 return {...state, selectedCategory: action.payload }  
        case  TicketActionEnum.SET_CATEGORIES_COUNT:
                 return {...state, categoriesCount: action.payload } 
        
        case  TicketActionEnum.SET_PROPERTIES:
                    return {...state, properties: action.payload, isLoading: false }
        case  TicketActionEnum.SET_SELECTED_PROPERTY:
                     return {...state, selectedProperty: action.payload }  
        case  TicketActionEnum.SET_PROPERTIES_COUNT:
                     return {...state, propertiesCount: action.payload }         
                     
        case  TicketActionEnum.SET_WFS:
                        return {...state, wfs: action.payload, isLoading: false }
        case  TicketActionEnum.SET_SELECTED_WF:
                         return {...state, selectedWf: action.payload }  
        case  TicketActionEnum.SET_WFS_COUNT:
                         return {...state, wfsCount: action.payload }                  
                 
       case  TicketActionEnum.SET_ERROR:
           return {...state, error: action.payload, isLoading: false  }           
       case  TicketActionEnum.SET_IS_LOADING:
           return {...state, isLoading: action.payload }     
        default:
           return state
    }
}
