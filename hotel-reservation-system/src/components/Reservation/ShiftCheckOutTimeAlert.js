import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function ShiftCheckOutTimeAlert({
  open,
  handleClose,
  checkOutTime,
  shiftCheckOutDate,
}) {
  {
    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Room is occupied</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You can't leave from this hotel later then {checkOutTime}. But we
              can offer you to add 1 day to your check-out day and recalculate
              final price.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Choose another time
            </Button>
            <Button onClick={shiftCheckOutDate} color="primary" autoFocus>
              Add 1 day yo your check-out date
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
