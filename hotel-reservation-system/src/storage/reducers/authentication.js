import initialState from "../initialState";
import { IS_LOGGED, ROLE, NAME, USER_ID } from "../actions/actionTypes.js";

export default function authentication(state = initialState, action) {
  switch (action.type) {
    case IS_LOGGED:
      return { ...state, isLogged: action.isLogged };
    case ROLE:
      return { ...state, role: action.role };
    case NAME:
      return { ...state, name: action.name };
    case USER_ID:
      return { ...state, userId: action.userId };
    default:
      return state;
  }
}
