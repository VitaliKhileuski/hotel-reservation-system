import { React, useState } from "react";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Formik, Form, ErrorMessage, Field } from "formik";
import api from "./../../api/";
import { TOKEN_DATA } from "../../storage/actions/actionTypes.js";
import { UPDATE_USER_VALIDATION_SCHEMA } from "../../constants/ValidationSchemas";
import { EMAIL_REGEX } from "../../constants/Regex";

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

export default function UpdateUserForm({ changeFlag, handleClose, user }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [emailErrorLabel, setEmailErrorLabel] = useState("");
  const [email, setEmail] = useState(user.email);
  const token = localStorage.getItem("token");

  useSelector((state) => console.log(state.tokenData));

  const initialValues = {
    lastName: !!user ? user.surname : "",
    firstName: !!user ? user.name : "",
    email: !!user ? user.email : "",
    phone: !!user ? user.phoneNumber : "",
  };

  const onSubmit = (values) => {
    const request = {
      Email: email,
      Name: values.firstName,
      SurName: values.lastName,
      PhoneNumber: values.phone,
    };
    api
      .put("/users/" + user.id, request, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => response.data)
      .then((data) => {
        localStorage.setItem("token", data.token);
        dispatch({
          type: TOKEN_DATA,
          email: request.Email,
          name: request.Name,
        });
        changeFlag();
        handleClose();
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
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={UPDATE_USER_VALIDATION_SCHEMA}
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
            </Form>
          )}
        </Formik>
      </div>
      <Box mt={5}></Box>
    </Container>
  );
}
