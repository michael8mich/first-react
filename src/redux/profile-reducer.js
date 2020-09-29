import { restApi } from '../api/api';
const ADD_POST = 'ADD-POST'
const SET_USER_PROFILE = 'SET_USER_PROFILE'
const SET_STATUS = 'SET_STATUS'

let initialState = {
    posts: [
        { id: 1, message: "Hi, howare you?", likesCount: 3 },
        { id: 2, message: "It\'s my first post", likesCount: 4 },
        { id: 3, message: "YYYYOOO", likesCount: 5 }
    ],
    profile: null,
    status: ""
}
const profileReducer = (state = initialState, action) => {

    switch (action.type) {
        case ADD_POST:
            let newPostText = action.newPostText;
            return {
                ...state,
                newPostText: '',
                posts: [...state.posts, { id: 4, message: newPostText, likesCount: 0 }]
            };
        case SET_USER_PROFILE:
            return {
                ...state,
                profile: action.profile
            };
        case SET_STATUS:
            return {
                ...state,
                status: action.status
            };

        default:
            return state;
    }
}
export const addPostActiomCreator = (newPostText) => ({ type: ADD_POST, newPostText })
export const setStatus = (status) => ({ type: SET_STATUS, status })
const setUserProfile = (profile) => ({ type: SET_USER_PROFILE, profile })

export const getProfile = (id) => {
    return (dispatch) => {
        restApi.globalApi('get',
            ' * ',
            ' users ',
            ' userid=\'' + id + '\''
        )
            .then((data) => {
                if (data[0]) {
                    let profileDate = data[0]
                    let profile = {
                        aboutMe: profileDate.aboutMe,
                        fullName: profileDate.fullName,
                        userId: profileDate.fullName,
                        lookingForJob: profileDate.lookingForJob,
                        lookingForJobDescription: profileDate.lookingForJobDescription,
                        contacts: {
                            facebook: profileDate.facebook,
                            github: profileDate.github,
                            instagram: profileDate.instagram,
                            mainLink: profileDate.mainLink,
                            twitter: profileDate.twitter,
                            vk: profileDate.vk,
                            website: profileDate.website,
                            youtube: profileDate.youtube
                        },
                        photoImage: {
                            large: profileDate.large,
                            small: profileDate.small,
                        }
                    }
                    dispatch(setUserProfile(profile));
                }

            })

    }
}
export const getStatus = (id) => {
    return (dispatch) => {
        restApi.globalApi('get',
            ' status ',
            ' users ',
            ' userid=\'' + id + '\''
        )
            .then((data) => {
                dispatch(setStatus(data[0].status));
            })
    }
}
export const updateStatus = (id, status) => {
    return (dispatch) => {
        restApi.globalApi('put',
            ' { "status": "\'' + status + '\'"} ',
            ' users ',
            ' userid=\'' + id + '\''
        )
            .then((data) => {
                if (data)
                    if (data[0] == 1)
                        dispatch(setStatus(status));
            })
    }
}
export default profileReducer