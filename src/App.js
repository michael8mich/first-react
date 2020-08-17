import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom'
import './App.css';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Profile/Profile';
import Dialogs from './components/Dialogs/Dialogs';
import Music from './components/Misic/Music';
import News from './components/News/News';
import Settings from './components/Settings/Settings';




const App = () => {
  return (
    <BrowserRouter>
      <div className='app-wrapper'>
        <div className='app-wrapper-header'>
          <Header />
        </div>
        <div className='app-wrapper-navbar'>
          <Navbar />
        </div>
        <div className='app-wrapper-content'>
          <Route path='/dialogs' component={Dialogs} />
          <Route path='/profile' component={Profile} />
          <Route path='/music' component={Music} />
          <Route path='/news' component={News} />
          <Route path='/settings' component={Settings} />
        </div>
      </div>
    </BrowserRouter>
  )
}




export default App;
