import profileReducer from "./profile-reducer";
import dialogsReducer from "./dialogs-reducer";
import navbarReducer from "./navbar-reducer";

let store = {

    _state: {
        dialogPage: {
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
        },
        profilePage: {

            posts: [
                { id: 1, message: "Hi, howare you?", likesCount: 3 },
                { id: 2, message: "It\'s my first post", likesCount: 4 },
                { id: 3, message: "YYYYOOO", likesCount: 5 }
            ],
            newPostText: 'react-first'
        },
        navbar: {
            frends: [
                { id: 1, name: "Misha" },
                { id: 2, name: "Borik" },
                { id: 3, name: "Dima" }
            ]

        }
    },
    _rerenderEntireTree() {
    },
    subscribe(observer) {
        this._rerenderEntireTree = observer;
    },
    getState() {
        return this._state
    },
    dispatch(action) {
        this._state.profilePage = profileReducer(this._state.profilePage, action);
        this._state.dialogPage = dialogsReducer(this._state.dialogPage, action);
        this._state.navbar = navbarReducer(this._state.navbar, action);
        this._rerenderEntireTree(this)
    }
}




export default store
