

import { AppDispatch } from '../..';
import { IQueriesCache } from '../../../models/ISearch';
import { CacheActionEnum, SetCacheQueriesAction, SetCacheSmallAction } from './types';

export const CacheActionCreators = {
    setSelectSmall: (payload:any): SetCacheSmallAction => ({type:CacheActionEnum.SET_SELECT_SMALL, payload}),
    setQueriesCache: (payload:any): SetCacheQueriesAction => ({type:CacheActionEnum.SET_QUERIES_CACHE, payload}),
}

