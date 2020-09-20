import React from 'react';
import s from './Users.module.css';
let Users = (props) => {
    debugger
    if (props.users.length === 0) {
        props.setUsers(
            [
                { id: 1, photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJywdqtVksjz_uX70d9O1RUqJVUmCooVRbiw&usqp=CAU', followed: true, fullName: "Michael Kn", status: 'I am a boss', location: { city: 'Petach Tikva', country: 'Israel' } },
                { id: 2, photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJywdqtVksjz_uX70d9O1RUqJVUmCooVRbiw&usqp=CAU', followed: true, fullName: "Zhanna Me", status: 'I am a boss-s', location: { city: 'Petach Tikva', country: 'Israel' } },
                { id: 3, photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJywdqtVksjz_uX70d9O1RUqJVUmCooVRbiw&usqp=CAU', followed: false, fullName: "Mishel Kn", status: 'I am a student', location: { city: 'Nof Ha Galil', country: 'Israel' } },
                { id: 4, photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJywdqtVksjz_uX70d9O1RUqJVUmCooVRbiw&usqp=CAU', followed: false, fullName: "Boris Ra", status: 'I am a patient', location: { city: 'Kursk', country: 'Russia' } }
            ]
        )
    }


    return (
        <div>
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