import { React, useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link, Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import api from "./../../api/";
import { REGISTER_VALIDATION_SCHEMA } from "../../constants/ValidationSchemas";
import callAlert from "../../Notifications/NotificationHandler";
import { ADMIN } from "../../constants/Roles";
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

export default function Register({ handleClose }) {
  const isLogged = useSelector((state) => state.tokenData.isLogged);
  const classes = useStyles();
  const [emailErrorLabel, setEmailErrorLabel] = useState("");
  const [email, setEmail] = useState("");
  const role = useSelector((state) => state.tokenData.role);

  const initialValues = {
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    phone: "",
    passwordConfirm: "",
  };
  const onSubmit = (values) => {
    ValidateEmail(email);
    if (ValidateEmail(email.trim()) && emailErrorLabel === "") {
      const request = {
        Email: email,
        Name: values.firstName,
        SurName: values.lastName,
        PhoneNumber: values.phone,
        Password: values.password,
      };
      api
        .post("/account/register", request)
        .then((response) => {
          if (role !== ADMIN) {
            if (!!response && !!response.data) {
              fillStorage(response.data[0]);
              fillLocalStorage(response.data[0], response.data[1]);
            }
          } else {
            handleClose();
            callAlert(true, "user was added successfully");
          }
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
    return true;
  }

  if (isLogged && role !== ADMIN) {
    return <Redirect to="/home"></Redirect>;
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {role !== ADMIN ? (
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
        ) : (
          ""
        )}
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={REGISTER_VALIDATION_SCHEMA}
        >
          {(props) => (
            <Form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    variant="outlined"
                    autoComplete="lname"
                    name="firstName"
                    required
                    error={props.errors.firstName && props.touched.firstName}
                    helperText={<ErrorMessage name="firstName" />}
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    novalidate
                    as={TextField}
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    error={props.errors.lastName && props.touched.lastName}
                    helperText={<ErrorMessage name="lastName" />}
                    autoComplete="lname"
                  />
                </Grid>
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
                    fullWidth
                    required
                    label="Phone Number"
                    variant="outlined"
                    name="phone"
                    error={props.errors.phone && props.touched.phone}
                    helperText={<ErrorMessage name="phone" />}
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
                {role !== ADMIN ? "Sign up" : "Add user"}
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  {role !== ADMIN ? (
                    <Link to="/login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
      <Box mt={5}></Box>
    </Container>
  );
}
