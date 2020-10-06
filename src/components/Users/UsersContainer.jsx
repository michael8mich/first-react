import React from 'react';
import { connect } from 'react-redux';
import { follow, unfollow, setfollowingInProgress, getUsers, setFollow } from '../../redux/users-reducer';
import Users from './Users';
import Preloader from '../common/Preloader/Preloader';
import { compose } from 'redux';
import { getUsersS, getPageSizeS, getTotalUserCountS, getCurrentPageS, getIsFetchingS, getFollowingInProgressS } from '../../redux/users-selectors';
class UsersContainer extends React.Component {

    onPageChanged = (p) => {
        const { pageSize } = this.props;
        this.props.getUsers(p, pageSize)
    }
    render() {


        return (<>
            { this.props.isFetching ? <Preloader /> : null}
            <Users totalUserCount={this.props.totalUserCount}
                pageSize={this.props.pageSize}
                currentPage={this.props.currentPage}
                onPageChanged={this.onPageChanged}
                users={this.props.users}
                follow={this.props.follow}
                unfollow={this.props.unfollow}
                followingInProgress={this.props.followingInProgress}
                setfollowingInProgress={this.props.setfollowingInProgress}
                setFollow={this.props.setFollow}
            />
        </>
        )
    }
    componentDidMount() {
        setTimeout(() => {
            const { currentPage, pageSize } = this.props;
            this.props.getUsers(currentPage, pageSize)
        }, 1);

    }
}


let mapStateToProps = (state) => {
    return {
        users: getUsersS(state),
        pageSize: getPageSizeS(state),
        totalUserCount: getTotalUserCountS(state),
        currentPage: getCurrentPageS(state),
        totalUserCount: getTotalUserCountS(state),
        isFetching: getIsFetchingS(state),
        followingInProgress: getFollowingInProgressS(state)
    }
}

export default compose(
    connect(mapStateToProps, {
        follow,
        unfollow,
        setfollowingInProgress,
        getUsers,
        setFollow
    }
    )
)(UsersContainer)

