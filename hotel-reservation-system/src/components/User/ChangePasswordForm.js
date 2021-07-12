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
import API from "./../../api/";
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

export default function ChangePasswordForm({ user, handleClose }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordErrorLabel, setPasswordErrorLabel] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const initialValues = {
    newPassword: "",
    passwordConfirm: "",
  };
  let token = localStorage.getItem("token");

  function ValidatePassword(password) {
    setPasswordErrorLabel("");
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])/;
    const flag = passwordRegex.test(password);
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
    setCurrentPassword(password);
  }

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8, "Minimum characters should be 8")
      .notOneOf(
        [currentPassword],
        "new password must be different from the previous one"
      )
      .required("password is required")
      .matches(
        /^(?=.*[0-9])(?=.*[a-zA-Z])/,
        "password should contains numbers and latin letters"
      ),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("password is required"),
  });
  const onSubmit = async (values) => {
    const password = {
      Password: currentPassword,
    };
    const newPassword = {
      Password: values.newPassword,
    };

    let result = await checkPassword(password);
    if (result) {
      await updatePassword(newPassword);
    }
  };

  const updatePassword = async (request) => {
    API.put("/users/" + user.id, request, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        handleClose();
      })
      .catch((error) => {
        if (!!error.response) {
          console.log(error.response.data.Message);
          console.log(error.response.data);
        }
      });
  };

  async function checkPassword(password) {
    let result;
    await API.post("/account/checkPassword", password, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        result = data;
        if (data === false) {
          setPasswordErrorLabel("password is incorrect");
        }
      })
      .catch((error) => console.log(error.response.data.message));
    return result;
  }

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
                    name="currentPassword"
                    label="Current password"
                    value={currentPassword}
                    onChange={(e) => ValidatePassword(e.target.value)}
                    error={passwordErrorLabel !== ""}
                    helperText={passwordErrorLabel}
                    type="password"
                    id="currentPassword"
                    autoComplete="current-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    variant="outlined"
                    required
                    fullWidth
                    name="newPassword"
                    label="New password"
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
