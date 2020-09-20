import React from 'react';
import s from './ProfileInfo.module.css'

const ProfileInfo = () => {
    return (
        <div>
            <div>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT2cGUqGnCYT6DxUTYNd8hqbRLcDCZ9c6TsEw&usqp=CAU" className={s.first_img}></img>
            </div>
            <div className={s.descriptionBlock}>
                ava + description
        </div>
        </div>
    )
}

export default ProfileInfo