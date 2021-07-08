import { React, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@material-ui/core";
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
import BaseDialog from "../shared/BaseDialog";

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
  const [email, setEmail] = useState();
  const [emailErrorLabel, setEmailErrorLabel] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.isLogged);
  let userEmail = useSelector((state) => state.email);

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
    console.log("handle close");
    console.log(email);
    if (!!email) {
      dispatch({ type: EMAIL, email: email });
    }
    SetMessageDialogOpen(false);
    history.push({
      pathname: "/home",
    });
  }
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
    await API.post("/account/register", request)
      .then((response) => {
        if (!!response && !!response.data) {
          localStorage.setItem("token", response.data[0]);
          localStorage.setItem("refreshToken", response.data[1]);
          const jwt = JSON.parse(atob(response.data[0].split(".")[1]));
          dispatch({ type: IS_LOGGED, isLogged: true });
          dispatch({ type: NAME, name: jwt.firstname });
          dispatch({ type: ROLE, role: jwt.role });
          dispatch({ type: USER_ID, userId: jwt.id });
          dispatch({ type: EMAIL, userId: jwt.email });
          console.log(response);
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
    SetMessageDialogOpen(true);
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
          >
            Order
          </Button>
        </Grid>
      </Paper>
      <BaseDialog
        open={messageDialogOpen}
        handleClose={handleCloseMessageDialog}
        form={
          !!useSelector((state) => state.email)
            ? messageForUser
            : messageForGuest
        }
      ></BaseDialog>
    </>
  );
}
