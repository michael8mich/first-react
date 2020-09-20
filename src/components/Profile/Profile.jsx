import React from 'react';
import s from './Profile.module.css'
import MyPosts from './Myposts/MyPosts';
import ProfileInfo from './Profilinfo/ProfileInfo';
import MyPostsContainer from './Myposts/MyPostsContainer';
const Profile = (props) => {
    return <div >
        <ProfileInfo />
        <MyPostsContainer />
    </div>
}

export default Profile