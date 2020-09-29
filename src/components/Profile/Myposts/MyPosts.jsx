import React from 'react';
import s from './MyPosts.module.css';
import Post from './Post/Post';
import { reduxForm, Field } from 'redux-form'
import { required, maxLengthCreator } from '../../../utils/validators/validators'
import { Textarea } from '../../common/FormsControls/FormsControls'

const maxLength10 = maxLengthCreator(10);
const MyPosts = (props) => {

    let postsElements = props.profilePage.posts.map(p => <Post id={p.id.toString()} message={p.message} likesCount={p.likesCount.toString()} />)

    let addNewPost = (formData) => {
        props.addPost(formData.newPostText)
        console.log(formData);
    }

    return <div className={s.postBlock}>
        <div >
            <h3>My posts</h3>
            <AddPostsFormRedux onSubmit={addNewPost} />
        </div>
        <div className={s.postes}>
            {postsElements}
        </div>
    </div>
}

const AddPostsForm = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <div>
                <Field component={Textarea} placeholder={"Enter You Post"}
                    name={"newPostText"} validate={[required, maxLength10]} />
            </div>
            <div>
                <button>Add post </button>
            </div>
        </form>
    )
}
const AddPostsFormRedux = reduxForm({
    form: 'profileAddPostsForm'
})(AddPostsForm)
export default MyPosts