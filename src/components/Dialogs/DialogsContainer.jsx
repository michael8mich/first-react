import React from 'react';
import { addMessageActiomCreator, updateNewMessageTextActiomCreator } from '../../redux/dialogs-reducer';
import Dialogs from './Dialogs';
import { connect } from 'react-redux';


let matStateToProps = (state) => {
    return {
        dialogsPage: state.dialogsPage
    }

}

let matDispatchToProps = (dispatch) => {
    return {
        addMessage: () => {
            dispatch(addMessageActiomCreator())
        },
        onMessagetChange: (text) => {
            dispatch(updateNewMessageTextActiomCreator(text))
        }
    }

}

const DialogsContainer = connect(matStateToProps, matDispatchToProps)(Dialogs)

export default DialogsContainer