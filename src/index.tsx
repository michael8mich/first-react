import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
//import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import { HashRouter } from 'react-router-dom'

ReactDOM.render(
      <Provider store={store}>
        <HashRouter basename="">
         <App />
        </HashRouter>
      </Provider>
    ,
  document.getElementById('root')
);

