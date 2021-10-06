

import { AppDispatch } from '../..';
import { CacheActionEnum, SetCacheSmallAction } from './types';

export const CacheActionCreators = {
    setSelectSmall: (payload:any): SetCacheSmallAction => ({type:CacheActionEnum.SET_SELECT_SMALL, payload}),
    // addSelectSmall: (selectSmall: any ) => async (dispatch: AppDispatch) => {
    //     debugger 
    //     dispatch(CacheActionCreators.setSelectSmall(selectSmall))
    //   }
}

