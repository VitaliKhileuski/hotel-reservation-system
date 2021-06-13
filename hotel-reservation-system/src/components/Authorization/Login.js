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
import { Formik, Form, Field } from "formik";
import API from "./../../api";
import { useDispatch, useSelector } from "react-redux";
import { IS_LOGGED, NAME, ROLE } from "../../storage/actions/actionTypes.js";

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.isLogged);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorLabel, setEmailErrorLabel] = useState("");
  const [passwordErrorLabel, setPasswordErrorLabel] = useState("");

  const initialValues = {
    email: "",
    password: "",
  };
  function ValidateEmail(email) {
    setEmailErrorLabel("");
    const emailRegex =
      /^[\w!#$%&'+-/=?^_`{|}~]+(.[\w!#$%&'+-/=?^_`{|}~]+)*@((([-\w]+.)+[a-zA-Z]{2,4})|(([0-9]{1,3}.){3}[0-9]{1,3}))$/;
    const flag = emailRegex.test(email);
    if (!flag) {
      setEmailErrorLabel("invalid email");
    }
    if (email === "") {
      setEmailErrorLabel("email is required");
    }
    setEmail(email);
  }
  function ValidatePassword(password) {
    setPasswordErrorLabel("");
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])/;
    const flag = passwordRegex.test(password);
    if (!flag) {
      setPasswordErrorLabel(
        "password should contains numbers and latin letters"
      );
    }
    if (password === "") {
      setPasswordErrorLabel("password is required");
    }
    if (password.length < 5) {
      setPasswordErrorLabel("minimum characters should be 5");
    }
    setPassword(password);
  }

  const onSubmit = () => {
    const request = {
      Email: email,
      Password: password,
    };
    API.post("/account/login", request)
      .then((response) => {
        if (response !== undefined && response.data !== undefined) {
          localStorage.setItem("token", response.data[0]);
          localStorage.setItem("refreshToken", response.data[1]);
          const jwt = JSON.parse(atob(response.data[0].split(".")[1]));
          dispatch({ type: IS_LOGGED, isLogged: true });
          dispatch({ type: NAME, name: jwt.firstname });
          dispatch({ type: ROLE, role: jwt.role });

          console.log(jwt.role);
        }
      })
      .catch((error) => {
        if (error.response !== undefined) {
          if (error.response.data.Message.includes("exists")) {
            setEmailErrorLabel(error.response.data.Message);
          } else {
            setPasswordErrorLabel(error.response.data.Message);
          }
          console.log(error.response.data);
        }
      });
  };
  const classes = useStyles();
  if (isLogged) {
    return <Redirect to="/home"></Redirect>;
  } else
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {(props) => (
              <Form className={classes.form}>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  onClick={() => {
                    setEmailErrorLabel("");
                  }}
                  value={email}
                  onChange={(e) => ValidateEmail(e.target.value)}
                  error={emailErrorLabel !== ""}
                  helperText={emailErrorLabel}
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  value={password}
                  onChange={(e) => ValidatePassword(e.target.value)}
                  error={passwordErrorLabel !== ""}
                  helperText={passwordErrorLabel}
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link to="/forgotPassword" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link to="/register" variant="body2">
                      Don't have an account? Sign Up
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
        <Box mt={8}></Box>
      </Container>
    );
}
