import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

export default function Hours({
  checkInTime,
  checkOutTime,
  getCheckInTime,
  getCheckOutTime,
}) {
  const hotelCheckInTime = convertTimeSpan(checkInTime);
  const hotelCheckOutTime = checkOutTime;
  const [checkInHours, setCheckInHours] = useState(
    Object.assign(hotelCheckInTime)
  );
  const [checkOutHours, setCheckOutHours] = useState(hotelCheckOutTime);
  const [isCheckInTimeIncorrect, setIsCheckInTimeIncorrect] = useState(false);

  function ValidateCheckInTime(value) {
    console.log("value", value);
    console.log("hotelcheck", hotelCheckInTime);
    setIsCheckInTimeIncorrect(false);
    if (value < hotelCheckInTime) {
      setIsCheckInTimeIncorrect(true);
    }
    setCheckInHours(value);
  }
  function convertTimeSpan(value) {
    let timeParts = value.split(":");
    return timeParts[0] + ":" + timeParts[1];
  }
  return (
    <Grid container spacing={6}>
      <Grid item sm={6}>
        <TextField
          id="time"
          label="check-in"
          type="time"
          value={checkInHours}
          defaultValue="14:00"
          //className={classes.textField}
          onChange={(e) => {
            ValidateCheckInTime(e.target.value);
            getCheckInTime(e.target.value);
          }}
          error={isCheckInTimeIncorrect}
          helperText={
            isCheckInTimeIncorrect
              ? `arrival hour should be later then ${hotelCheckInTime}`
              : ""
          }
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item sm={6}>
        <TextField
          id="time"
          label="check-out"
          type="time"
          defaultValue="12:00"
          value={checkOutHours}
          //className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {
            setCheckOutHours(e.target.value);
            getCheckOutTime(e.target.value);
          }}
        />
      </Grid>
    </Grid>
  );
}
