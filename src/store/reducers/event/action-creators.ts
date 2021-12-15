import { IEvent } from './../../../models/IEvent';
import { AppDispatch } from '../..';
import { axiosFn } from '../../../axios/axios';
import { IUser } from './../../../models/IUser';
import { EventActionEnum, SetGuestsAction, SetErrorAction, SetIsLoadingAction, SetEventAction } from './types';
import i18n from "i18next";
import { translateObj, translateObj_event } from '../../../utils/translateObj';

export const EventActionCreators = {
    setGuests: (payload:IUser[]): SetGuestsAction => ({type:EventActionEnum.SET_GUESTS, payload}),
    setEvents: (payload:IEvent[]): SetEventAction => ({type:EventActionEnum.SET_EVENTS, payload}),
    setIsError: (payload:string): SetErrorAction => ({type:EventActionEnum.SET_ERROR, payload}),
    IsLoading: (payload:boolean): SetIsLoadingAction => ({type:EventActionEnum.SET_IS_LOADING, payload}),
    fetchEvents: (me: string ) => async (dispatch: AppDispatch) => {
     try {
        dispatch(EventActionCreators.IsLoading(true))
        const where = ``
        const response = await  axiosFn("get", '', '*', 'V_events', where , ''  )  
        let hasError = false;
        if(response.data["error"]) hasError = true;
            if(response.data&&!hasError)
            {
            let evenets_: any[] = response.data
            const IObjects:string[] = ['author','guest']
            evenets_ = translateObj_event(evenets_, IObjects)
            let events:IEvent[] = evenets_.filter(ev=> ev.author.id === me || ev.guest.id === me )
            dispatch(EventActionCreators.setEvents(events))
            } else
            {
                dispatch(EventActionCreators.setIsError(i18n.t('data_problem')))
            }   
      
       } catch (e) {
       dispatch(EventActionCreators.setIsError(i18n.t('axios_error')))        
      } finally {
        dispatch(EventActionCreators.IsLoading(false))
      }

     },
     fetchGuests: (search: string ) => async (dispatch: AppDispatch) => {
      try {
         dispatch(EventActionCreators.IsLoading(true))
 
         const where = ` name like '%${search}%'  `
         const response = await  axiosFn("get", '', '*', 'V_contacts', where , ''  )  
         let hasError = false;
         if(response.data["error"]) hasError = true;
             if(response.data&&!hasError)
             {
             let users: IUser[] = response.data
             console.log('users',users);
             dispatch(EventActionCreators.setGuests(users))
             } else
             {
                 dispatch(EventActionCreators.setIsError(i18n.t('data_problem'))) 
             }   
       
        } catch (e) {
        dispatch(EventActionCreators.setIsError(i18n.t('axios_error')))        
       } finally {
         dispatch(EventActionCreators.IsLoading(false))
       }
 
     }, 
     createEvent: (event: IEvent ) => async (dispatch: AppDispatch) => {
      try {   
      dispatch(EventActionCreators.IsLoading(true))
      const response = await  axiosFn("post", event, '*', 'events', "id" , ''  )  
      let hasError = false;
      if(response.data["error"]) hasError = true;
            if(response.data&&!hasError)
            {
            let events: IEvent[] = response.data
            } else
            {
                dispatch(EventActionCreators.setIsError(i18n.t('data_problem'))) 
            }   
      
       } catch (e) {
       dispatch(EventActionCreators.setIsError(i18n.t('axios_error')))        
      } finally {
        dispatch(EventActionCreators.IsLoading(false))
      }

     }
}