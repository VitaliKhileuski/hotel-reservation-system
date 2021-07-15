import { React, useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "react-router-dom/Link";
import Redirect from "react-router-dom/Redirect";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import API from "./../../api";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../constants/Regex";
import { FillStorage, FillLocalStorage } from "./TokenData";

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const dispatch = useDispatch();
  const classes = useStyles();
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

    const flag = EMAIL_REGEX.test(email);
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
    const flag = PASSWORD_REGEX.test(password);
    if (!flag) {
      setPasswordErrorLabel(
        "password should contains numbers and latin letters"
      );
    }
    if (password === "") {
      setPasswordErrorLabel("password is required");
    }
    if (password.length < 8) {
      setPasswordErrorLabel("minimum characters should be 8");
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
        if (!!response && !!response.data) {
          console.log("asdfasdf");
          FillLocalStorage(response.data[0], response.data[1]);
          FillStorage(response.data[0], dispatch);
        }
      })
      .catch((error) => {
        if (!!error.response) {
          if (error.response.data.Message.includes("exists")) {
            setEmailErrorLabel(error.response.data.Message);
          } else {
            setPasswordErrorLabel(error.response.data.Message);
          }
          console.log(error.response.data);
        }
      });
  };

  if (isLogged) {
    return <Redirect to="/home"></Redirect>;
  }
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
