import React from 'react';
import { addPostActiomCreator, updateNewPostTextActiomCreator } from '../../../redux/profile-reducer';
import MyPosts from './MyPosts';
import { connect } from 'react-redux';


let matStateToProps = (state) => {
    return {
        profilePage: state.profilePage
    }

}

let matDispatchToProps = (dispatch) => {
    return {
        addPost: () => {
            dispatch(addPostActiomCreator())
        },
        onPostChange: (text) => {
            dispatch(updateNewPostTextActiomCreator(text))
        }
    }

}

const MyPostsContainer = connect(matStateToProps, matDispatchToProps)(MyPosts)
export default MyPostsContainer