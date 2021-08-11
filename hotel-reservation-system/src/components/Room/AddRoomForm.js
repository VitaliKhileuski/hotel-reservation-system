import { React } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Formik, Form, ErrorMessage, Field } from "formik";
import API from "../../api";
import callAlert from "../../Notifications/NotificationHandler";
import { ROOM_VALIDATION_SCHEMA } from "../../constants/ValidationSchemas";

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

export default function AddRoomForm({ hotelId, room, handleClose }) {
  const classes = useStyles();
  const token = localStorage.getItem("token");
  const initialValues = {
    roomNumber: !!room ? room.roomNumber : "",
    bedsNumber: !!room ? room.bedsNumber : "",
    paymentPerDay: !!room ? room.paymentPerDay : "",
  };

  const onSubmit = async (values) => {
    const request = {
      RoomNumber: values.roomNumber,
      BedsNumber: values.bedsNumber,
      PaymentPerDay: values.paymentPerDay,
    };

    const CreateRoom = async () => {
      await API.post("/rooms/" + hotelId, request, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          callAlert(true, "room added successfully");
        })
        .catch((error) => callAlert(false));
    };
    if (!!room) {
      console.log(room);
      await UpdateRoom(request);
      handleClose();
    } else {
      await CreateRoom();
      handleClose();
    }
  };

  const UpdateRoom = async (request) => {
    await API.put("/rooms/" + room.id, request, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        callAlert(true, "room updated successfully");
      })
      .catch((error) => callAlert(false));
  };

  return (
    <>
      <Container component="main" maxWidth="xs" className={classes.root}>
        <CssBaseline />
        <div className={classes.paper}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={ROOM_VALIDATION_SCHEMA}
          >
            {(props) => (
              <Form className={classes.form} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}></Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      name="roomNumber"
                      label="Room number"
                      error={
                        props.errors.roomNumber && props.touched.roomNumber
                      }
                      helperText={<ErrorMessage name="roomNumber" />}
                      id="roomNumber"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      name="bedsNumber"
                      label="beds amount"
                      error={
                        props.errors.bedsNumber && props.touched.bedsNumber
                      }
                      helperText={<ErrorMessage name="bedsNumber" />}
                      id="bedsNumber"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      variant="outlined"
                      required
                      fullWidth
                      name="paymentPerDay"
                      label="Payment per day"
                      error={
                        props.errors.paymentPerDay &&
                        props.touched.paymentPerDay
                      }
                      helperText={<ErrorMessage name="paymentPerDay" />}
                      id="paymentPerDay"
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
