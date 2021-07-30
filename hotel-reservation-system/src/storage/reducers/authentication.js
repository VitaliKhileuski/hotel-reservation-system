import initialState from "../initialState";
import {
  IS_LOGGED,
  ROLE,
  NAME,
  EMAIL,
  USER_ID,
  CHECK_IN_DATE,
  CHECK_OUT_DATE,
  OPEN_ALERT,
  MESSAGE,
  ALERT_SUCCESS_STATUS,
  FAILURE_MESSAGE,
} from "../actions/actionTypes.js";

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
    case EMAIL:
      return { ...state, email: action.email };
    case CHECK_IN_DATE:
      return { ...state, checkInDate: action.checkInDate };
    case CHECK_OUT_DATE:
      return { ...state, checkOutDate: action.checkOutDate };
    case OPEN_ALERT:
      return { ...state, openAlert: action.openAlert };
    case MESSAGE:
      return { ...state, message: action.message };
    case ALERT_SUCCESS_STATUS:
      return { ...state, alertSuccessStatus: action.alertSuccessStatus };
    case FAILURE_MESSAGE:
      return { ...state, failureMessage: action.failureMessage };
    default:
      return state;
  }
}
