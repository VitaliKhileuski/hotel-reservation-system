import { React, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import API from "../../api";
import RoomIsOccupiedAlert from "../Reservation/RoomIsOccupiedAlert";
import { DATES } from "./../../storage/actions/actionTypes";

export default function DateFilter({
  roomId,
  checkInDate,
  checkOutDate,
  changeDates,
  isValidInfo,
}) {
  const dispatch = useDispatch();
  const [checkIn, setCheckIn] = useState(checkInDate);
  const [checkOut, setCheckOut] = useState(checkOutDate);
  const [roomIsOccupiedAlertOpen, setRoomIsOccupiedAlertOpen] = useState(false);

  const checkPlace = async (checkIn, checkOut) => {
    await API.get("/rooms/" + roomId + "/isEmpty", {
      params: {
        checkInDate: checkIn.toJSON(),
        checkOutDate: checkOut.toJSON(),
      },
    })
      .then((response) => response.data)
      .then((data) => {
        if (data) {
          isValidInfo(true);
        } else {
          setRoomIsOccupiedAlertOpen(true);
          isValidInfo(false);
        }
      })
      .catch((error) => console.log(error.response.data.message));
  };

  const handleDateCheckInChange = (date) => {
    dispatch({ type: DATES, checkInDate: date });
    setCheckIn(date);
    changeDates(date, checkOut);
    if (date < checkOut) {
      isValidInfo(true);
      if (!!roomId) {
        checkPlace(date, checkOut);
      }
    } else {
      isValidInfo(false);
    }
  };
  const handleDateCheckOutChange = (date) => {
    dispatch({ type: DATES, checkOutDate: date });
    setCheckOut(date);
    changeDates(checkIn, date);
    if (date > checkIn) {
      isValidInfo(true);
      if (!!roomId) {
        checkPlace(checkIn, date);
      }
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
          minDate={moment(checkIn).add(1, "days")._d}
          variant="inline"
          format="MM/dd/yyyy"
          inputVariant="outlined"
          value={checkOut}
          onChange={handleDateCheckOutChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </Grid>
      <RoomIsOccupiedAlert
        open={roomIsOccupiedAlertOpen}
        handleClose={handleCloseAlert}
      ></RoomIsOccupiedAlert>
    </MuiPickersUtilsProvider>
  );
}
