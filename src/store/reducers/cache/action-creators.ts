

import { AppDispatch } from '../..';
import { CHART_CONFIG } from '../../../models/IChart';
import { IQueriesCache } from '../../../models/ISearch';
import { CacheActionEnum, SetCacheQueriesAction, SetCacheSmallAction, SetConfigsAction, SetPathForEmptyAction, SetConfigsCleanAction } from './types';

export const CacheActionCreators = {
    setSelectSmall: (payload:any): SetCacheSmallAction => ({type:CacheActionEnum.SET_SELECT_SMALL, payload}),
    setQueriesCache: (payload:any): SetCacheQueriesAction => ({type:CacheActionEnum.SET_QUERIES_CACHE, payload}),
    setPathForEmpty: (payload:string): SetPathForEmptyAction => ({type:CacheActionEnum.SET_PATH_FOR_EMPTY, payload}),
    setConfigs: (payload:CHART_CONFIG): SetConfigsAction => ({type:CacheActionEnum.SET_CONFIGS, payload}),
    setConfigsArr: (payload:CHART_CONFIG[]): SetConfigsCleanAction => ({type:CacheActionEnum.SET_CONFIGS_ARR, payload}),
}