import React, { useState } from 'react';
import Preloader from '../../common/Preloader/Preloader';
import s from './ProfileInfo.module.css'
import userPhoto from '../../../assets/images/userPhoto.png'
import ProfileStatusWithHooks from './ProfileStatusWithHooks';
import MetaTags from 'react-meta-tags';
import { createField, Input, Textarea } from '../../common/FormsControls/FormsControls'
import { reduxForm } from 'redux-form';
import { required } from '../../../utils/validators/validators';

const ProfileInfo = ({ profile, status, updateStatus, isOwner, savePhoto, authorizedUserrId, saveProfile }) => {

    let [editMode, setEditMode] = useState(false);
    const setEditModeTrue = () => {
        setEditMode(true);
    }
    const fileRef = React.createRef()
    const openAttSelect = (e) => {
        fileRef.current.click()
    }
    const onMainPhotoSelect = (e) => {
        if (e.target.files.length) {
            savePhoto(authorizedUserrId, e.target.files[0]);
        }
    }

    const onSubmit = (formData) => {
        saveProfile(authorizedUserrId, formData)
            .then(
                ret => {
                    debugger
                    setEditMode(false);
                }
            )

    }

    if (!profile) {
        return <Preloader />
    }
    else {
        return (
            <div className={s.block}>
                <MetaTags>
                    <meta charSet="utf-8" />
                </MetaTags>
                <div onDoubleClick={openAttSelect} title="Double Click to change Image">
                    <img src={
                        profile.photoImage.large || userPhoto
                    }
                        className={s.first_img}></img>
                </div>

                {isOwner && <input ref={fileRef} className={s.fileAtt} id="fileAtt" name="file" type="file" multiple onChange={onMainPhotoSelect} />}

                {editMode ? <ProfileDataReduxForm initialValues={profile} profile={profile} isOwner={isOwner} onSubmit={onSubmit} />
                    : <ProfileData profile={profile} isOwner={isOwner} setEditModeTrue={setEditModeTrue} />}



                <div className={s.descriptionBlock}>
                    <ProfileStatusWithHooks status={status} updateStatus={updateStatus} isOwner={isOwner} />
                </div>
            </div>
        )
    }

}

const ProfileData = ({ profile, isOwner, setEditModeTrue }) => {
    return (
        <div>
            <div><b>Full Name</b>: {profile.fullName}</div>
            <div><b>looking For Job</b>: {profile.lookingForJob ? "Yes" : "No"}</div>
            <div><b>My professional Skills</b>: {profile.lookingForJobDescription}</div>
            <div><b>About Me</b>: {profile.aboutMe}</div>
            <div><b>Contacts</b>: {
                Object.keys(profile.contacts).map(key => {
                    return <Contact key={key} contactTitle={key}
                        contactValue={profile.contacts[key]} />
                })
            }</div>
            {isOwner && <div><button onClick={setEditModeTrue}>Edit Profile</button></div>}
        </div>
    )
}


const ProfileDataForm = ({ profile, handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div><b>Full Name</b>:
            {createField("Full Name", "fullName", Input, [required])}
            </div>
            <div><b>looking For Job</b>:
            {createField("looking For Job", "lookingForJob", Input, [], { type: "checkbox" })}
            </div>
            <div>
                <b>My professional Skills</b>:
                {createField("My professional Skills", "lookingForJobDescription", Textarea, [])}
            </div>
            <div>
                <b>About Me</b>:
                {createField("About Me", "aboutMe", Textarea, [])}
            </div>
            <div><b>Contacts</b>: {
                Object.keys(profile.contacts).map(key => {
                    return <div key={key} className={s.contact}><b>{key}</b>:
                    {createField(key, "contacts." + key, Input, [])}
                    </div>
                })
            }</div>
            {<div><button >Save Profile</button></div>}
            {/* {props.error && <div className={s.formSummaryError}>{props.error}</div>} */}
        </form>
    )
}
const ProfileDataReduxForm = reduxForm({
    form: 'editProfile'
})(ProfileDataForm)
const Contact = ({ contactTitle, contactValue }) => {
    return <div className={s.contact}><b>{contactTitle}</b>: {contactValue}</div>
}
export default ProfileInfo