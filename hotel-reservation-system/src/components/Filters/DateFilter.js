import { React, useState, useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Grid, Typography } from "@material-ui/core";
import API from "../../api";
const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default function DateFilter({roomId, checkInDate, checkOutDate, changeDates }) {
  const classes = useStyles();
  console.log(checkOutDate);
  const [checkIn,setCheckIn] = useState(checkInDate);
  const [checkOut,setCheckOut] = useState(checkOutDate);

  useEffect(() => {
    if (roomId !== undefined) {
      
    }
  }, []);
  const checkPlace = async () => {
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
        console.log(data);
      })
      .catch((error) => console.log(error.response.data.message));
  };

  const handleDateCheckInChange = (date) => {
    setCheckIn(date);
    changeDates(date,checkOut);
    checkPlace();

  };
  const handleDateCheckOutChange = (date) => {
    setCheckOut(date);
    changeDates(checkIn,date);
    checkPlace();
  };

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
          minDate={new Date(checkIn.getTime()+1000*60*60*24)}
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
    </MuiPickersUtilsProvider>
  );
}
