import profileReducer, { addPostActiomCreator, deletePost } from './profile-reducer';
import ReactDOM from 'react-dom';
import App from '../App'
import React from 'react'
let state = {
    posts: [
        { id: 1, message: "Hi, howare you?", likesCount: 3 },
        { id: 2, message: "It\'s my first post", likesCount: 4 },
        { id: 3, message: "YYYYOOO", likesCount: 5 }
    ]
}



it('New Post Should be added', () => {
    //1. Test data
    let action = addPostActiomCreator("mmmmmmmmmm");
    // 2. Action
    let newState = profileReducer(state, action);
    //3. expectation
    expect(newState.posts.length).toBe(4);

});

it('New Post Should be added correct', () => {
    //1. Test data
    let action = addPostActiomCreator("mmmmmmmmmm");
    // 2. Action
    let newState = profileReducer(state, action);
    //3. expectation
    expect(newState.posts[3].message).toBe("mmmmmmmmmm");

});

it('after deleting length of messages should be increment', () => {
    //1. Test data
    let action = deletePost(1);
    // 2. Action
    let newState = profileReducer(state, action);
    //3. expectation
    expect(newState.posts.length).toBe(2);

});

it('after deleting with not correct id length of messages should not be increment', () => {
    //1. Test data
    let action = deletePost(1000);
    // 2. Action
    let newState = profileReducer(state, action);
    //3. expectation
    expect(newState.posts.length).toBe(3);

});