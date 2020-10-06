import React from 'react';
import s from './Profile.module.css'
import MyPosts from './Myposts/MyPosts';
import ProfileInfo from './Profilinfo/ProfileInfo';
import MyPostsContainer from './Myposts/MyPostsContainer';
const Profile = (props) => {
    return <div >
        <ProfileInfo profile={props.profile} status={props.status}
            updateStatus={props.updateStatus}
            isOwner={props.isOwner}
            savePhoto={props.savePhoto}
            authorizedUserrId={props.authorizedUserrId}
            saveProfile={props.saveProfile}
        />
        <MyPostsContainer />
    </div>
}

export default Profile