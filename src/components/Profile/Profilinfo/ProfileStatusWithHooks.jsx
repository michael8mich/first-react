import React, { useState } from 'react';
import { useEffect } from 'react';
import s from './ProfileInfo.module.css'

//habr.com/ru/company/ruvds/blog/445276

const ProfileStatusWithHooks = (props) => {
    let [editMode, setEditMode] = useState(false);
    let [status, setStatus] = useState(props.status);
    useEffect(() => {
        setStatus(props.status);
    }, [props.status])
    const activateEditMode = () => {
        setEditMode(true)
    }
    const deActivateEditMode = () => {
        setEditMode(false)
        props.updateStatus(1, status)
    }
    const onStatusChange = (event) => {
        setStatus(event.currentTarget.value);
    }
    return (
        <div>
            {!editMode &&
                <div >
                    <span onDoubleClick={activateEditMode}
                    >{status || "--------"}</span>
                </div>
            }
            {editMode &&
                <div ><input onBlur={deActivateEditMode}
                    onChange={onStatusChange}
                    autoFocus={true} value={status} /></div>
            }
        </div>
    )
}

export default ProfileStatusWithHooks