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
import * as Yup from "yup";
import api from "./../../api/";
import { useDispatch, useSelector } from "react-redux";
import {
  IS_LOGGED,
  NAME,
  ROLE,
  USER_ID,
  EMAIL,
} from "../../storage/actions/actionTypes.js";

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

export default function Register({ user }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const initialValues = {
    password: "",
    passwordConfirm: "",
  };
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Minimum characters should be 8")
      .required("password is required")
      .matches(
        /^(?=.*[0-9])(?=.*[a-z])/,
        "password should contains numbers and latin letters"
      ),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });
  const onSubmit = (values) => {
    const request = {
      Password: values.password,
    };
  };

  return (
    <Container component="main" maxWidth="xs">
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
                    name="password"
                    label="new Password"
                    error={
                      props.errors.newPassword && props.touched.newPassword
                    }
                    helperText={<ErrorMessage name="newPassword" />}
                    type="password"
                    id="newPassword"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    variant="outlined"
                    required
                    fullWidth
                    name="passwordConfirm"
                    label="confirm new password"
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
                Change password
              </Button>
            </Form>
          )}
        </Formik>
      </div>
      <Box mt={5}></Box>
    </Container>
  );
}
