import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { TableContainer, TablePagination } from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { useStyles } from "@material-ui/pickers/views/Calendar/SlideTransition";
import API from "./../../api";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import BaseDialog from "../shared/BaseDialog";
import RoomDetails from "../Room/RoomDetails";
import { useSelector } from "react-redux";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  table: {
    margin: 40,
  },
});
function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function Row(props) {
  const { order } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();
  const [roomDetailsOpen, setRoomDetailsOpen] = useState(false);
  const [room, setRoom] = useState();
  let component = <RoomDetails room={room}></RoomDetails>;
  let role = useSelector((state) => state.role);

  function openRoomDetails(room) {
    console.log(room);
    setRoom(room);
    setRoomDetailsOpen(true);
  }
  function handleCloseRoomDetails() {
    setRoomDetailsOpen(false);
  }

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="right">
          <IconButton
            color="inherit"
            onClick={() => openRoomDetails(order.room)}
          >
            <ZoomInIcon></ZoomInIcon>
          </IconButton>
        </TableCell>
        <TableCell align="right">
          {new Date(order.dateOrdered).toLocaleDateString("en-GB")}
        </TableCell>
        <TableCell align="right">
          {new Date(order.startDate).toLocaleDateString("en-GB")}
        </TableCell>
        <TableCell align="right">
          {new Date(order.endDate).toLocaleDateString("en-GB")}
        </TableCell>
        <TableCell align="right">{order.numberOfDays}</TableCell>
        <TableCell align="right">{ccyFormat(order.fullPrice)}</TableCell>
      </TableRow>
      {order.services.length === 0 ? (
        ""
      ) : (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Services
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right" style={{ minWidth: 170 }}>
                        Name
                      </TableCell>
                      <TableCell align="right" style={{ minWidth: 170 }}>
                        Payment
                      </TableCell>
                      <TableCell align="right" style={{ minWidth: 170 }}>
                        Quantity
                      </TableCell>
                      <TableCell align="right" style={{ minWidth: 170 }}>
                        Full price
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell align="right">
                          {service.service.name}
                        </TableCell>
                        <TableCell align="right">
                          {ccyFormat(service.service.payment)}
                        </TableCell>
                        <TableCell align="right">{service.quantity}</TableCell>
                        <TableCell align="right">
                          {ccyFormat(
                            service.service.payment * service.quantity
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Hotel
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="right" style={{ minWidth: 170 }}>
                      Name
                    </TableCell>
                    <TableCell align="right" style={{ minWidth: 170 }}>
                      Country
                    </TableCell>
                    <TableCell align="right" style={{ minWidth: 170 }}>
                      City
                    </TableCell>
                    <TableCell align="right" style={{ minWidth: 170 }}>
                      Street
                    </TableCell>
                    <TableCell align="right" style={{ minWidth: 170 }}>
                      Building number
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={order.room.hotel.id}>
                    <TableCell align="right">{order.room.hotel.name}</TableCell>
                    <TableCell align="right">
                      {order.room.hotel.location.country}
                    </TableCell>
                    <TableCell align="right">
                      {order.room.hotel.location.city}
                    </TableCell>
                    <TableCell align="right">
                      {order.room.hotel.location.street}
                    </TableCell>
                    <TableCell align="right">
                      {order.room.hotel.location.buildingNumber}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      {role !== "User" ? (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Customer
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right" style={{ minWidth: 170 }}>
                        Email
                      </TableCell>
                      <TableCell align="right" style={{ minWidth: 170 }}>
                        Name
                      </TableCell>
                      <TableCell align="right" style={{ minWidth: 170 }}>
                        Surname
                      </TableCell>
                      <TableCell align="right" style={{ minWidth: 170 }}>
                        PhomeNumber
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={order.customer.id}>
                      <TableCell align="right">
                        {order.customer.email}
                      </TableCell>
                      <TableCell align="right">{order.customer.name}</TableCell>
                      <TableCell align="right">
                        {order.customer.surname}
                      </TableCell>
                      <TableCell align="right">
                        {order.customer.phoneNumber}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      ) : (
        ""
      )}
      <BaseDialog
        open={roomDetailsOpen}
        title="Room details"
        handleClose={handleCloseRoomDetails}
        form={component}
      ></BaseDialog>
    </>
  );
}

export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pageForRequest, SetPageForRequest] = useState(0);
  const [maxNumberOfOrders, setMaxNumberOfOrders] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadOrders = async () => {
      await API.get(
        "/orders?PageNumber=" + pageForRequest + "&PageSize=" + rowsPerPage,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
          setOrders(data.items);
          setMaxNumberOfOrders(data.numberOfItems);
        })
        .catch((error) => console.log(error.response.data.Message));
    };
    loadOrders();
  }, [rowsPerPage, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    SetPageForRequest(newPage + 1);
    console.log(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    SetPageForRequest(1);
  };

  console.log(orders);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  return (
    <>
      <TableContainer component={Paper} className={classes.table}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="right" style={{ minWidth: 170 }}>
                Room
              </TableCell>
              <TableCell align="right" style={{ minWidth: 170 }}>
                Order date
              </TableCell>
              <TableCell align="right" style={{ minWidth: 170 }}>
                Check in date
              </TableCell>
              <TableCell align="right" style={{ minWidth: 170 }}>
                Check out date
              </TableCell>
              <TableCell align="right" style={{ minWidth: 170 }}>
                Number of days
              </TableCell>
              <TableCell align="right" style={{ minWidth: 170 }}>
                Full Price
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <Row key={order.id} order={order} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 50]}
        component="div"
        count={maxNumberOfOrders}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}
