import {
  OPEN_ALERT,
  MESSAGE,
  ALERT_SUCCESS_STATUS,
  FAILURE_MESSAGE,
} from "../storage/actions/actionTypes";

export default function CallAlert(dispatch, success, message, failureMessage) {
  dispatch({ type: OPEN_ALERT, openAlert: true });
  dispatch({ type: MESSAGE, message: message });
  dispatch({ type: ALERT_SUCCESS_STATUS, alertSuccessStatus: success });
  dispatch({ type: FAILURE_MESSAGE, failureMessage: failureMessage });
}
