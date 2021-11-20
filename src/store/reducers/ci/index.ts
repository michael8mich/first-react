
import { ICi } from "../../../models/ICi"
import { CiAction, CiActionEnum, CiState } from "./types"



const initialState: CiState = {
    cis: [] as ICi[],
    selectedCi: {} as ICi,
    cisCount: 0,
    
    isLoading: false,
    error: ''

}

export default function CiReducer(state = initialState, action:CiAction ):CiState {
    switch (action.type) {
        case CiActionEnum.SET_CIS:
           return {...state, cis: action.payload, isLoading: false }
        case  CiActionEnum.SET_SELECTED_CI:
            return {...state, selectedCi: action.payload }  
        case  CiActionEnum.SET_CIS_COUNT:
            return {...state, cisCount: action.payload }  

       case  CiActionEnum.SET_ERROR:
           return {...state, error: action.payload, isLoading: false  }  
      
       case  CiActionEnum.SET_IS_LOADING:
           return {...state, isLoading: action.payload }    
           
        default:
           return state
    }
}