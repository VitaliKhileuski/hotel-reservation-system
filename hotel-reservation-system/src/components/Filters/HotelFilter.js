import { React, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core";
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

export default function HotelFilter({ getValuesFromFilter }) {
  const classes = useStyles();
  const [hotelName, setHotelName] = useState("");

  useEffect(() => {
    getValuesFromFilter(hotelName);
  }, [hotelName]);

  const loadHotelNames = async (value, setNewItems, setCurrentLoading) => {
    setHotelName(value);
    setCurrentLoading(true);
    await API.get("/hotels/hotelNames", {
      params: {
        hotelName: value,
      },
    })
      .then((response) => response.data)
      .then((data) => {
        if (!!data) {
          setCurrentLoading(false);
          setNewItems(data);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Grid item>
      <AsyncAutocomplete
        request={loadHotelNames}
        label="find by hotel name"
      ></AsyncAutocomplete>
    </Grid>
  );
}
