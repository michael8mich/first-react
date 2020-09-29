import React from 'react';
import { Route } from 'react-router-dom'
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Music from './components/Misic/Music';
import News from './components/News/News';
import Settings from './components/Settings/Settings';
import DialogsContainer from './components/Dialogs/DialogsContainer';
import UsersContainer from './components/Users/UsersContainer';
import ProfileContainer from './components/Profile/ProfileContainer';
import HeaderContainer from './components/Header/HeaderContainer';
import LoginContainer from './components/Login/LoginContainer';
import { initializeApp } from './redux/app-reducer';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Preloader from './components/common/Preloader/Preloader';

class App extends React.Component {
  componentDidMount() {
    this.props.initializeApp();

  }
  render() {
    if (!this.props.initialized)
      return <Preloader />

    return (

      <div className='app-wrapper'>
        <div className='app-wrapper-header'>
          <HeaderContainer />
        </div>
        <div className='app-wrapper-navbar'>
          {/* <Navbar state={props.store.getState().navbar} /> */}
          <Navbar />
        </div>
        <div className='app-wrapper-content'>


          <Route path='/dialogs' render={() => <DialogsContainer />} />
          <Route path='/profile/:userId?' render={() => <ProfileContainer />} />
          <Route path='/users' render={() => <UsersContainer />} />
          <Route path='/login' render={() => <LoginContainer />} />
          <Route path='/music' render={() => <Music />} />
          <Route path='/news' render={() => <News />} />
          <Route path='/settings' render={() => <Settings />} />

        </div>
      </div>
    )

  }


}
const mapStateToProps = (state) => (
  {
    initialized: state.app.initialized
  }
)
export default
  compose(
    withRouter,
    connect(mapStateToProps, { initializeApp })
  )
    (App);
