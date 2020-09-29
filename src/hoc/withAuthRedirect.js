import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Login from '../components/Login/Login';

let matStateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth
    }

}
export const withAuthRedirect = (Component) => {
    class RedirectComponent extends React.Component {
        render() {
            if (!this.props.isAuth) return <Redirect to='/Login' />
            return <Component {...this.props} />
        }
    }

    return connect(matStateToProps)(RedirectComponent)
}