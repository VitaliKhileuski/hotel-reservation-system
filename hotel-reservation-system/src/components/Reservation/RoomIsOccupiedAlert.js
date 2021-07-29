import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useHistory } from "react-router";
import {HOME_PATH} from "./../../constants/RoutingPaths"

export default function RoomIsOccupiedAlert({ open, handleClose }) {
  {
    const history = useHistory();
    function searchOtherHotelsWithUserDates() {
      history.push({
        pathname: HOME_PATH,
        state: {},
      });
    }

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
              Room on this date is already occupied.Please, choose another date
              or we can search for other hotels for your new date.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Choose another date
            </Button>
            <Button
              onClick={searchOtherHotelsWithUserDates}
              color="primary"
              autoFocus
            >
              Search for other hotels
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
