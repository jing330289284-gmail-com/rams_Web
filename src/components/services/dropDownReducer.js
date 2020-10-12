import {FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE} from './dropDownTypes';

const initialState = {
    dataReques: [],
    error: '',
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_DATA_REQUEST:
            return {
                ...state
            };
        case FETCH_DATA_SUCCESS:
            return {
                dataReques: action.payload,
                error: ''
            };
        case FETCH_DATA_FAILURE:
            return {
                dataReques: [],
                error: action.payload
            };
        default:
            return state;
    }
};

export default reducer;