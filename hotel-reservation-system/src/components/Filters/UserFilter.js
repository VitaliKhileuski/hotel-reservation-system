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

export default function UsersFilter({ getValuesFromFilter, isHotelAdmins }) {
  const classes = useStyles();
  const [emails, setEmails] = useState([]);
  const [surnames, setSurnames] = useState([]);
  const [email, setEmail] = useState("");
  const [surname, setSurname] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isHotelAdmins) {
      loadHotelAdminsEmails();
      loadHotelAdminsSurnames();
    } else {
      loadEmails();
      loadSurnames();
    }
  }, []);

  const loadEmails = async () => {
    await API.get("/users/emails", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setEmails(data);
      })
      .catch((error) => {});
  };
  const loadSurnames = async () => {
    await API.get("/users/surnames", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setSurnames(data);
      })
      .catch((error) => {});
  };
  const loadHotelAdminsSurnames = async () => {
    await API.get("/users/hotelAdminsSurnames", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setSurnames(data);
      })
      .catch((error) => {});
  };
  const loadHotelAdminsEmails = async () => {
    await API.get("/users/hotelAdminsEmails", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setEmails(data);
      })
      .catch((error) => {});
  };

  return (
    <>
      <Grid item>
        <Autocomplete
          id="emails"
          options={emails}
          onChange={(event, value) => {
            setEmail(value);
          }}
          disabled={!!surname ? true : false}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={
                isHotelAdmins ? "find by hotel admin's email" : "find by email"
              }
              variant="outlined"
            />
          )}
        ></Autocomplete>
      </Grid>
      <Grid item>
        <Autocomplete
          id="surnames"
          options={surnames}
          onChange={(event, value) => {
            setSurname(value);
          }}
          disabled={!!email ? true : false}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={
                isHotelAdmins
                  ? "find by hotel admin's surname"
                  : "find by surname"
              }
              variant="outlined"
            />
          )}
        ></Autocomplete>
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
