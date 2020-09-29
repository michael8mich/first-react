import React from 'react';
import { NavLink } from 'react-router-dom';
import s from './Users.module.css';





let Users = (props) => {
    let pageCount = Math.ceil(props.totalUserCount / props.pageSize);
    let pages = [];
    for (let i = 1; pageCount >= i; i++) {
        pages.push(i)
    }
    return (
        <div>
            <div>
                {pages.map(p => {
                    return <span onClick={(e) => props.onPageChanged(p)}
                        className={(props.currentPage === p && s.selectedPage) + ' ' + s.pageSelector}  >{p}</span>
                })}

            </div>
            <br />
            {
                props.users.map(u =>
                    <div key={u.id}>
                        <span>
                            <div>
                                <NavLink to={'/profile/' + u.id}>
                                    <img src={u.photoUrl} alt="" className={s.userphoto} />
                                </NavLink>
                            </div>
                            <div>
                                {
                                    u.followed
                                        ? <button disabled={props.followingInProgress.some(id => id === u.id)} onClick={
                                            () => {
                                                props.setFollow(true, u.id);
                                            }

                                        }
                                        >UnFollow</button>
                                        : <button disabled={props.followingInProgress.some(id => id === u.id)} onClick={() => {
                                            props.setFollow(false, u.id);
                                        }

                                        }
                                        >Follow</button>
                                }
                            </div>
                        </span>
                        <span>
                            <div>{u.fullName}</div>
                            <div>{u.status}</div>
                        </span>
                        <span>
                            <div>{u.location.city}</div>
                            <div>{u.location.country}</div>
                        </span>
                    </div>

                )
            }
        </div >
    )
}


export default Users