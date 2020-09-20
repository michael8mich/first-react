import React from 'react';
import s from './Dialogs.module.css'
import DilaodItem from './DialogItem/DialogItem';
import Message from './Message/Massage';

const Dialogs = (props) => {

    let dialogElements = props.dialogsPage.dialogs.map(d => <DilaodItem name={d.name} id={d.id} />)
    let messagesElements = props.dialogsPage.messages.map(m => <Message name={m.message} id={m.id} />)

    let addMessage = () => {

        props.addMessage()
    }

    let onMessagetChange = (event) => {

        let text = event.target.value
        props.onMessagetChange(text)
    }
    return (
        <div className={s.dialogs}>
            <div className={s.dialogsItems}>
                {dialogElements}
            </div>
            <div className={s.messages} >
                {messagesElements}
            </div>
            <div>
                <div>
                    <textarea value={props.dialogsPage.newMessageText} onChange={onMessagetChange} />
                </div>
                <div>
                    <button onClick={addMessage}>Add message </button>
                </div>
            </div>

        </div>

    )
}

export default Dialogs