import React from 'react';
import s from './MyPosts.module.css'
import Post from './Post/Post'

const MyPosts = () => {
    return <div >
        <div >
            my posts
            <div >
                new post
            </div>
        </div>
        <div className={s.postes}>
            <Post message='Hi' />
            <Post message='Post 2' />
            <Post message='Post 3' />
        </div>
    </div>
}

export default MyPosts