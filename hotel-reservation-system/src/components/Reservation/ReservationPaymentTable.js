import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    maxWidth: "60%",
    minHeight: "70%",
  },
});

// function subtotal(items) {
//   return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
// }

export default function ReservationPaymentTable({
  selectedServices,
  room,
  numberOfDays,
}) {
  const classes = useStyles();
  function ccyFormat(num) {
    return `${num.toFixed(2)}`;
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={2}>
              Details
            </TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Facility</TableCell>
            <TableCell align="right">quantity.</TableCell>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={1}>
            <TableCell>Payment for room</TableCell>
            <TableCell align="right">{numberOfDays}</TableCell>
            <TableCell align="right">
              {ccyFormat(room.paymentPerDay * numberOfDays)}
            </TableCell>
          </TableRow>
          {selectedServices.map((service) => (
            <TableRow key={service.name}>
              <TableCell>{service.name}</TableCell>
              <TableCell align="right">{1}</TableCell>
              <TableCell align="right">{ccyFormat(service.payment)}</TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell rowSpan={2} />
          </TableRow>
          <TableRow></TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">10</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
