import { React, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import API from "./../../api";

const useStyles = makeStyles((theme) => ({
  grid: {
    margin: 15,
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  button: {
    margin: 10,
  },
}));

export default function RoomFilter({ getValuesFromFilter, hotelId }) {
  const classes = useStyles();
  const [roomsNumbers, setRoomsNumbers] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadRoomsNumbers();
  }, []);

  const loadRoomsNumbers = async () => {
    await API.get("/hotels/" + hotelId + "/getRoomsNumbers", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setRoomsNumbers(data);
      })
      .catch((error) => {});
  };

  return (
    <Grid container className={classes.grid}>
      <Grid item>
        <Autocomplete
          id="roomsNumbers"
          options={roomsNumbers}
          onChange={(event, value) => {
            setRoomNumber(value);
          }}
          getOptionLabel={(option) => option}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="find by room number"
              variant="outlined"
            />
          )}
        ></Autocomplete>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          onClick={() => getValuesFromFilter(roomNumber)}
          className={classes.button}
          color="primary"
          size="large"
          margin="normal"
        >
          Search
        </Button>
      </Grid>
    </Grid>
  );
}
