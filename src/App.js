import React from 'react';
import { Route } from 'react-router-dom'
import './App.css';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Profile/Profile';
import Music from './components/Misic/Music';
import News from './components/News/News';
import Settings from './components/Settings/Settings';
import DialogsContainer from './components/Dialogs/DialogsContainer';
import UsersContainer from './components/Users/UsersContainer';




const App = (props) => {

  return (

    <div className='app-wrapper'>
      <div className='app-wrapper-header'>
        <Header />
      </div>
      <div className='app-wrapper-navbar'>
        {/* <Navbar state={props.store.getState().navbar} /> */}
        <Navbar />
      </div>
      <div className='app-wrapper-content'>


        <Route path='/dialogs' render={() => <DialogsContainer />} />
        <Route path='/profile' render={() => <Profile />} />
        <Route path='/users' render={() => <UsersContainer />} />
        <Route path='/music' render={() => <Music />} />
        <Route path='/news' render={() => <News />} />
        <Route path='/settings' render={() => <Settings />} />

      </div>
    </div>
  )
}




export default App;
