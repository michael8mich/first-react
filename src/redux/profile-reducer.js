const ADD_POST = 'ADD-POST'
const UPDATE_NEW_POST_TEXT = 'UPDATE-NEW-POST-TEXT'
let initialState = {
    posts: [
        { id: 1, message: "Hi, howare you?", likesCount: 3 },
        { id: 2, message: "It\'s my first post", likesCount: 4 },
        { id: 3, message: "YYYYOOO", likesCount: 5 }
    ],
    newPostText: 'react-first'
}
const profileReducer = (state = initialState, action) => {

    switch (action.type) {
        case ADD_POST:
            let newPostText = state.newPostText;
            return {
                ...state,
                newPostText: '',
                posts: [...state.posts, { id: 4, message: newPostText, likesCount: 0 }]
            };
        case UPDATE_NEW_POST_TEXT:
            return {
                ...state,
                newPostText: action.newText
            };
        default:
            return state;
    }
}
export const addPostActiomCreator = () => ({ type: ADD_POST })
export const updateNewPostTextActiomCreator = (text) => ({

    type: UPDATE_NEW_POST_TEXT,
    newText: text

})
export default profileReducer