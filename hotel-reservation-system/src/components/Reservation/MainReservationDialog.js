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
import Payment from "./Payment";
import { checkUtils } from "@material-ui/pickers/_shared/hooks/useUtils";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dateFilter: {
    display: "flex",
    justifyContent: "center",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
export default function MainReservationDialog({
  open,
  handleClose,
  room,
  checkInDate,
  checkOutDate,
}) {
  const [flag, setFlag] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]);
  const [checkIn,setCheckIn] = useState(checkInDate);
  const [checkOut,setCheckOut] = useState(checkOutDate);
  let roomDetailsСomponent = <RoomDetails room={room}></RoomDetails>;
  let choiseOfServicesComponent = (
    <ServiceChoice
      oldSelectedServices={selectedServices}
      getSelectedServices={getSelectedServices}
    ></ServiceChoice>
  );
  let numberOfDays  = Math.round((Math.abs(checkIn-checkOut))/(1000*3600*24))
  let paymentComponent = (
    <Payment selectedServices={selectedServices} room={room} numberOfDays ={numberOfDays}></Payment>
  );
  const classes = useStyles();
  const [currentComponent, setCurrentComponent] =
    useState(roomDetailsСomponent);

  console.log(checkOutDate);
  useEffect(() => {}, [currentComponent]);

  function getSelectedServices(selectedServices) {
    setSelectedServices(selectedServices);
  }

  function getStepComponent(step) {
    switch (step) {
      case 0:
        setCurrentComponent(roomDetailsСomponent);
        break;
      case 1:
        setCurrentComponent(choiseOfServicesComponent);
        break;
      case 2:
        setCurrentComponent(paymentComponent);
        break;
      default:
        return "Unknown step";
    }
  }
  function changeStep(step) {
    console.log(step);
    if (step === 0) {
      setFlag(true);
    } else {
      setFlag(false);
    }
    getStepComponent(step);
  }
  function close() {
    setCurrentComponent(roomDetailsСomponent);
    handleClose();
  }
  function changeDates(checkIn,checkOut){
    console.log(checkIn);
    console.log(checkOut);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
  }

  return (
    <Dialog
      open={open}
      fullScreen
      onClose={() => close()}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Reservation
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => close()}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {currentComponent}
      <div className={classes.dateFilter}>
        {flag === true ? (
          <DateFilter
            roomId = {room.id}
            checkInDate={checkIn}
            checkOutDate={checkOut}
            changeDates={changeDates}
          ></DateFilter>
        ) : (
          ""
        )}
        <BaseStepper changeStep={changeStep}></BaseStepper>
      </div>
    </Dialog>
  );
}
