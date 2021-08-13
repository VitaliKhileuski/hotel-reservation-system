import { DELETE, CREATE } from "../constants/actions";
import { UPDATE_TABLE_INFO } from "../storage/actions/actionTypes";
import { callSuccessAlert } from "../Notifications/NotificationHandler";
import store from "./../storage/storage";

export function updateTableWithCallingAlert(
  updateTableInfo,
  createMessage,
  deleteMessage
) {
  if (updateTableInfo.updateTable && !!updateTableInfo.action) {
    if (updateTableInfo.action === DELETE) {
      callSuccessAlert(deleteMessage);
    } else if (updateTableInfo.action === CREATE) {
      callSuccessAlert(createMessage);
    }
    store.dispatch({ type: UPDATE_TABLE_INFO, updateTable: false });
  }
}

export function deleteTrigger() {
  store.dispatch({
    type: UPDATE_TABLE_INFO,
    updateTable: true,
    action: DELETE,
  });
}

export function createTrigger() {
  store.dispatch({
    type: UPDATE_TABLE_INFO,
    updateTable: true,
    action: CREATE,
  });
}

export function updateTrigger() {
  store.dispatch({ type: UPDATE_TABLE_INFO, updateTable: true, action: "" });
}
