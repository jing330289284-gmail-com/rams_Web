import React from 'react';
import ReactDOM from 'react-dom';
import './asserts/css/index.css';

import App from './App';
import {Provider} from 'react-redux';
import store from './components/services/store';

import * as serviceWorker from './serviceWorker';

/*ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
*/
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));



serviceWorker.unregister();
