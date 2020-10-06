
import React from 'react';
import { NavLink } from 'react-router-dom';
import s from './Header.module.css'

const Header = (props) => {
    const logout = () => {
        props.logout(props.login)
    }
    return <header className={s.header}>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_tEaTPW-NZBrGioXYxbX9lYLMO39Xcml0Gw&usqp=CAU" />
        <div className={s.loginBlock}>
            {props.isAuth
                ? <div>{props.login} - <button onClick={logout}>Log out</button></div>
                : <NavLink to={'/login'}>
                    {props.isAuth}  login
                 </NavLink>
            }
        </div>

    </header>
}

export default Header