import { React, useState, useEffect } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default function DateFilter({ checkInDate, checkOutDate }) {
  const classes = useStyles();
  console.log(checkOutDate);
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
          value={checkInDate}
          //onChange={handleDateCheckInChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </Grid>
      <Grid>
        <Typography variant="h6">Check out date</Typography>
        <KeyboardDatePicker
          disableToolbar
          minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
          variant="inline"
          format="MM/dd/yyyy"
          inputVariant="outlined"
          value={checkOutDate}
          //onChange={handleDateCheckOutChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
