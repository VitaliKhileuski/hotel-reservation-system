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
import api from "./../../api/";
import { useDispatch, useSelector } from "react-redux";
import { REGISTER_VALIDATION_SCHEMA } from "../../constants/ValidationSchemas";
import { EMAIL_REGEX } from "../../constants/Regex";
import { FillStorage } from "./TokenData";

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
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Register({ handleClose }) {
  const isLogged = useSelector((state) => state.isLogged);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [emailErrorLabel, setEmailErrorLabel] = useState("");
  const [email, setEmail] = useState("");
  let role = useSelector((state) => state.role);

  const initialValues = {
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    phone: "",
    passwordConfirm: "",
  };
  const onSubmit = (values) => {
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
        if (role !== "Admin") {
          if (!!response && !!response.data) {
            FillStorage(response.data[0], response.data[1],dispatch);
          }
        } else {
          handleClose();
        }
      })
      .catch((error) => {
        if (!!error.response) {
          setEmailErrorLabel(error.response.data.Message);
          console.log(error.response.data.Message);
          console.log(error.response.data);
        }
      });
  };
  function ValidateEmail(email) {
    setEmailErrorLabel("");
    const flag = EMAIL_REGEX.test(email);
    if (!flag) {
      setEmailErrorLabel("invalid email");
    }
    if (email === "") {
      setEmailErrorLabel("email is reqired");
    }
    setEmail(email);
  }
  if (isLogged && role !== "Admin") {
    return <Redirect to="/home"></Redirect>;
  } else
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          {role !== "Admin" ? (
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
              <Form className={classes.form}>
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
                  {role !== "Admin" ? "Sign up" : "Add user"}
                </Button>
                <Grid container justify="flex-end">
                  <Grid item>
                    {role !== "Admin" ? (
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
