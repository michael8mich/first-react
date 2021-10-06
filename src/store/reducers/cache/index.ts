import { CacheAction,CacheActionEnum, CacheState } from "./types"

const initialState: CacheState = {
    selectSmall: [] as any
}

export default function CacheReducer(state = initialState, action:CacheAction ):CacheState {
    switch (action.type) {
        case CacheActionEnum.SET_SELECT_SMALL: {
            let s = { ...state.selectSmall, ...action.payload }
            return {...state, selectSmall: s }
        } 
        default:
           return state
    }
}