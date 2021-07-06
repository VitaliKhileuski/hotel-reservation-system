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
import { validate } from "@material-ui/pickers";
import OrderConfirmation from "./OrderConfirmation";

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

  const classes = useStyles();

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
        <OrderConfirmation
        selectedServices={selectedServices}
        room={room}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}></OrderConfirmation>
      </Grid>
    </Grid>
  );
}
