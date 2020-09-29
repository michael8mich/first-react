import React from 'react';
import Preloader from '../../common/Preloader/Preloader';
import s from './ProfileInfo.module.css'
import userPhoto from '../../../assets/images/userPhoto.png'
import ProfileStatus from './ProfileStatus';
import ProfileStatusWithHooks from './ProfileStatusWithHooks';

const ProfileInfo = (props) => {
    if (!props.profile) {
        return <Preloader />
    }
    else {
        return (
            <div>
                <div>
                    <img src={
                        props.profile.photoImage.large ? props.profile.photoImage.large : userPhoto
                    }
                        className={s.first_img}></img>
                </div>
                <div className={s.descriptionBlock}>
                    {/* {props.profile.aboutMe} */}
                    {/* <ProfileStatus status={props.status} updateStatus={props.updateStatus} /> */}
                    <ProfileStatusWithHooks status={props.status} updateStatus={props.updateStatus} />
                </div>
            </div>
        )
    }

}

export default ProfileInfo