import { IObject } from './IObject';
export interface IEvent {
    id: string
    author: IObject
    guest: IObject
    event_dt: string
    description: string
}

