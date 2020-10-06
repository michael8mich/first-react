import React from 'react';
import Profile from './Profile';
import { getProfile, getStatus, updateStatus, savePhoto, saveProfile } from '../../redux/profile-reducer';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

class ProfileContainer extends React.Component {

    loadUserProfile() {
        let userId = this.props.match.params.userId;
        if (!userId) userId = this.props.authorizedUserrId;
        if (!userId) this.props.history.push("/login");
        this.props.getProfile(userId);
        this.props.getStatus(userId);
    }
    componentDidMount() {
        this.loadUserProfile();
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.match.params.userId !== prevProps.match.params.userId) {
            this.loadUserProfile();
        }

    }
    render() {

        return (
            <div>
                <Profile {...this.props}
                    isOwner={!this.props.match.params.userId}
                    profile={this.props.profile}
                    status={this.props.status}
                    updateStatus={this.props.updateStatus}
                    savePhoto={this.props.savePhoto}
                    authorizedUserrId={this.props.authorizedUserrId}
                    saveProfile={this.props.saveProfile}
                />
            </div>
        )
    }

}

let mapStateToProps = (state) => ({
    profile: state.profilePage.profile,
    status: state.profilePage.status,
    authorizedUserrId: state.auth.userId,
    isAuth: state.auth.isAuth
});


export default compose(
    connect(mapStateToProps, { getProfile, getStatus, updateStatus, savePhoto, saveProfile }),
    withRouter
)
    (ProfileContainer)
//export default connect(mapStateToProps, { getProfile })(withRouter(withAuthRedirect(ProfileContainer)));