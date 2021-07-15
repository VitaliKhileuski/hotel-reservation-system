import { React } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ReservationPaymentTable from "./ReservationPaymentTable";
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
          checkOutDate={checkOutDate}
        ></OrderConfirmation>
      </Grid>
    </Grid>
  );
}