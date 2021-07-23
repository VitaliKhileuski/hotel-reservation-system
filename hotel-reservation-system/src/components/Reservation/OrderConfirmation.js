import { React, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import { useSelector, useDispatch } from "react-redux";
import { EMAIL } from "./../../storage/actions/actionTypes";
import API from "./../../api";
import BaseDialog from "../shared/BaseDialog";
import { FillStorage, FillLocalStorage } from "../Authorization/TokenData";
import { EMAIL_REGEX } from "../../constants/Regex";

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
  const [checked, setChecked] = useState(false);
  const history = useHistory();
  const [email, setEmail] = useState();
  const [emailErrorLabel, setEmailErrorLabel] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.isLogged);
  const userEmail = useSelector((state) => state.email);

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
    const flag = EMAIL_REGEX.test(email);
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
          FillLocalStorage(response.data[0], response.data[1]);
          FillStorage(response.data[0], dispatch);
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
    if (checked  && emailErrorLabel === "") console.log("email");
    if (userEmail === "" || userEmail === undefined) {
      await createUser();
      userEmail = email;
    }
    let request = {
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
            disabled={!checked || emailErrorLabel !== "" || email === ""}
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
