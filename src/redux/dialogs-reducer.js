const ADD_MESSAGE = 'ADD-MESSAGE'
const UPDATE_NEW_MESSAGE_TEXT = 'UPDATE-NEW-MESSAGE-TEXT'

let initialState = {
    dialogs: [
        { id: 1, name: 'Zhanna' },
        { id: 2, name: 'Mana' },
        { id: 3, name: 'Manana' },
        { id: 4, name: 'Muna' },
        { id: 5, name: 'Munana' },
        { id: 6, name: 'Kara' },
        { id: 7, name: 'Kura' }
    ],
    newMessageText: 'New Message Yo',
    messages: [
        { id: 1, message: 'Hi' },
        { id: 2, message: 'Hi Hi' },
        { id: 3, message: 'Whats Up' },
        { id: 4, message: 'How is Ypo' },
        { id: 5, message: 'Yo Yo' }
    ]
}
const dialogsReducer = (state = initialState, action) => {

    switch (action.type) {
        case ADD_MESSAGE:
            let message = state.newMessageText
            return {
                ...state,
                newMessageText: '',
                messages: [...state.messages, { id: 6, message: message, likesCount: 0 }]
            };
        case UPDATE_NEW_MESSAGE_TEXT:
            return {
                ...state,
                newMessageText: action.newText

            };
        default:
            return state;
    }

}
export const addMessageActiomCreator = () => ({ type: ADD_MESSAGE })
export const updateNewMessageTextActiomCreator = (text) => ({

    type: UPDATE_NEW_MESSAGE_TEXT,
    newText: text

})
export default dialogsReducer