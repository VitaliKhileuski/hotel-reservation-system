import initialState from "../initialState";
import { DATES, TOKEN_DATA, ALERT_INFO } from "../actions/actionTypes.js";

export default function authentication(state = initialState, action) {
  switch (action.type) {
    case TOKEN_DATA:
      return {
        ...state,
        tokenData: {
          ...state.tokenData,
          isLogged: action.isLogged,
          role: action.role,
          name: action.name,
          userId: action.userId,
          email: action.email,
        },
      };
    case ALERT_INFO:
      return {
        ...state,
        alertInfo: {
          ...state.alertInfo,
          openAlert: action.openAlert,
          message: action.message,
          alertSuccessStatus: action.alertSuccessStatus,
          failureMessage: action.failureMessage,
        },
      };
    case DATES:
      return {
        ...state,
        dates: {
          ...state.dates,
          checkInDate: action.checkInDate,
          checkOutDate: action.checkOutDate,
        },
      };
    default:
      return state;
  }
}
