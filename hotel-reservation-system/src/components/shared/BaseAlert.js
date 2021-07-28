import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function BaseAlert({
  open,
  handleClose,
  message,
  success,
  failureMessage,
}) {
  const errorMessage = !!failureMessage
    ? failureMessage
    : "Something went wrong. Please, try again";
  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={success ? "success" : "error"}>
        {success ? message : errorMessage}
      </Alert>
    </Snackbar>
  );
}
