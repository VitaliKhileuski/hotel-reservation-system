import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Dialog, AppBar, Typography } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import BaseStepper from "./../shared/BaseStepper";
import RoomDetails from "../Room/RoomDetails";
import ServiceChoice from "../Service/ServiceChoise";
import DateFilter from "../Filters/DateFilter";
import ReservationPaymentTable from "./ReservationPaymentTable";

const useStyles = makeStyles((theme) => ({
  appBar: {},
}));

export default function MainReservationDialog({
  selectedServices,
  room,
  numberOfDays,
}) {
  const classes = useStyles();

  return (
    <ReservationPaymentTable
      selectedServices={selectedServices}
      room={room}
      numberOfDays={numberOfDays}
    ></ReservationPaymentTable>
  );
}
