import { React, useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import API from "./../../api/";

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

export default function AddServiceForm({
  hotelId,
  service,
  handleClose,
  callAddAlert,
  callUpdateAlert,
}) {
  const classes = useStyles();
  const [showAlert, setShowAlert] = useState(false);
  const [serviceName, setServiceName] = useState(!!service ? service.name : "");
  const token = localStorage.getItem("token");
  const [serviceNameErrorLabel, setServiceNameErrorLabel] = useState("");

  const initialValues = {
    name: !!service ? service.name : "",
    payment: !!service ? service.payment : "",
  };
  const validationSchema = Yup.object().shape({
    payment: Yup.number("payment must be a number").required(
      "payment is required"
    ),
  });

  const onSubmit = async (values) => {
    const request = {
      Name: serviceName,
      Payment: values.payment,
    };

    const CreateService = async () => {
      await API.post("/services/" + hotelId, request, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          handleClose();
          callAddAlert();
          setShowAlert(true);
        })
        .catch((error) => {
          console.log(error.response.data.message);
          setServiceNameErrorLabel(error.response.data.Message);
        });
    };
    if (!!service) {
      await UpdateService(request);
    } else {
      await CreateService();
    }
  };

  const UpdateService = async (request) => {
    await API.put("/services/" + service.id, request, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        handleClose();
        callUpdateAlert();
      })
      .catch((error) => {
        console.log(error.response.data.Message);
        setServiceNameErrorLabel(error.response.data.Message);
      });
  };

  function ValidateServiceName(serviceName) {
    setServiceNameErrorLabel("");

    if (serviceName === "") {
      setServiceNameErrorLabel("name is reqired");
    }
    setServiceName(serviceName);
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
                  <Grid item xs={12}></Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      name="name"
                      label="Name"
                      value={serviceName}
                      onChange={(e) => ValidateServiceName(e.target.value)}
                      error={serviceNameErrorLabel !== ""}
                      helperText={serviceNameErrorLabel}
                      id="name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      name="payment"
                      label="Payment"
                      error={props.errors.payment && props.touched.payment}
                      helperText={<ErrorMessage name="payment" />}
                      id="payment"
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
