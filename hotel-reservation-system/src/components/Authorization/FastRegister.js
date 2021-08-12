import { React, useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { useSelector } from "react-redux";
import api from "./../../api/";
import { FAST_REGISTER_VALIDATIOM_SCHEMA } from "../../constants/ValidationSchemas";
import callAlert from "../../Notifications/NotificationHandler";
import { EMAIL_REGEX } from "../../constants/Regex";
import { fillStorage, fillLocalStorage } from "./TokenData";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(6),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function FastRegister({ handleClose }) {
  const classes = useStyles();
  const [emailErrorLabel, setEmailErrorLabel] = useState("");
  const [email, setEmail] = useState("");
  const role = useSelector((state) => state.tokenData.role);

  const initialValues = {
    email: "",
    password: "",
    passwordConfirm: "",
  };
  const onSubmit = (values) => {
    if (ValidateEmail(email.trim()) && emailErrorLabel === "") {
      const request = {
        Email: email,
        Password: values.password,
      };
      api
        .post("/account/register", request)
        .then((response) => response.data)
        .then((data) => {
          fillStorage(data[0]);
          fillLocalStorage(data[0], data[1]);
          handleClose();
          callAlert(
            true,
            "you successfully registered, now you can order this room"
          );
        })
        .catch((error) => {
          if (!!error.response) {
            setEmailErrorLabel(error.response.data.Message);
          }
        });
    }
  };
  function ValidateEmail(email) {
    setEmail(email);
    setEmailErrorLabel("");
    if (email === "") {
      setEmailErrorLabel("email is reqired");
      return false;
    }
    const flag = EMAIL_REGEX.test(email);
    if (!flag) {
      setEmailErrorLabel("invalid email");
      return false;
    }
    setEmail(email);
    return true;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Fast Register
        </Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={FAST_REGISTER_VALIDATIOM_SCHEMA}
        >
          {(props) => (
            <Form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    onClick={() => {
                      setEmailErrorLabel("");
                    }}
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={email}
                    onChange={(e) => ValidateEmail(e.target.value)}
                    error={emailErrorLabel !== ""}
                    helperText={emailErrorLabel}
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    error={props.errors.password && props.touched.password}
                    helperText={<ErrorMessage name="password" />}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    variant="outlined"
                    required
                    fullWidth
                    name="passwordConfirm"
                    label="confirm your password"
                    error={
                      props.errors.passwordConfirm &&
                      props.touched.passwordConfirm
                    }
                    helperText={<ErrorMessage name="passwordConfirm" />}
                    type="password"
                    id="passwordConfirm"
                    autoComplete="current-password"
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
                Sign up
              </Button>
              <Grid container justify="flex-end"></Grid>
            </Form>
          )}
        </Formik>
      </div>
      <Box mt={5}></Box>
    </Container>
  );
}
