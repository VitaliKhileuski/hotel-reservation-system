import { React, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import API from "./../../api";
import AsyncAutocomplete from "../shared/AsyncAutocomplete";

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
  const [roomNumber, setRoomNumber] = useState("");
  const token = localStorage.getItem("token");

  const loadRoomsNumbers = async (
    value,
    setNewItems,
    setCurrentLoading,
    limit
  ) => {
    setRoomNumber(value);
    setCurrentLoading(true);
    await API.get("/hotels/" + hotelId + "/getRoomsNumbers", {
      params: {
        roomNumber: value,
        limit: limit,
      },
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setCurrentLoading(false);
        setNewItems(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Grid container className={classes.grid}>
      <Grid item>
        <AsyncAutocomplete
          request={loadRoomsNumbers}
          label="find by room number"
        ></AsyncAutocomplete>
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
