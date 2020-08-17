import React from 'react';
import s from './Dialogs.module.css'
import { NavLink } from 'react-router-dom';
const Dialogs = (props) => {
    return (
        <div className={s.dialogs}>
            <div className={s.dialogsItems}>
                <div className={s.dialog + ' ' + s.active}>
                    <NavLink to='/dialogs/1'>Zhanna</NavLink>
                </div>
                <div className={s.dialog}>
                    <NavLink to='/dialogs/2'>Mana</NavLink>
                </div>
                <div className={s.dialog}>
                    <NavLink to='/dialogs/3'>Manana</NavLink>
                </div>
                <div className={s.dialog}>
                    <NavLink to='/dialogs/4'>Muna</NavLink>
                </div>
                <div className={s.dialog}>
                    <NavLink to='/dialogs/5'>Munana</NavLink>
                </div>
                <div className={s.dialog}>
                    <NavLink to='/dialogs/6'>Kara</NavLink>
                </div>
                <div className={s.dialog}>
                    <NavLink to='/dialogs/7'>Kura</NavLink>
                </div>
            </div>
            <div className={s.messages} >
                <div className={s.messages} >Hi</div>
                <div className={s.messages} >Hi Hi</div>
                <div className={s.messages} >Whats Up</div>
                <div className={s.messages} >How is Ypo</div>
            </div>
        </div>)
}

export default Dialogs