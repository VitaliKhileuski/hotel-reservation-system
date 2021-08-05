import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

export default function Hours() {
  const [checkInTime, setCheckInTime] = useState();
  const [checkOutTime, setCheckOutTime] = useState();

  return (
    <Grid container spacing={6}>
      <Grid item sm={6}>
        <TextField
          id="time"
          label="check-in"
          type="time"
          value={checkInTime}
          defaultValue="14:00"
          //className={classes.textField}
          onChange={(e) => setCheckInTime(e.target.value)}
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
          value={checkOutTime}
          //className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setCheckOutTime(e.target.value)}
        />
      </Grid>
    </Grid>
  );
}
