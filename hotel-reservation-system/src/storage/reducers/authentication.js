import initialState from "../initialState";
import { DATES, TOKEN_DATA, ALERT_INFO } from "../actions/actionTypes.js";

export default function authentication(state = initialState, action) {
  switch (action.type) {
    case TOKEN_DATA:
      console.log(state);
      console.log(action);
      return {
        ...state,
        tokenData: {
          ...state.tokenData,
          isLogged: !!action.isLogged ? action.isLogged : state.tokenData.isLogged,
          role:!!action.role ? action.role : state.tokenData.isLogged, 
          name:!!action.name ? action.name : state.tokenData.name,
          userId:!!action.userId ? action.userId : state.tokenData.userId,
          email:!!action.email ? action.email : state.tokenData.email,
        },
      };
    case ALERT_INFO:
      return {
        ...state,
        alertInfo: {
          ...state.alertInfo,
          openAlert:action.openAlert,
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
          checkInDate:!!action.checkInDate ? action.checkInDate : state.dates.checkInDate,
          checkOutDate:!!action.checkOutDate ? action.checkOutDate : state.dates.checkOutDate,
        },
      };
    default:
      return state;
  }
}
