import { React, useState, useEffect } from "react";
import moment from "moment";
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
import { FillStorage, FillLocalStorage } from "../Authorization/TokenData";
import { EMAIL_REGEX } from "../../constants/Regex";
import { HOME_PATH } from "../../constants/RoutingPaths";
import ShiftCheckOutTimeAlert from "./ShiftCheckOutTimeAlert";

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
  shiftCheckOutDate,
  isEditOrder,
  orderCheckInTime,
  orderCheckOutTime,
  orderId,
  handleCloseUpdateOrderDialog,
  limitDays,
  isCheckOutTimeShifted,
}) {
  useEffect(() => {
    getLimitHours();
  }, []);

  console.log(limitDays);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const history = useHistory();
  const [email, setEmail] = useState();
  const [emailErrorLabel, setEmailErrorLabel] = useState("");
  const classes = useStyles();
  const isLogged = useSelector((state) => state.isLogged);
  let userEmail = useSelector((state) => state.email);
  const token = localStorage.getItem("token");
  const [hotelCheckInTime, setHotelCheckInTime] = useState();
  const [hotelCheckOutTime, setHotelCheckOutTime] = useState();
  const [currentCheckInDate, setCurrentCheckInDate] = useState(checkInDate);
  const [currentCheckOutDate, setCurrentCheckOutDate] = useState(checkOutDate);
  const [requestCheckInDate, setRequestCheckInDate] = useState(checkInDate);
  const [requestCheckOutDate, setRequestCheckOutDate] = useState(checkOutDate);
  const [currentCheckInTime, setCurrentCheckInTime] = useState(
    isEditOrder ? orderCheckInTime : ""
  );
  const [currentCheckOutTime, setCurrentCheckOutTime] = useState(
    isEditOrder ? orderCheckOutTime : ""
  );
  const [isShifted, setIsShifted] = useState(
    !!isCheckOutTimeShifted ? isCheckOutTimeShifted : false
  );
  const [checkInTime, setCheckInTime] = useState(
    isEditOrder ? orderCheckInTime : ""
  );
  const [checkOutTime, setCheckOutTime] = useState(
    isEditOrder ? orderCheckOutTime : ""
  );
  const [isCheckInTimeIncorrect, setIsCheckInTimeIncorrect] = useState(false);
  const [isCheckOutTimeIncorrect, setIsCheckOutTimeIncorrect] = useState(false);
  const [shiftAlertOpen, setShiftAlertOpen] = useState(false);

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

  function ValidateCheckInTime(value) {
    setIsCheckInTimeIncorrect(false);
    if (value < convertTimeSpan(hotelCheckInTime)) {
      setIsCheckInTimeIncorrect(true);
    }
    setCurrentCheckInTime(value);
  }

  function ValidateCheckOutTime(value) {
    if (isShifted) {
      setCurrentCheckOutTime(value);
      setCheckOutTime(value);
    } else {
      setCurrentCheckOutTime(value);
      setIsCheckOutTimeIncorrect(false);
      if (value > convertTimeSpan(hotelCheckOutTime)) {
        isAvaivableToShiftCheckOutTime();
      } else {
        setCheckOutTime(value);
      }
    }
  }

  function handleCloseShiftAlert() {
    setShiftAlertOpen(false);
  }

  function convertTimeSpan(value) {
    let timeParts = value.split(":");
    return timeParts[0] + ":" + timeParts[1];
  }

  function handleCloseMessageDialog() {
    if (!!email) {
      dispatch({ type: EMAIL, email: email });
    }
    SetMessageDialogOpen(false);
    history.push({
      pathname: HOME_PATH,
    });
  }

  function validateHours() {
    setCheckInTime(currentCheckInTime);
    ValidateCheckOutTime(currentCheckOutTime);
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

  const getLimitHours = async () => {
    await API.get("/rooms/" + room.id + "/getLimitHours")
      .then((response) => response.data)
      .then((data) => {
        setHotelCheckInTime(data.checkInTime);
        setHotelCheckOutTime(data.checkOutTime);

        if (!isEditOrder) {
          setCheckInTime(data.checkInTime);
          setCurrentCheckInTime(data.checkInTime);
          setCheckOutTime(data.checkOutTime);
          setCurrentCheckOutTime(data.checkOutTime);
        }
      });
  };

  const isAvaivableToBook = async (checkIn, checkOut) => {
    await API.get("/rooms/" + room.id + "/isEmpty", {
      params: {
        checkInDate: checkIn.toJSON(),
        checkOutDate: checkOut.toJSON(),
      },
    })
      .then((response) => response.data)
      .then((data) => {
        if (data) {
        } else {
        }
      })
      .catch((error) => console.log(error.response.data.message));
  };

  const isAvaivableToShiftCheckOutTime = async () => {
    await API.get("/rooms/" + room.id + "/isPossibleToShiftCheckOutTime", {
      params: {
        checkOutDate: moment(checkOutDate, "DD-MM-YYYY")
          .add(1, "days")
          .toJSON(),
      },
    })
      .then((response) => response.data)
      .then((data) => {
        if (!data) {
          setIsCheckOutTimeIncorrect(true);
        } else {
          console.log("asdfdsf");
          setShiftAlertOpen(true);
        }
      })
      .catch((error) => {
        CallAlert(dispatch, false, "", "room already booked on this dates");
      });
  };
  function ShiftCheckOutDate() {
    const newCheckOutDate = new Date(
      moment(checkOutDate, "DD-MM-YYYY").add(1, "days")
    );
    setCurrentCheckOutDate(newCheckOutDate);
    shiftCheckOutDate(newCheckOutDate);
    setCheckOutTime(currentCheckOutTime);
    setIsShifted(true);
    handleCloseShiftAlert();
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

  const updateOrder = async () => {
    const request = {
      CheckInTime: checkInTime,
      CheckOutTime: checkOutTime,
    };
    await API.put("/orders/" + orderId + "/updateOrder", request, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        handleCloseUpdateOrderDialog();
        CallAlert(dispatch, true, "order updated successfully");
      })
      .catch((error) => {
        CallAlert(
          dispatch,
          false,
          "",
          "something went wrong.Please, try again"
        );
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
        StartDate: currentCheckInDate,
        EndDate: currentCheckOutDate,
        ServiceQuantities: selectedServices,
        UserEmail: userEmail,
        CheckInTime: checkInTime,
        CheckOutTime: checkOutTime,
        IsCheckOutTimeShifted: isShifted,
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
            <Grid container spacing={6}>
              <Grid item sm={4}>
                <TextField
                  id="time"
                  label="check-in"
                  type="time"
                  value={currentCheckInTime}
                  //className={classes.textField}
                  onChange={(e) => {
                    ValidateCheckInTime(e.target.value);
                  }}
                  error={isCheckInTimeIncorrect}
                  helperText={
                    isCheckInTimeIncorrect
                      ? `arrival hour should be later then ${hotelCheckInTime}`
                      : ""
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item sm={4}>
                <TextField
                  id="time"
                  label="check-out"
                  type="time"
                  value={currentCheckOutTime}
                  error={isCheckOutTimeIncorrect}
                  helperText={
                    isCheckOutTimeIncorrect
                      ? `hour when you should leave should be earlier then ${hotelCheckOutTime}`
                      : ""
                  }
                  //className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setCurrentCheckOutTime(e.target.value);
                  }}
                />
              </Grid>
              <Grid item sm={4}>
                <Button
                  disabled={isCheckInTimeIncorrect}
                  color="primary"
                  style={{ marginTop: 10 }}
                  size="small"
                  onClick={validateHours}
                  variant="contained"
                >
                  Save hours
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {isEditOrder &&
          !!limitDays &&
          moment().add(limitDays, "days") < checkInDate ? (
            <Grid item>
              <Grid container spacing={6}>
                <Grid item sm={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Typography variant="h6">new check-in date</Typography>
                    <KeyboardDatePicker
                      disableToolbar
                      disablePast
                      variant="inline"
                      inputVariant="outlined"
                      format="MM/dd/yyyy"
                      value={currentCheckInDate}
                      onChange={setCurrentCheckInDate}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item sm={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Typography variant="h6">new check-out date</Typography>
                    <KeyboardDatePicker
                      disableToolbar
                      disablePast
                      variant="inline"
                      inputVariant="outlined"
                      format="MM/dd/yyyy"
                      value={currentCheckOutDate}
                      onChange={(date) => setCurrentCheckOutDate(date)}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item sm={4}>
                  <Button
                    style={{ marginTop: 40 }}
                    variant="contained"
                    color="primary"
                  >
                    Save new dates
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          <Grid item xs={12}>
            <Typography>check-in hour : {checkInTime}</Typography>
            <Typography>
              check-in date: {requestCheckInDate.toLocaleDateString("en-GB")}
            </Typography>
            <Typography>
              check-out date: {requestCheckOutDate.toLocaleDateString("en-GB")}
            </Typography>
            <Typography>
              check-out hour :
              {moment(requestCheckOutDate)
                .subtract(1, "days")
                .format("DD/MM/YYYY")}{" "}
              {checkOutTime}
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
            onClick={isEditOrder ? updateOrder : сreateOrder}
            color="primary"
            disabled={
              !checked ||
              emailErrorLabel !== "" ||
              email === "" ||
              checkInTime < hotelCheckInTime
            }
          >
            {isEditOrder ? "Update order" : "Order"}
          </Button>
        </Grid>
      </Paper>
      <BaseDialog
        open={messageDialogOpen}
        handleClose={handleCloseMessageDialog}
        form={!!token ? messageForUser : messageForGuest}
      ></BaseDialog>
      <ShiftCheckOutTimeAlert
        open={shiftAlertOpen}
        handleClose={handleCloseShiftAlert}
        checkOutTime={hotelCheckOutTime}
        shiftCheckOutDate={ShiftCheckOutDate}
      ></ShiftCheckOutTimeAlert>
    </>
  );
}
