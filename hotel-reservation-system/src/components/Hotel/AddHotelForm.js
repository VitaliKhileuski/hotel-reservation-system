import { React, useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { useSelector, useDispatch } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { createTrigger } from "../../helpers/UpdateTableWithCallingAlert";
import API from "./../../api/";
import { HOTEL_VALIDATION_SCHEMA } from "../../constants/ValidationSchemas";
import { NUMBER_REGEX } from "./../../constants/Regex";
import { ADMIN } from "../../constants/Roles";
import { callSuccessAlert } from "../../Notifications/NotificationHandler";

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
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function AddHotelForm({ hotel, handleClose, updateMainInfo }) {
  const classes = useStyles();
  const token = localStorage.getItem("token");
  const [buildingNumberLabelError, setBuildingNumberLabelError] = useState("");
  const [buildingNumber, setBuildingNumber] = useState(
    !!hotel ? hotel.location.buildingNumber : ""
  );
  const [checked, setChecked] = useState(!!hotel ? !!hotel.limitDays : false);
  const [limitDays, setLimitDays] = useState(!!hotel ? hotel.limitDays : "");
  const [limitDaysLabelError, setLimitDaysLabelError] = useState("");
  const [checkInTime, setCheckInTime] = useState(
    !!hotel ? hotel.checkInTime : "14:00"
  );
  const [checkOutTime, setCheckOutTime] = useState(
    !!hotel ? hotel.checkOutTime : "12:00"
  );
  const role = useSelector((state) => state.tokenData.role);
  const initialValues = {
    name: !!hotel ? hotel.name : "",
    country: !!hotel ? hotel.location.country : "",
    city: !!hotel ? hotel.location.city : "",
    street: !!hotel ? hotel.location.street : "",
    buildingNumber: !!hotel ? hotel.location.buildingNumber : "",
  };

  const onSubmit = async (values) => {
    if (
      role === ADMIN ||
      (checked && ValidateLimitDays(limitDays)) ||
      !checked
    ) {
      const request = {
        Name: values.name.trim(),
        Location: {
          Country: values.country.trim(),
          City: values.city.trim(),
          Street: values.street.trim(),
          buildingNumber: buildingNumber.trim(),
        },
        LimitDays: limitDays,
        CheckInTime: checkInTime,
        CheckOutTime: checkOutTime,
      };

      const CreateHotel = async () => {
        await API.post("/hotels/", request, {
          headers: { Authorization: "Bearer " + token },
        })
          .then((response) => response.data)
          .then((data) => {
            handleClose();
            createTrigger();
          })
          .catch((error) => {
            setBuildingNumberLabelError(error.response.data.Message);
          });
      };
      if (!!hotel) {
        await UpdateHotel(request);
      } else {
        await CreateHotel();
      }
    }
  };

  const UpdateHotel = async (request) => {
    await API.put("/hotels/" + hotel.id, request, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        callSuccessAlert("Hotel updated succcessfully");
        updateMainInfo();
      })
      .catch((error) => {
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

  function setCheckedValue(value) {
    setChecked(value);
    if (!value) {
      setLimitDaysLabelError("");
      setLimitDays("");
    }
  }

  function ValidateLimitDays(limitDays) {
    setLimitDays(limitDays);
    setLimitDaysLabelError("");

    if (limitDays === "") {
      setLimitDaysLabelError("limit days is reqired");
      return false;
    }
    const flag = NUMBER_REGEX.test(limitDays);
    if (!flag) {
      setLimitDaysLabelError("you should write a number");
      return false;
    }
    return true;
  }

  return (
    <>
      <Container component="main" maxWidth="xs" className={classes.root}>
        <CssBaseline />
        <div className={classes.paper}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={HOTEL_VALIDATION_SCHEMA}
          >
            {(props) => (
              <Form className={classes.form} noValidate>
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
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => setCheckedValue(e.target.checked)}
                          checked={checked}
                          name="checkedB"
                          color="primary"
                        />
                      }
                      label="User can shift order dates"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      name="limitDays"
                      disabled={!checked}
                      required
                      value={limitDays}
                      onChange={(e) => ValidateLimitDays(e.target.value)}
                      error={limitDaysLabelError !== ""}
                      helperText={limitDaysLabelError}
                      fullWidth
                      id="limitDays"
                      label="amount of days until order can still be updated"
                    />
                  </Grid>
                  <Grid item sm={6}>
                    <TextField
                      id="check-in"
                      label="check-in"
                      type="time"
                      value={checkInTime}
                      defaultValue="14:00"
                      className={classes.textField}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item sm={6}>
                    <TextField
                      id="check-out"
                      label="check-out"
                      type="time"
                      defaultValue="12:00"
                      value={checkOutTime}
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => setCheckOutTime(e.target.value)}
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
