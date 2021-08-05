import { React, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import { useSelector, useDispatch } from "react-redux";
import { EMAIL } from "./../../storage/actions/actionTypes";
import API from "./../../api";
import CallAlert from "../../Notifications/NotificationHandler";
import BaseDialog from "../shared/BaseDialog";
import Hours from "./Hours";
import { FillStorage, FillLocalStorage } from "../Authorization/TokenData";
import { EMAIL_REGEX } from "../../constants/Regex";
import { HOME_PATH } from "../../constants/RoutingPaths";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 25,
    width: "95%",
    height: "70%",
  },
  paperGrid: {
    marginTop: "5%",
  },
  paper: {
    height: "85%",
    marginTop: theme.spacing(3),
  },
}));

export default function OrderConfirmation({
  selectedServices,
  room,
  checkInDate,
  checkOutDate,
  isOrderEdit,
}) {
  console.log(selectedServices);
  console.log(checkInDate);
  console.log(checkOutDate);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const history = useHistory();
  const [email, setEmail] = useState();

  const [emailErrorLabel, setEmailErrorLabel] = useState("");
  const classes = useStyles();
  const isLogged = useSelector((state) => state.isLogged);
  let userEmail = useSelector((state) => state.email);
  const token = localStorage.getItem("token");

  const [messageDialogOpen, SetMessageDialogOpen] = useState(false);
  const messageForGuest = (
    <Typography style={{ margin: 50 }}>
      Order successfully created.we have registered you so that you can track
      your order. Your email and password will be send to your email. You can
      change your profile details in the my profile tab
    </Typography>
  );
  const messageForUser = (
    <Typography style={{ margin: 50 }}>
      Order successfully created.You can track it in my Orders tab.
    </Typography>
  );

  function handleCloseMessageDialog() {
    if (!!email) {
      dispatch({ type: EMAIL, email: email });
    }
    SetMessageDialogOpen(false);
    history.push({
      pathname: HOME_PATH,
    });
  }

  function validateEmail(email) {
    const emailWithoutSpaces = email.trim();
    setEmailErrorLabel("");
    setEmail(emailWithoutSpaces);
    const flag = EMAIL_REGEX.test(emailWithoutSpaces);
    if (!flag) {
      setEmailErrorLabel("invalid email");
    }
    if (emailWithoutSpaces === "") {
      setEmailErrorLabel("email is required");
    }
  }

  const createOrderRequest = async (request) => {
    await API.post("/orders/" + room.id + "/order", request)
      .then((response) => response.data)
      .then((data) => {
        SetMessageDialogOpen(true);
      })
      .catch((error) => {
        CallAlert(dispatch, false, "", "room already booked on this dates");
      });
  };

  const createUser = async (requestForOrder) => {
    console.log("create user");
    let request = {
      Email: email,
    };
    await API.post("/account/register", request)
      .then((response) => {
        if (!!response && !!response.data) {
          FillLocalStorage(response.data[0], response.data[1]);
          FillStorage(response.data[0], dispatch);
          createOrderRequest(requestForOrder);
        }
      })
      .catch((error) => {
        if (!!error.response) {
          setEmailErrorLabel(error.response.data.Message);
          console.log(error.response.data.Message);
        }
      });
  };

  async function сreateOrder() {
    if (checked && emailErrorLabel === "") {
      let requestForOrder = {
        StartDate: checkInDate,
        EndDate: checkOutDate,
        ServiceQuantities: selectedServices,
        UserEmail: userEmail,
      };
      if (userEmail === "" || userEmail === undefined) {
        userEmail = email;
        requestForOrder.UserEmail = email;
        await createUser(requestForOrder);
      } else {
        createOrderRequest(requestForOrder);
      }
    }
  }

  return (
    <>
      <Paper className={classes.paper}>
        <Grid
          className={classes.paperGrid}
          spacing={5}
          container
          direction="column"
          justify="space-around"
          alignItems="center"
        >
          <Grid item>
            <Hours></Hours>
          </Grid>
          {isOrderEdit ? (
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Typography variant="h6">Select a new check in date</Typography>
                <KeyboardDatePicker
                  disableToolbar
                  disablePast
                  variant="inline"
                  inputVariant="outlined"
                  format="MM/dd/yyyy"
                  //value={checkIn}
                  onChange={() => console.log("change")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          ) : (
            ""
          )}
          <Grid item xs={12}>
            <Typography>
              check in date: {checkInDate.toLocaleDateString("en-GB")}
            </Typography>
            <Typography>
              check in date: {checkOutDate.toLocaleDateString("en-GB")}
            </Typography>
          </Grid>
          {isLogged === false ? (
            <Grid item xs={12}>
              <TextField
                label="write your email"
                required
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
                error={emailErrorLabel !== ""}
                helperText={emailErrorLabel}
                autoComplete="email"
              ></TextField>
            </Grid>
          ) : (
            ""
          )}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => setChecked(e.target.checked)}
                  checked={checked}
                  name="checkedB"
                  color="primary"
                />
              }
              label="I agree with the information I entered"
            />
          </Grid>
          <Button
            variant="contained"
            onClick={сreateOrder}
            color="primary"
            disabled={!checked || emailErrorLabel !== "" || email === ""}
          >
            Order
          </Button>
        </Grid>
      </Paper>
      <BaseDialog
        open={messageDialogOpen}
        handleClose={handleCloseMessageDialog}
        form={!!token ? messageForUser : messageForGuest}
      ></BaseDialog>
    </>
  );
}
