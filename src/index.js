import  "react-app-polyfill/ie9";
import  "react-app-polyfill/stable";
import React from 'react';
import ReactDOM from 'react-dom';
import './asserts/css/index.css';

import App from './App';
import {Provider} from 'react-redux';
import store from './components/redux/store';


import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));



serviceWorker.unregister();
