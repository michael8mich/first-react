import { createSelector } from "reselect";

export const getUsersSelector = (state) => {
    return state.usersPage.users;
}
export const getUsersS = createSelector(getUsersSelector, (users) => {
    return users.filter(u => true);
})


export const getPageSizeS = (state) => {
    return state.usersPage.pageSize;
}
export const getCurrentPageS = (state) => {
    return state.usersPage.currentPage;
}
export const getTotalUserCountS = (state) => {
    return state.usersPage.totalUserCount;
}
export const getIsFetchingS = (state) => {
    return state.usersPage.isFetching;
}
export const getFollowingInProgressS = (state) => {
    return state.usersPage.followingInProgress;
}