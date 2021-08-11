import { ALERT_INFO } from "../storage/actions/actionTypes";
import store from "./../storage/storage";

export default function CallAlert(success, message, failureMessage) {
  store.dispatch({
    type: ALERT_INFO,
    openAlert: true,
    message: message,
    alertSuccessStatus: success,
    failureMessage: failureMessage,
  });
}
