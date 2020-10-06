import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Music from './components/Music/Music';
import News from './components/News/News';
import Settings from './components/Settings/Settings';
import UsersContainer from './components/Users/UsersContainer';
import HeaderContainer from './components/Header/HeaderContainer';
import { initializeApp } from './redux/app-reducer';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Preloader from './components/common/Preloader/Preloader';
import store from './redux/redux-store'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { withSuspense } from './hoc/withSuspense';

const DialogsContainer = React.lazy(() => import('./components/Dialogs/DialogsContainer'));
const ProfileContainer = React.lazy(() => import('./components/Profile/ProfileContainer'));
const LoginContainer = React.lazy(() => import('./components/Login/LoginContainer'));

class App extends React.Component {
  catchAllUnhandledErrors = (promise) => {
    alert(promise.reason);
  }
  componentDidMount() {
    this.props.initializeApp();
    window.addEventListener("unhandledrejection", this.catchAllUnhandledErrors)
  }
  componentWillUnmount() {
    window.removeEventListener("unhandledrejection", this.catchAllUnhandledErrors)
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

          <Switch>
            <Route exact path='/' render={() => <Redirect to={"/profile"} />} />
            <Route path='/dialogs' render={withSuspense(DialogsContainer)} />
            <Route path='/profile/:userId?' render={withSuspense(ProfileContainer)} />
            <Route path='/users' render={() => <UsersContainer />} />
            <Route path='/login' render={withSuspense(LoginContainer)} />
            <Route path='/music/facebook' render={() => <div>facebook</div>} />
            <Route path='/music' render={() => <Music />} />
            <Route path='/news' render={() => <News />} />
            <Route path='/settings' render={() => <Settings />} />
            <Route path='*' render={() => <div> 404 Not found</div>} />
          </Switch>
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


let APPContainer = compose(
  withRouter,
  connect(mapStateToProps, { initializeApp })
)(App);

let MainApp = (props) => {
  return <HashRouter>
    <Provider store={store}>
      <APPContainer />
    </Provider>
  </HashRouter>
}

export default MainApp