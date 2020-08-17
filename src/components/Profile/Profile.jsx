import React from 'react';
import s from './Profile.module.css'
import MyPosts from './Myposts/MyPosts';
const Profile = () => {
    return <div >
        <div >
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT2cGUqGnCYT6DxUTYNd8hqbRLcDCZ9c6TsEw&usqp=CAU" className={s.first_img}></img>
        </div>
        <div>
            ava + description
   <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTgolBdeaXdt7hZ4G28YiA8shOCg4jkBg08uA&usqp=CAU" className={s.second_img}></img>
        </div>

        <MyPosts />
    </div>
}

export default Profile