import { ALERT_INFO } from "../storage/actions/actionTypes";
import store from "./../storage/storage";

export function callSuccessAlert(message) {
  store.dispatch({
    type: ALERT_INFO,
    openAlert: true,
    message: message,
    alertSuccessStatus: true,
  });
}

export function callErrorAlert(failureMessage) {
  store.dispatch({
    type: ALERT_INFO,
    openAlert: true,
    alertSuccessStatus: false,
    failureMessage: failureMessage,
  });
}
