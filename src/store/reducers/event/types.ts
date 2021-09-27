import { IEvent } from './../../../models/IEvent';
import { IUser } from './../../../models/IUser';


export interface EventState {
    guests: IUser[]
    events: IEvent[]
    isLoading: boolean
    error: string
}

export enum EventActionEnum {
    SET_GUESTS = "SET_GUESTS",
    SET_ERROR = "SET_ERROR",
    SET_EVENTS = "SET_EVENTS",
    SET_IS_LOADING = "SET_IS_LOADING"
}

export interface SetGuestsAction {
    type: EventActionEnum.SET_GUESTS,
    payload: IUser[]
}

export interface SetErrorAction {
    type: EventActionEnum.SET_ERROR,
    payload: string
}

export interface SetEventAction {
    type: EventActionEnum.SET_EVENTS,
    payload: IEvent[]
}

export interface SetIsLoadingAction {
    type: EventActionEnum.SET_IS_LOADING,
    payload: boolean
}

export type EventAction = 
SetGuestsAction |
SetErrorAction | 
SetEventAction | 
SetIsLoadingAction


