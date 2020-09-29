import React from 'react';
import { addMessageActiomCreator } from '../../redux/dialogs-reducer';
import Dialogs from './Dialogs';
import { connect } from 'react-redux';
import { withAuthRedirect } from '../../hoc/withAuthRedirect';
import { compose } from 'redux';

let matStateToProps = (state) => {
    return {
        dialogsPage: state.dialogsPage
    }

}

let matDispatchToProps = (dispatch) => {
    return {
        addMessage: (newMessage) => {
            dispatch(addMessageActiomCreator(newMessage))
        }
    }

}
export default compose(
    connect(matStateToProps, matDispatchToProps),
    withAuthRedirect
)
    (Dialogs)
//const DialogsContainer = connect(matStateToProps, matDispatchToProps)(withAuthRedirect(Dialogs))
//export default DialogsContainer