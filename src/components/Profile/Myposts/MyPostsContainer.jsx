import React from 'react';
import { addPostActiomCreator } from '../../../redux/profile-reducer';
import MyPosts from './MyPosts';
import { connect } from 'react-redux';


let matStateToProps = (state) => {
    return {
        profilePage: state.profilePage
    }

}

let matDispatchToProps = (dispatch) => {
    return {
        addPost: (newPostText) => {
            dispatch(addPostActiomCreator(newPostText))
        },
    }

}

const MyPostsContainer = connect(matStateToProps, matDispatchToProps)(MyPosts)
export default MyPostsContainer