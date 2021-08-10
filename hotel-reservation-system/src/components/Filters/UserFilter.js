import { React, useState } from "react";
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

export default function UsersFilter({ getValuesFromFilter, isHotelAdmins }) {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [surname, setSurname] = useState("");
  const token = localStorage.getItem("token");

  const loadEmails = async (value, setNewItems, setCurrentLoading, limit) => {
    setEmail(value);
    console.log(email);
    setCurrentLoading(true);
    await API.get("/users/emails", {
      params: {
        email: value,
        limit: limit,
      },
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setCurrentLoading(false);
        setNewItems(data);
      })
      .catch((error) => {});
  };
  const loadSurnames = async (value, setNewItems, setCurrentLoading, limit) => {
    setSurname(value);
    setCurrentLoading(true);
    await API.get("/users/surnames", {
      params: {
        surname: value,
        limit: limit,
      },
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setCurrentLoading(false);
        setNewItems(data);
      })
      .catch((error) => {});
  };

  const loadHotelAdminsSurnames = async (
    value,
    setNewItems,
    setCurrentLoading,
    limit
  ) => {
    setCurrentLoading(true);
    setSurname(value);
    await API.get("/users/hotelAdminsSurnames", {
      params: {
        surname: value,
        limit: limit,
      },
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setCurrentLoading(false);
        setNewItems(data);
      })
      .catch((error) => {});
  };
  const loadHotelAdminsEmails = async (
    value,
    setNewItems,
    setCurrentLoading,
    limit
  ) => {
    setCurrentLoading(true);
    setEmail(value);
    await API.get("/users/hotelAdminsEmails", {
      params: {
        email: value,
        limit: limit,
      },
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setCurrentLoading(false);
        setNewItems(data);
      })
      .catch((error) => {});
  };

  return (
    <>
      <Grid item>
        <AsyncAutocomplete
          request={isHotelAdmins ? loadHotelAdminsEmails : loadEmails}
          label={
            isHotelAdmins ? "find by hotel admin's email" : "find by email"
          }
        ></AsyncAutocomplete>
      </Grid>
      <Grid item>
        <AsyncAutocomplete
          request={isHotelAdmins ? loadHotelAdminsSurnames : loadSurnames}
          label={
            isHotelAdmins ? "find by hotel admin's surname" : "find by surname"
          }
        ></AsyncAutocomplete>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          onClick={() => getValuesFromFilter(email, surname)}
          className={classes.button}
          color="primary"
          size="large"
          margin="normal"
        >
          Search
        </Button>
      </Grid>
    </>
  );
}
