import { restApi } from '../api/api';
import userPhoto from '../assets/images/userPhoto.png'
import { updateObjectInArray } from '../utils/object-helpers';


const FOLLOW = 'USERS/FOLLOW'
const UNFOLLOW = 'USERS/UNFOLLOW'
const SET_USERS = 'USERS/SET_USERS'
const SET_CURRENT_PAGE = 'USERS/SET_CURRENT_PAGE'
const SET_TOTAL_USER_COUNT = 'USERS/SET_TOTAL_USER_COUNT'
const TOGGLE_IS_FETCHING = 'USERS/TOGGLE_IS_FETCHING'
const TOGGLE_IS_FOLLOWING_PROGRESS = 'USERS/TOGGLE_IS_FOLLOWING_PROGRESS'

let initialState = {
    users: [],
    pageSize: 3,
    totalUserCount: 0,
    currentPage: 2,
    isFetching: false,
    followingInProgress: []

}
const usersReducer = (state = initialState, action) => {

    switch (action.type) {
        case FOLLOW:
            return {
                ...state,
                users: updateObjectInArray(state.users, action.userId, "id", { followed: true })
            };
        case UNFOLLOW:
            return {
                ...state,
                users: updateObjectInArray(state.users, action.userId, "id", { followed: false })
            };
        case SET_USERS:
            return {
                ...state,
                users: [...action.users]
            };
        case SET_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.currentPage
            };
        case SET_TOTAL_USER_COUNT:
            return {
                ...state,
                totalUserCount: action.totalUserCount
            };
        case TOGGLE_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            };
        case TOGGLE_IS_FOLLOWING_PROGRESS:
            return {
                ...state,
                followingInProgress: action.isFetching
                    ? [...state.followingInProgress, action.id]
                    : state.followingInProgress.filter(id => id != action.id)
            };

        default:
            return state;
    }
}
export const follow = (userId) => ({ type: FOLLOW, userId })
export const unfollow = (userId) => ({ type: UNFOLLOW, userId })
export const setUsers = (users) => ({ type: SET_USERS, users })
export const setCurrentPage = (currentPage) => ({ type: SET_CURRENT_PAGE, currentPage: currentPage })
export const setTotalUserCount = (totalUserCount) => ({ type: SET_TOTAL_USER_COUNT, totalUserCount })
export const setIsFetching = (isFetching) => ({ type: TOGGLE_IS_FETCHING, isFetching })
export const setfollowingInProgress = (isFetching, id) => ({ type: TOGGLE_IS_FOLLOWING_PROGRESS, isFetching, id })

export const getUsers = (currentPage, pageSize) => async (dispatch) => {
    dispatch(setCurrentPage(currentPage))
    let users = [];
    dispatch(setIsFetching(true))
    let data = await restApi.getList(currentPage, pageSize, 'get', '*', 'users', '1=1', 'id')
    users = data.map((u) => {
        return {
            id: u.id,
            photoUrl: u.photoUrl ? u.photoUrl : userPhoto,
            followed: u.followed == 1 ? true : false,
            fullName: u.fullName,
            status: u.status,
            location: { city: u.city, country: u.country }
        }

    })
    dispatch(setUsers(users));
    let dataCount = await restApi.globalApi('get',
        ' count(-1) as cnt ',
        ' users ',
        ' 1=1  ')

    dispatch(setIsFetching(false))
    dispatch(setTotalUserCount(dataCount[0].cnt))
}
export const setFollow = (type, id) => async (dispatch) => {
    dispatch(setfollowingInProgress(true, id));
    if (type)
        dispatch(unfollow(id))
    else
        dispatch(follow(id))
    setTimeout(async () => {
        let data = await restApi.globalApi('put',
            ' {"followed": ' + (type ? 0 : 1) + '} ',
            ' users ',
            ' id=' + id
        )
        if (data[0] == '1')
            dispatch(setfollowingInProgress(false, id))
    }, 1000);

}
export default usersReducer