const FOLLOW = 'FOLLOW'
const UNFOLLOW = 'UNFOLLOW'
const SET_USERS = 'SET_USERS'
let initialState = {
    users: [
        // { id: 1, photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJywdqtVksjz_uX70d9O1RUqJVUmCooVRbiw&usqp=CAU', followed: true, fullName: "Michael Kn", status: 'I am a boss', location: { city: 'Petach Tikva', country: 'Israel' } },
        // { id: 2, photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJywdqtVksjz_uX70d9O1RUqJVUmCooVRbiw&usqp=CAU', followed: true, fullName: "Zhanna Me", status: 'I am a boss-s', location: { city: 'Petach Tikva', country: 'Israel' } },
        // { id: 3, photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJywdqtVksjz_uX70d9O1RUqJVUmCooVRbiw&usqp=CAU', followed: false, fullName: "Mishel Kn", status: 'I am a student', location: { city: 'Nof Ha Galil', country: 'Israel' } },
        // { id: 4, photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJywdqtVksjz_uX70d9O1RUqJVUmCooVRbiw&usqp=CAU', followed: false, fullName: "Boris Ra", status: 'I am a patient', location: { city: 'Kursk', country: 'Russia' } }
    ]
}
const usersReducer = (state = initialState, action) => {

    switch (action.type) {
        case FOLLOW:
            return {
                ...state,
                users: state.users.map(u => {
                    if (u.id === action.userId)
                        return { ...u, followed: true }
                    else
                        return { ...u }
                })
            };
        case UNFOLLOW:
            return {
                ...state,
                users: state.users.map(u => {
                    debugger
                    if (u.id === action.userId)
                        return { ...u, followed: false }
                    else
                        return { ...u }

                })
            };
        case SET_USERS:
            return {
                ...state,
                users: [...action.users]
            };
        default:
            return state;
    }
}
export const followAC = (userId) => ({ type: FOLLOW, userId })
export const unfollowAC = (userId) => ({ type: UNFOLLOW, userId })
export const setUsersAC = (users) => ({ type: SET_USERS, users })

export default usersReducer