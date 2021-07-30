import { React, useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import MainReservationDialog from "../Reservation/MainReservationDialog";
import API from "./../../api";
import CallAlert from "../../Notifications/NotificationHandler";
import RoomDetails from "./RoomDetails";

const useStyles = makeStyles((theme) => ({
  button: {
    position: "absolute",
    bottom: 0,
    marginBottom: 50,
  },
}));

export default function RoomPage(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [room, setRoom] = useState(props.history.location.state.room);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState(
    props.location.state.checkInDate
  );
  const [checkOutDate, setCheckOutDate] = useState(
    props.location.state.checkOutDate
  );
  const islogged = useSelector((state) => state.isLogged);
  const userId = useSelector((state) => state.userId);
  const token = localStorage.getItem("token");

  function callReservationDialog() {
    console.log(" call reservation click");
    if (islogged) {
      blockRoom();
    }
    setReservationDialogOpen(true);
  }
  const isRoomBlocked = async () => {
    await API.get("rooms/" + room.id + "/isRoomBlocked", {
      params: { userId: userId },
    })
      .then((response) => response.data)
      .then((data) => {
        if (data) {
          CallAlert(dispatch, false, "", "room is blocked");
        } else {
          callReservationDialog();
        }
      });
  };
  function toOrderPage() {
    console.log("click");
    isRoomBlocked();
  }

  const blockRoom = async () => {
    await API.put("/rooms/" + room.id + "/block", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {})
      .catch((error) => console.log(error.response.data.message));
  };

  function handleCloseReservationDialog() {
    setReservationDialogOpen(false);
  }

  return (
    <>
      <RoomDetails room={room}></RoomDetails>
      <Button
        className={classes.button}
        variant="contained"
        onClick={toOrderPage}
        size="large"
        color="primary"
      >
        Start to order room
      </Button>
      <MainReservationDialog
        handleClose={handleCloseReservationDialog}
        open={reservationDialogOpen}
        room={room}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
      ></MainReservationDialog>
    </>
  );
}
