import { React, useState, useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Grid, Typography } from "@material-ui/core";
import API from "../../api";
import RoomIsOccupiedAlert from "../Reservation/RoomIsOccupiedAlert";

export default function DateFilter({
  roomId,
  checkInDate,
  checkOutDate,
  changeDates,
  isValidInfo,
}) {
  console.log(checkOutDate);
  const [checkIn, setCheckIn] = useState(checkInDate);
  const [checkOut, setCheckOut] = useState(checkOutDate);
  const [roomIsOccupiedAlertOpen, setRoomIsOccupiedAlertOpen] = useState(false);

  const checkPlace = async (checkIn, checkOut) => {
    await API.get(
      "/rooms/" +
        roomId +
        "/isEmpty" +
        "?checkInDate=" +
        checkIn.toJSON() +
        "&checkOutDate=" +
        checkOut.toJSON()
    )
      .then((response) => response.data)
      .then((data) => {
        if (data === false) {
          setRoomIsOccupiedAlertOpen(true);
          isValidInfo(false);
        } else {
          isValidInfo(true);
        }
      })
      .catch((error) => console.log(error.response.data.message));
  };

  const handleDateCheckInChange = (date) => {
    setCheckIn(date);
    changeDates(date, checkOut);
    if (date < checkOut) {
      checkPlace(date, checkOut);
    } else {
      isValidInfo(false);
    }
  };
  const handleDateCheckOutChange = (date) => {
    setCheckOut(date);
    changeDates(checkIn, date);
    if (date > checkIn) {
      checkPlace(checkIn, date);
    } else {
      isValidInfo(false);
    }
  };
  function handleCloseAlert() {
    setRoomIsOccupiedAlertOpen(false);
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid>
        <Typography variant="h6">Check in Date</Typography>
        <KeyboardDatePicker
          disableToolbar
          disablePast
          variant="inline"
          inputVariant="outlined"
          format="MM/dd/yyyy"
          value={checkIn}
          onChange={handleDateCheckInChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </Grid>
      <Grid>
        <Typography variant="h6">Check out date</Typography>
        <KeyboardDatePicker
          disableToolbar
          minDate={new Date(checkIn.getTime() + 1000 * 60 * 60 * 24)}
          variant="inline"
          format="MM/dd/yyyy"
          inputVariant="outlined"
          value={checkOut}
          onChange={handleDateCheckOutChange}
          invalidLabel="adsfsdf"
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </Grid>
      <RoomIsOccupiedAlert
        open={roomIsOccupiedAlertOpen}
        handleClose={() => handleCloseAlert()}
      ></RoomIsOccupiedAlert>
    </MuiPickersUtilsProvider>
  );
}
