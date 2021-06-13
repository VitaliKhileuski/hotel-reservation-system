import { React, useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import API from "./../../api/";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: 400, // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function HotelAdminDialog({
  hotelId,
  message,
  handleClose,
  callAssignAdminAlert,
  callDeleteAdminAlert,
  assingFlag,
}) {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadUsers = async () => {
      await API.get("/users/" + hotelId + "/getPotentialHotelAdmins", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
          if (data !== undefined) setUsers(data);
        })
        .catch((error) => console.log(error));
    };

    const loadAdmins = async () => {
      await API.get("hotels/" + hotelId + "/getHotelAdmins", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
          if (data !== undefined) setUsers(data);
        })
        .catch((error) => console.log(error));
    };

    if (assingFlag === true) {
      loadUsers();
    } else {
      loadAdmins();
    }
  }, []);

  const UpdateHotelAdmin = async () => {
    await API.put("hotels/" + hotelId + "/" + admin.id + "/setHotelAdmin", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {})
      .catch((error) => console.log(error.response.data.message));
  };

  const DeleteHotelAdmin = async () => {
    await API.put("hotels/" + hotelId + "/" + admin.id + "/deleteHotelAdmin", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {})
      .catch((error) => console.log(error.response.data.message));
  };

  function updateHotelAdmin() {
    UpdateHotelAdmin();
    handleClose();
    callAssignAdminAlert();
  }

  function deleteHotelAdmin() {
    DeleteHotelAdmin();
    handleClose();
    callDeleteAdminAlert();
  }
  function actionWithAdmin() {
    if (assingFlag === true) {
      updateHotelAdmin();
    } else {
      deleteHotelAdmin();
    }
  }

  return (
    <>
      <Container component="main" maxWidth="xs" className={classes.root}>
        <CssBaseline />
        <div className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                className={classes.form}
                id="hotelAdmin"
                options={users}
                onChange={(event, value) => setAdmin(value)}
                getOptionLabel={(option) =>
                  `${option.name} ${option.surname}(${option.email})`
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="choose hotel admin"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => actionWithAdmin()}
          >
            {message}
          </Button>
          <Grid container justify="flex-end">
            <Grid item></Grid>
          </Grid>
        </div>
        <Box mt={5}></Box>
      </Container>
    </>
  );
}
