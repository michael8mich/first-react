import React from 'react';
import s from './Users.module.css';
import * as axios from 'axios'
import userPhoto from '../../../src/assets/images/user.png'
let Users = (props) => {
    const getUsers = () => {
        //let url = 'http://mx/WebJ/GetJ'
        let url = 'http://mx:8082/q/qh'
        let users = [];
        axios({
            method: 'get',
            url: url,
            params: {},
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000/',
                'first': ' * ',
                'second': ' users',
                'third': ' 1=1 '
            }
        })
            .then((data) => {


                if (data.data.length > 0) {
                    users = data.data.map((u) => {
                        return {
                            id: u.id,
                            photoUrl: u.photoUrl ? u.photoUrl : userPhoto,
                            followed: u.followed == 1 ? true : false,
                            fullName: u.fullName,
                            status: u.status,
                            location: { city: u.city, country: u.country }
                        }

                    })
                }
                if (props.users.length === 0)
                    props.setUsers(users);
                console.log('data:', data);
                console.log('users:', users);
            })
    }


    return (

        <div>
            <div><button onClick={getUsers}>Get Users</button></div>
            {
                props.users.map(u =>
                    <div key={u.id}>
                        <span>
                            <div>
                                <img src={u.photoUrl} alt="" className={s.userphoto} />
                            </div>
                            <div>
                                {
                                    u.followed
                                        ? <button onClick={() => props.unfollow(u.id)}>UnFollow</button>
                                        : <button onClick={() => props.follow(u.id)}>Follow</button>
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
        </div>
    )
}

export default Users