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

export default function OrderFilter({ getValuesFromFilter }) {
  const classes = useStyles();
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [surnames, setSurnames] = useState([]);
  const [surname, setSurname] = useState("");
  const [city, setCity] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCountries();
    loadCustomersSurnames();
  }, []);

  const loadCountries = async () => {
    await API.get("/locations/countries")
      .then((response) => response.data)
      .then((data) => {
        if (!!data) setCountries(data);
      })
      .catch((error) => console.log(error));
  };

  const loadCustomersSurnames = async () => {
    await API.get("/users/customersSurnames", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        if (!!data) setSurnames(data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const loadCities = async () => {
      await API.get("/locations/cities/" + currentCountry)
        .then((response) => response.data)
        .then((data) => {
          if (!!data) setCities(data);
        })
        .catch((error) => console.log(error));
    };
    setCities([]);
    if (currentCountry !== "") {
      loadCities();
    }
    setCity("");
  }, [currentCountry]);

  return (
    <Grid container className={classes.grid}>
      <Grid item>
        <Autocomplete
          id="countries"
          options={countries}
          onChange={(event, value) => {
            setCurrentCountry(value);
          }}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="choose your country"
              variant="outlined"
            />
          )}
        />
      </Grid>
      <Grid item>
        <Autocomplete
          id="cities"
          options={cities}
          getOptionLabel={(option) => option}
          onChange={(event, value) => setCity(value)}
          disabled={!currentCountry}
          style={{ width: 300 }}
          value={city}
          renderInput={(params) => (
            <TextField
              {...params}
              label="choose your city"
              variant="outlined"
            />
          )}
        />
      </Grid>
      <Grid item>
        <Autocomplete
          id="surnames"
          options={surnames}
          onChange={(event, value) => {
            setSurname(value);
          }}
          getOptionLabel={(option) => option}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="find by surname" variant="outlined" />
          )}
        ></Autocomplete>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          className={classes.button}
          color="primary"
          size="large"
          margin="normal"
          onClick={() => getValuesFromFilter(currentCountry, city, surname)}
        >
          Search
        </Button>
      </Grid>
    </Grid>
  );
}
