import {combineReducers} from 'redux';
import userReducer from './dropDownReducer';

const rootReducer = combineReducers({
    data: userReducer,
});

export default rootReducer;