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

export default function HotelFilter({ getValuesFromFilter }) {
  const classes = useStyles();
  const [hotelNames, setHotelNames] = useState([]);
  const [hotelName, setHotelName] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadHotelNames();
    getValuesFromFilter(hotelName);
  }, [hotelName]);

  const loadHotelNames = async () => {
    await API.get("/hotels/hotelNames")
      .then((response) => response.data)
      .then((data) => {
        if (!!data) setHotelNames(data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Grid item>
      <Autocomplete
        id="hotelNames"
        options={hotelNames}
        onChange={(event, value) => {
          setHotelName(value);
        }}
        getOptionLabel={(option) => option}
        style={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="find by hotel name"
            variant="outlined"
          />
        )}
      ></Autocomplete>
    </Grid>
  );
}
