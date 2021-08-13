import { React, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import API from "./../../api";
import { USER } from "./../../constants/Roles";
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

export default function OrderFilter({ getValuesFromFilter }) {
  const classes = useStyles();
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [surnames, setSurnames] = useState([]);
  const [surname, setSurname] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [city, setCity] = useState("");
  const token = localStorage.getItem("token");
  const role = useSelector((state) => state.tokenData.role);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    await API.get("/locations/countries")
      .then((response) => response.data)
      .then((data) => {
        if (!!data) setCountries(data);
      })
      .catch((error) => console.log(error));
  };

  const loadCustomersSurnames = async (
    value,
    setNewItems,
    setCurrentLoading
  ) => {
    setSurname(value);
    if (!!value) {
      setCurrentLoading(true);
      await API.get("/users/customersSurnames", {
        params: {
          surname: value,
        },
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          if (!!data) {
            setCurrentLoading(false);
            setNewItems(data);
          }
        })
        .catch((error) => console.log(error));
    } else {
      setNewItems([]);
    }
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
      {role !== USER ? (
        <Grid item>
          <AsyncAutocomplete
            request={loadCustomersSurnames}
            label="find by surname"
          ></AsyncAutocomplete>
        </Grid>
      ) : (
        ""
      )}
      <Grid item>
        <TextField
          label="Find by order number"
          variant="outlined"
          onChange={(event) => setOrderNumber(event.target.value)}
        ></TextField>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          className={classes.button}
          color="primary"
          size="large"
          margin="normal"
          onClick={() =>
            getValuesFromFilter(currentCountry, city, surname, orderNumber)
          }
        >
          Search
        </Button>
      </Grid>
    </Grid>
  );
}
