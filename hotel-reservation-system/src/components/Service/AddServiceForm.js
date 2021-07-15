import { React, useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Formik, Form, ErrorMessage, Field } from "formik";
import API from "../../api";
import { SERVICE_VALIDATION_SCHEMA } from "../../constants/ValidationSchemas";

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

export default function AddServiceForm({
  hotelId,
  service,
  handleClose,
  callAlert
}) {
  const classes = useStyles();
  const [serviceName, setServiceName] = useState(!!service ? service.name : "");
  const token = localStorage.getItem("token");
  const [serviceNameErrorLabel, setServiceNameErrorLabel] = useState("");

  const initialValues = {
    name: !!service ? service.name : "",
    payment: !!service ? service.payment : "",
  };

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
          callAlert("service added successfully",true);
        })
        .catch((error) => {
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
        callAlert("service updated successfully",true);
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
            validationSchema={SERVICE_VALIDATION_SCHEMA}
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