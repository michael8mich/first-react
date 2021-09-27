import { IEvent } from "../../../models/IEvent"
import { IUser } from "../../../models/IUser"
import { EventAction, EventActionEnum, EventState } from "./types"

const initialState: EventState = {
    guests: [] as IUser[],
    events: [] as IEvent[],
    isLoading: false,
    error: ''

}

export default function EventReducer(state = initialState, action:EventAction ):EventState {
    switch (action.type) {
        case EventActionEnum.SET_GUESTS:
           return {...state, guests: action.payload, isLoading: false }
       case  EventActionEnum.SET_ERROR:
           return {...state, error: action.payload, isLoading: false  }  
       case  EventActionEnum.SET_EVENTS:
           return {...state, events: action.payload }  
       case  EventActionEnum.SET_IS_LOADING:
           return {...state, isLoading: action.payload }    

        default:
           return state
    }
}