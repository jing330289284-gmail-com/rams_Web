import {combineReducers} from 'redux';
import dropDownReducer from './dropDownReducer';

const rootReducer = combineReducers({
    data: dropDownReducer,
});

export default rootReducer;