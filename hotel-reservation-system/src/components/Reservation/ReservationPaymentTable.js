import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles({
  table: {
    maxWidth: "80%",
    minHeight: "70%",
    margin: 20,
  },
});

export default function ReservationPaymentTable({
  selectedServices,
  room,
  checkInDate,
  checkOutDate,
}) {
  console.log(checkOutDate);
  const classes = useStyles();
  const numberOfDays = Math.round(
    Math.abs(checkInDate - checkOutDate) / (1000 * 3600 * 24)
  );
  function ccyFormat(num) {
    return `${num.toFixed(2)}`;
  }
  function calculateTotalSum() {
    console.log(selectedServices);
    let sum = 0;
    selectedServices.map((item) => {
      sum += item.payment * item.quantity;
    });
    sum += room.paymentPerDay * numberOfDays;
    return ccyFormat(sum);
  }

  return (
    <TableContainer>
      <Table className={classes.table} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={3}>
              Details
            </TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Facility</TableCell>
            <TableCell align="right">Payment</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={1}>
            <TableCell>Payment for room</TableCell>
            <TableCell align="right">{ccyFormat(room.paymentPerDay)}</TableCell>
            <TableCell align="right">{numberOfDays}</TableCell>
            <TableCell align="right">
              {ccyFormat(room.paymentPerDay * numberOfDays)}
            </TableCell>
          </TableRow>
          {selectedServices.map((service) => (
            <TableRow key={service.name}>
              <TableCell>{service.name}</TableCell>
              <TableCell align="right">{ccyFormat(service.payment)}</TableCell>
              <TableCell align="right">{service.quantity}</TableCell>
              <TableCell align="right">
                {ccyFormat(service.payment * service.quantity)}
              </TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell rowSpan={3} />
          </TableRow>
          <TableRow></TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{calculateTotalSum()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
