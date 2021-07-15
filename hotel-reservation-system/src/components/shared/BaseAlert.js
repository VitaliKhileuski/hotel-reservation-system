import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function BaseAlert({ open, handleClose, message, success }) {
  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={() => handleClose()}>
      <Alert
        onClose={() => handleClose()}
        severity={success ? "success" : "error"}
      >
        {success ? message : "Something went wrong. Please, try again"}
      </Alert>
    </Snackbar>
  );
}
