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
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";

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

export default function Payment({
  selectedServices,
  room,
  checkInDate,
  checkOutDate,
}) {
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");
  const classes = useStyles();
  useEffect(() => {
    loadCaptchaEnginge(5);
  }, []);

  function CreateOrder() {}

  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      justify="space-between"
      alignItems="stretch"
    >
      <Grid item lg={6}>
        <ReservationPaymentTable
          selectedServices={selectedServices}
          room={room}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
        ></ReservationPaymentTable>
      </Grid>
      <Grid item lg={6}>
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
            <Grid item xs={12}>
              <TextField label="write your email"></TextField>
            </Grid>
            <Grid item xs={12}>
              <LoadCanvasTemplate />
              <TextField label="write a captcha"></TextField>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox name="checkedB" color="primary" />}
                label="I agree with the information I entered"
              />
            </Grid>
            <Button variant="contained" color="primary">
              Order
            </Button>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
