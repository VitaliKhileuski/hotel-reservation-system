import { ALERT_INFO } from "../storage/actions/actionTypes";

export default function CallAlert(dispatch, success, message, failureMessage) {
  dispatch({
    type: ALERT_INFO,
    openAlert: true,
    message: message,
    alertSuccessStatus: success,
    failureMessage: failureMessage,
  });
}
