const ADD_MESSAGE = 'DIALOGS/ADD-MESSAGE'

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
            let message = action.newMessage
            return {
                ...state,
                messages: [...state.messages, { id: 6, message: message, likesCount: 0 }]
            };
        default:
            return state;
    }

}
export const addMessageActiomCreator = (newMessage) => ({ type: ADD_MESSAGE, newMessage })

export default dialogsReducer