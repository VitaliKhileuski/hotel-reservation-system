import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function BaseAlert({ handleClose, alertInfo }) {
  console.log(alertInfo);
  const errorMessage = !!alertInfo.failureMessage
    ? alertInfo.failureMessage
    : "Something went wrong. Please, try again";
  return (
    <Snackbar
      open={alertInfo.openAlert}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={alertInfo.alertSuccessStatus ? "success" : "error"}
      >
        {alertInfo.alertSuccessStatus ? alertInfo.message : errorMessage}
      </Alert>
    </Snackbar>
  );
}
