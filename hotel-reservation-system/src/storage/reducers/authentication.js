import initialState from "../initialState";
import {
  DATES,
  TOKEN_DATA,
  ALERT_INFO,
  UPDATE_TABLE_INFO,
} from "../actions/actionTypes.js";

export default function authentication(state = initialState, action) {
  switch (action.type) {
    case TOKEN_DATA:
      console.log(state);
      console.log(action);
      return {
        ...state,
        tokenData: {
          ...state.tokenData,
          isLogged: action.isLogged,
          role: !!action.role ? action.role : state.tokenData.role,
          name: !!action.name ? action.name : state.tokenData.name,
          userId: !!action.userId ? action.userId : state.tokenData.userId,
          email: !!action.email ? action.email : state.tokenData.email,
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
          checkInDate: !!action.checkInDate
            ? action.checkInDate
            : state.dates.checkInDate,
          checkOutDate: !!action.checkOutDate
            ? action.checkOutDate
            : state.dates.checkOutDate,
        },
      };
    case UPDATE_TABLE_INFO:
      return {
        ...state,
        updateTableInfo: {
          ...state.updateTableInfo,
          updateTable: action.updateTable,
          action: !!action.action
            ? action.action
            : state.updateTableInfo.action,
        },
      };
    default:
      return state;
  }
}
