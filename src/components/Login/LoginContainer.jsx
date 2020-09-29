import React from 'react';
import Login from './Login';
import { connect } from 'react-redux';
import { login } from '../../redux/auth-reducer';

class LoginContainer extends React.Component {
  componentDidMount() {
    //this.props.getAuthUser();

  }
  render() {
    return <Login {...this.props} login={this.props.login} />
  }

}
const mapStateToProps = (state) => (
  {
    isAuth: state.auth.isAuth
  }
)
export default connect(mapStateToProps, { login })(LoginContainer)