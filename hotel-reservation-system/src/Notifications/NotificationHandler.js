import { ALERT_INFO } from "../storage/actions/actionTypes";
import store from "./../storage/storage";

export default function callAlert(success, message, failureMessage) {
  console.log("success", success);
  console.log("message", message);
  console.log("failureMessage", failureMessage);
  store.dispatch({
    type: ALERT_INFO,
    openAlert: true,
    message: message,
    alertSuccessStatus: success,
    failureMessage: failureMessage,
  });
}
