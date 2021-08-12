import { React, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import callAlert from "../../Notifications/NotificationHandler";
import ServiceChoice from "./../Service/ServiceChoise";
import BaseDialog from "../shared/BaseDialog";
import OrderConfirmation from "./OrderConfirmation";
import ReservationPaymentTable from "./ReservationPaymentTable";

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
  isEditOrder,
  checkInTime,
  checkOutTime,
  orderId,
  handleCloseUpdateOrderDialog,
  limitDays,
  isCheckOutTimeShifted,
}) {
  const classes = useStyles();

  const [currentCheckInDate, setCurrentCheckInDate] = useState(checkInDate);
  const [currentCheckOutDate, setCurrentCheckOutDate] = useState(checkOutDate);
  const [currentSelectedServices, setCurrentSelectedServices] =
    useState(selectedServices);
  const [editServicesOpen, setEditServicesOpen] = useState(false);
  const form = (
    <ServiceChoice
      hotelId={room.hotelId}
      oldSelectedServices={currentSelectedServices}
      getSelectedServices={getSelectedServices}
      isEdit={true}
      checkInDate={currentCheckInDate}
      limitDays={limitDays}
    ></ServiceChoice>
  );

  function handleCloseEditServicesDialog() {
    setEditServicesOpen(false);
  }
  function openEditServicesDialog() {
    setEditServicesOpen(true);
  }

  function getSelectedServices(value) {
    console.log(value);
    handleCloseEditServicesDialog();
    callAlert(true, "new services was saved. Final price recalculated");
    setCurrentSelectedServices(value);
  }

  function shiftCheckOutDate(value) {
    setCurrentCheckOutDate(value);
  }
  function shiftCheckInDate(value) {
    setCurrentCheckInDate(value);
  }

  return (
    <>
      <Grid
        className={classes.root}
        container
        direction="row"
        justify="space-between"
        alignItems="stretch"
      >
        <Grid container item lg={6} direction="column" justifyContent="center">
          <Grid item>
            <ReservationPaymentTable
              selectedServices={currentSelectedServices}
              room={room}
              checkInDate={currentCheckInDate}
              checkOutDate={currentCheckOutDate}
            ></ReservationPaymentTable>
          </Grid>
          {isEditOrder ? (
            <Grid
              item
              style={{ marginRight: 50 }}
              justify="center"
              align="center"
            >
              <Button
                onClick={openEditServicesDialog}
                variant="contained"
                color="primary"
              >
                Edit services
              </Button>
            </Grid>
          ) : (
            ""
          )}
        </Grid>
        <Grid item lg={6}>
          <OrderConfirmation
            selectedServices={currentSelectedServices}
            room={room}
            checkInDate={currentCheckInDate}
            checkOutDate={currentCheckOutDate}
            isEditOrder={isEditOrder}
            shiftCheckOutDate={shiftCheckOutDate}
            shiftCheckInDate={shiftCheckInDate}
            orderCheckInTime={checkInTime}
            orderCheckOutTime={checkOutTime}
            orderId={orderId}
            handleCloseUpdateOrderDialog={handleCloseUpdateOrderDialog}
            limitDays={limitDays}
            isCheckOutTimeShifted={isCheckOutTimeShifted}
          ></OrderConfirmation>
        </Grid>
      </Grid>
      <BaseDialog
        title="edit services"
        open={editServicesOpen}
        handleClose={handleCloseEditServicesDialog}
        form={form}
        fullWidth={true}
      ></BaseDialog>
    </>
  );
}
