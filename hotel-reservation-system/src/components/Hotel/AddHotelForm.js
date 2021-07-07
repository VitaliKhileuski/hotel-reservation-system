import { React, useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link, Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import API from "./../../api/";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
  root: {},
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
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function AddHotelForm({
  hotel,
  handleClose,
  callAlert,
  callUpdateAlert,
  updateMainInfo,
}) {
  const classes = useStyles();
  const [showAlert, setShowAlert] = useState(false);
  const token = localStorage.getItem("token");
  const [buildingNumberLabelError, setBuildingNumberLabelError] = useState("");
  const [buildingNumber, setBuildingNumber] = useState(
    hotel === undefined ? "" : hotel.location.buildingNumber
  );

  const initialValues = {
    name: hotel === undefined ? "" : hotel.name,
    country: hotel === undefined ? "" : hotel.location.country,
    city: hotel === undefined ? "" : hotel.location.city,
    street: hotel === undefined ? "" : hotel.location.street,
    buildingNumber: hotel === undefined ? "" : hotel.location.buildingNumber,
  };
  
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("name is required").trim(),
    country: Yup.string().required("country is required").trim(),
    city: Yup.string().required("city is required").trim(),
    street: Yup.string().required("street is required").trim(),
  });
  const onSubmit = async (values) => {
    const request = {
      Name: values.name.trim(),
      Location: {
        Country: values.country.trim(),
        City: values.city.trim(),
        Street: values.street.trim(),
        buildingNumber: buildingNumber.trim(),
      },
    };
    const CreateHotel = async () => {
      await API.post("/hotels/", request, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          handleClose();
          callAlert();
          setShowAlert(true);
        })
        .catch((error) => {
          console.log(error.response.data.Message);
          setBuildingNumberLabelError(error.response.data.Message);
        });
    };
    if (hotel === undefined) {
      await CreateHotel();
    } else {
      await UpdateHotel(request);
    }
  };

  const UpdateHotel = async (request) => {
    await API.put("/hotels/" + hotel.id, request, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        callUpdateAlert();
        updateMainInfo();
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setBuildingNumberLabelError(error.response.data.Message);
      });
  };
  function ValidateLocation(buildingNumber) {
    buildingNumber = buildingNumber.trim();
    setBuildingNumberLabelError("");

    if (buildingNumber === "") {
      setBuildingNumberLabelError("building number is reqired");
    }
    setBuildingNumber(buildingNumber);
  }

  return (
    <>
      <Container component="main" maxWidth="xs" className={classes.root}>
        <CssBaseline />
        <div className={classes.paper}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {(props) => (
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      name="name"
                      label="Name"
                      error={props.errors.name && props.touched.name}
                      helperText={<ErrorMessage name="name" />}
                      id="name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      name="country"
                      label="Country"
                      error={props.errors.country && props.touched.country}
                      helperText={<ErrorMessage name="country" />}
                      id="counrty"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      name="city"
                      label="City"
                      error={props.errors.city && props.touched.city}
                      helperText={<ErrorMessage name="city" />}
                      id="city"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      name="street"
                      required
                      error={props.errors.street && props.touched.street}
                      helperText={<ErrorMessage name="street" />}
                      fullWidth
                      id="street"
                      label="Street"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      id="buildingNumber"
                      label="Building Number"
                      name="buildingNumber"
                      value={buildingNumber}
                      onChange={(e) => ValidateLocation(e.target.value)}
                      error={buildingNumberLabelError !== ""}
                      helperText={buildingNumberLabelError}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Save
                </Button>
                <Grid container justify="flex-end">
                  <Grid item></Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
        <Box mt={5}></Box>
      </Container>
    </>
  );
}
