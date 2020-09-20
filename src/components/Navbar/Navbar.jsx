import React from 'react';
import s from './Navbar.module.css';
import { NavLink } from 'react-router-dom';
import StoreContext from '../../StoreContext';
import { connect } from 'react-redux';
const Navbar = () => {

    //let frends = props.state.frends.map(f => <div id={f.id} >{f.name}</div>)

    return (
        // <StoreContext.Consumer>
        //     {
        //         (store) => {

        //             let state = store.getState().navbar.frends;
        //             let frends = state.map(f => <div id={f.id} >{f.name}</div>)
        //            return (
        <nav >
            <div className={`${s.item} ${s.active}`}>
                <NavLink to="/profile" activeClassName={s.active}>Profile </NavLink>
            </div>
            <div className={s.item}>
                <NavLink to="/dialogs" activeClassName={s.active}>Messages</NavLink>
            </div>
            <div className={s.item}>
                <NavLink to="/news" activeClassName={s.active}>News</NavLink>
            </div>
            <div className={s.item}>
                <NavLink to="/music" activeClassName={s.active}>Music</NavLink>
            </div>
            <div className={s.item}>
                <NavLink to="/settings" activeClassName={s.active}>Settings</NavLink>
            </div>
            <div>
                {/* {frends} */}
            </div>
        </nav>
        //             )
        //         }
        //     }
        // </StoreContext.Consumer>
    )

}

export default Navbar