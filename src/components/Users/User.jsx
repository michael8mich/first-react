import React from 'react';
import { NavLink } from 'react-router-dom';
import s from './Users.module.css';

let User = ({ user, followingInProgress, setFollow }) => {
    return (
        <div >
            <span>
                <div>
                    <NavLink to={'/profile/' + user.id}>
                        <img src={user.photoUrl} alt="" className={s.userphoto} />
                    </NavLink>
                </div>
                <div>
                    {
                        user.followed
                            ? <button disabled={followingInProgress.some(id => id === user.id)} onClick={
                                () => {
                                    setFollow(true, user.id);
                                }

                            }
                            >UnFollow</button>
                            : <button disabled={followingInProgress.some(id => id === user.id)} onClick={() => {
                                setFollow(false, user.id);
                            }

                            }
                            >Follow</button>
                    }
                </div>
            </span>
            <span>
                <div>{user.fullName}</div>
                <div>{user.status}</div>
            </span>
            <span>
                <div>{user.location.city}</div>
                <div>{user.location.country}</div>
            </span>
        </div>
    )
}

export default User