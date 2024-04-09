import { SET_OBJECT } from './actions';

const initialState = {
  singleObject: null,
};

const singleObjectReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_OBJECT:
      return {
        ...state,
        singleObject: action.payload,
      };
    default:
      return state;
  }
};

export default singleObjectReducer;
