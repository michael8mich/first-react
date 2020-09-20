import React from 'react';
import s from './MyPosts.module.css';
import Post from './Post/Post';

const MyPosts = (props) => {

    let postsElements = props.profilePage.posts.map(p => <Post id={p.id.toString()} message={p.message} likesCount={p.likesCount.toString()} />)
    let newPostElement = React.createRef()

    let addAddPost = () => {
        props.addPost()
    }
    let onPostChange = () => {
        let text = newPostElement.current.value
        props.onPostChange(text)
    }
    return <div className={s.postBlock}>
        <div >
            <h3>My posts</h3>
            <div >
                <div>
                    <textarea ref={newPostElement} value={props.profilePage.newPostText} onChange={onPostChange} />
                </div>
                <div>
                    <button onClick={addAddPost}>Add post </button>
                </div>
            </div>
        </div>
        <div className={s.postes}>
            {postsElements}
        </div>
    </div>
}

export default MyPosts