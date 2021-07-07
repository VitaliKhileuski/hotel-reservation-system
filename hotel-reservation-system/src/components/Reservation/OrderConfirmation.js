import { React, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  AppBar,
  Typography,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import BaseStepper from "./../shared/BaseStepper";
import RoomDetails from "../Room/RoomDetails";
import ServiceChoice from "../Service/ServiceChoise";
import DateFilter from "../Filters/DateFilter";
import ReservationPaymentTable from "./ReservationPaymentTable";
import { useSelector } from "react-redux";
import API from "./../../api";
import { useDispatch } from "react-redux";
import {
  IS_LOGGED,
  NAME,
  ROLE,
  EMAIL,
  USER_ID,
} from "./../../storage/actions/actionTypes";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 25,
    width: "95%",
    height: "70%",
  },
  paperGrid: {
    marginTop: "10%",
  },
  paper: {
    height: "95%",
    marginTop: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function OrderConfirmation({
  selectedServices,
  room,
  checkInDate,
  checkOutDate,
}) {
  const [checked, setChecked] = useState(true);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [emailErrorLabel, setEmailErrorLabel] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.isLogged);
  let userEmail = useSelector((state) => state.email);

  function validateEmail(email) {
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

  const createOrderRequest = async (request) => {
    await API.post("/orders/" + room.id + "/order", request)
      .then((response) => response.data)
      .then((data) => {})
      .catch((error) => {
        console.log(error.response.data.Message);
      });
  };

  const createUser = async () => {
    let request = {
      Email: email,
    };
    await API.post("/users/", request)
      .then((response) => response.data)
      .then((data) => {})
      .catch((error) => {
        console.log(error.response.data.Message);
        setEmailErrorLabel(error.response.data.Message);
      });
  };

  async function сreateOrder() {
    if (checked === true && emailErrorLabel === "") console.log("email");
    console.log(userEmail);
    if (userEmail === "" || userEmail === undefined) {
      await createUser();
      console.log("dispatches");
      userEmail = email;
      dispatch({ type: NAME, name: "user" });
      dispatch({ type: IS_LOGGED, isLogged: true });
      dispatch({ type: ROLE, role: "User" });
    }
    const request = {
      StartDate: checkInDate,
      EndDate: checkOutDate,
      ServiceQuantities: selectedServices,
      UserEmail: userEmail,
    };
    createOrderRequest(request);
    history.push({
      pathname: "/home",
    });
  }

  return (
    <Paper className={classes.paper}>
      <Grid
        className={classes.paperGrid}
        spacing={5}
        container
        direction="column"
        justify="space-around"
        alignItems="center"
      >
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
          onClick={() => сreateOrder()}
          color="primary"
        >
          Order
        </Button>
      </Grid>
    </Paper>
  );
}
