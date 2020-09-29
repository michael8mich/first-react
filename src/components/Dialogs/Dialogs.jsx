import React from 'react';
import s from './Dialogs.module.css'
import DilaodItem from './DialogItem/DialogItem';
import Message from './Message/Massage';
import { reduxForm, Field } from 'redux-form'
import { required, maxLengthCreator } from '../../utils/validators/validators'
import { Textarea } from '../../components/common/FormsControls/FormsControls';
const maxLength20 = maxLengthCreator(20);
const Dialogs = (props) => {

    let dialogElements = props.dialogsPage.dialogs.map(d => <DilaodItem name={d.name} id={d.id} />)
    let messagesElements = props.dialogsPage.messages.map(m => <Message name={m.message} id={m.id} />)


    let addNewMessage = (formData) => {
        props.addMessage(formData.newMessageText)
        console.log(formData);
    }
    return (
        <div className={s.dialogs}>
            <div className={s.dialogsItems}>
                {dialogElements}
            </div>
            <div className={s.messages} >
                {messagesElements}
            </div>

            <AddMessageFormRedux onSubmit={addNewMessage} />
        </div>

    )
}
const AddMessageForm = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <div>
                <Field component={Textarea} placeholder={"Enter You Message"}
                    name={"newMessageText"}
                    validate={[required, maxLength20]} />
            </div>
            <div>
                <button>Add message </button>
            </div>
        </form>
    )
}

const AddMessageFormRedux = reduxForm({
    form: 'dialogAddMessageForm'
})(AddMessageForm)
export default Dialogs