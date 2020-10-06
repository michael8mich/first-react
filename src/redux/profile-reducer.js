import { restApi } from '../api/api';
import { stopSubmit } from 'redux-form';
const ADD_POST = 'PROFILE/ADD-POST'
const DELETE_POST = 'PROFILE/DELETE_POST'
const SET_USER_PROFILE = 'PROFILE/SET_USER_PROFILE'
const SET_STATUS = 'PROFILE/SET_STATUS'
const SAVE_PHOTO_SUCCESS = 'PROFILE/SAVE_PHOTO_SUCCESS'
const ATT_PATH = 'http://mx/'
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
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(p => p.id != action.id)
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
        case SAVE_PHOTO_SUCCESS:
            return {
                ...state,
                profile: { ...state.profile, photoImage: action.photos }
            };


        default:
            return state;
    }
}
export const addPostActiomCreator = (newPostText) => ({ type: ADD_POST, newPostText })
export const deletePost = (id) => ({ type: DELETE_POST, id })
export const setStatus = (status) => ({ type: SET_STATUS, status })
export const savePhotoSuccess = (photos) => ({ type: SAVE_PHOTO_SUCCESS, photos })

const setUserProfile = (profile) => ({ type: SET_USER_PROFILE, profile })

export const getProfile = (id) => async (dispatch) => {
    let data = await restApi.globalApi('get',
        ' * ',
        ' users ',
        ' userid=\'' + id + '\''
    )
    if (data[0]) {
        let profileDate = data[0]
        let profile = {
            aboutMe: profileDate.aboutMe,
            fullName: profileDate.fullName,
            userId: profileDate.userId,
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
}

export const getStatus = (id) => async (dispatch) => {
    let data = await restApi.globalApi('get',
        ' status ',
        ' users ',
        ' userid=\'' + id + '\''
    )
    dispatch(setStatus(data[0].status));
}
export const updateStatus = (id, status) => async (dispatch) => {
    try {
        let response = await restApi.globalApi('put',
            ' { "status": "\'' + status + '\'"} ',
            ' users ',
            ' userid=\'' + id + '\''
        )
        if (response)
            if (response[0] == 1)
                dispatch(setStatus(status));
    } catch (error) {
        console.log('error', error);


    }

}

export const savePhoto = (id, file) => async (dispatch) => {
    let result = await restApi.savePhoto('post', file)
    let photoImage = {
        large: ATT_PATH + result.path.replace('\\', '/'),
        small: ATT_PATH + result.path.replace('\\', '/')
    }
    let data = await restApi.globalApi('put',
        ' { "large": "\'' + photoImage.large + '\'" , "small": "\'' + photoImage.small + '\'"} ',
        ' users ',
        ' userid=\'' + id + '\''
    )
    if (data)
        if (data[0] == 1) {
            dispatch(savePhotoSuccess(photoImage));
        }
}

export const saveProfile = (id, profile) => async (dispatch) => {
    console.log(profile)
    let data = '';
    Object.keys(profile)
        .map(key => {
            if (typeof profile[key] === 'object') {
                let profileIn = profile[key]
                Object.keys(profileIn).map(key => {
                    data += JSON.stringify(key) + ":" + JSON.stringify(profileIn[key] === true ? 1 :
                        profileIn[key] === false ? 0 : "'" + profileIn[key] + "'"
                    ) + ' ,'
                })
            }
            else
                data += JSON.stringify(key) + ":" + JSON.stringify(profile[key] === true ? 1 :
                    profile[key] === false ? 0 : "'" + profile[key] + "'"
                ) + ' ,'
        })

    data = '{' + data + '}';
    data = data.replace(",}", "}");
    let result = await restApi.globalApi('put',
        data,
        ' users ',
        ' userid=\'' + id + '\''
    )
    if (result)
        if (result[0] == 1)
            dispatch(getProfile(id));
        else {
            dispatch(stopSubmit('editProfile', { _error: "Update Fail" }))
        }
}

export default profileReducer