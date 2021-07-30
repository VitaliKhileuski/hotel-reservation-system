import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import { useSelector, useDispatch } from "react-redux";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import DeleteIcon from "@material-ui/icons/Delete";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import TableContainer from "@material-ui/core/TableContainer";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TablePagination from "@material-ui/core/TablePagination";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { useStyles } from "@material-ui/pickers/views/Calendar/SlideTransition";
import API from "./../../api";
import BaseDialog from "../shared/BaseDialog";
import OrderFilter from "../Filters/OrderFilter";
import RoomDetails from "../Room/RoomDetails";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import CallAlert from "../../Notifications/NotificationHandler";
import BaseAlert from "../shared/BaseAlert";
import { USER } from "./../../config/Roles";

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

function Row({ order, handleClickDeleteIcon }) {
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();
  const [roomDetailsOpen, setRoomDetailsOpen] = useState(false);
  const [room, setRoom] = useState();
  const component = <RoomDetails room={room}></RoomDetails>;
  const role = useSelector((state) => state.role);

  function openRoomDetails(room) {
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
        <TableCell align="right">{order.number}</TableCell>
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
        <TableCell>
          <IconButton color="inherit">
            <DeleteIcon
              onClick={() => handleClickDeleteIcon(order.id)}
            ></DeleteIcon>
          </IconButton>
        </TableCell>
      </TableRow>
      {order.services.length === 0 ? (
        ""
      ) : (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
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
      {role !== USER ? (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
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
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pageForRequest, setPageForRequest] = useState(0);
  const [maxNumberOfOrders, setMaxNumberOfOrders] = useState(0);
  const [hotelCountry, setHotelCountry] = useState("");
  const [hotelCity, setHotelCity] = useState("");
  const [currentSurname, setCurrentSurname] = useState("");
  const [currentOrderNumber, setCurrentOrderNumber] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentSortField, setCurrentSortField] = useState("");
  const [currentAscending, setCurrentAscending] = useState("asc");
  const [orderId, setOrderId] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (deleteDialogOpen === false) {
      loadOrders();
    }
  }, [rowsPerPage, page, deleteDialogOpen]);

  const loadOrders = async (
    country,
    city,
    surname,
    orderNumber,
    flag,
    sortField,
    ascending
  ) => {
    let requestCountry = country;
    let requestCity = city;
    let requestSurname = surname;
    let requestOrderNumber = orderNumber;
    if (flag === undefined) {
      requestCountry = hotelCountry;
      requestCity = hotelCity;
      requestSurname = currentSurname;
      requestOrderNumber = currentOrderNumber;
    }
    if (sortField === null || sortField === undefined) {
      sortField = currentSortField;
    }

    let requestAscending = (ascending || currentAscending) === "asc";
    await API.get("/orders", {
      params: {
        Country: requestCountry,
        City: requestCity,
        Surname: requestSurname,
        Number: requestOrderNumber,
        PageNumber: pageForRequest,
        PageSize: rowsPerPage,
        SortField: sortField,
        Ascending: requestAscending,
      },
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setOrders(data.items);
        setMaxNumberOfOrders(data.numberOfItems);
      })
      .catch((error) => console.log(error.response.data.Message));
  };

  async function deleteOrder() {
    const DeleteOrder = async () => {
      await API.delete("/orders/" + orderId + "/deleteOrder", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          CallAlert(dispatch, true, "order deleted successfully");
        })
        .catch((error) => CallAlert(dispatch, false));
    };
    DeleteOrder();
    handleCloseDeleteDialog();
  }

  function handleCloseDeleteDialog() {
    setDeleteDialogOpen(false);
  }

  function handleClickDeleteIcon(orderId) {
    setOrderId(orderId);
    setDeleteDialogOpen(true);
  }
  function getValuesFromFilter(country, city, surname, orderNumber) {
    const orderNumberNoSpaces = orderNumber.trim();
    setHotelCountry(country);
    setHotelCity(city);
    setCurrentSurname(surname);
    setCurrentOrderNumber(orderNumberNoSpaces);
    loadOrders(country, city, surname, orderNumberNoSpaces, true);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setPageForRequest(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    setPageForRequest(1);
  };

  function orderBy(sortField) {
    setCurrentSortField(sortField);
    let ascending = "";
    if (currentAscending === "desc" || sortField !== currentSortField) {
      setCurrentAscending("asc");
      ascending = "asc";
    } else {
      setCurrentAscending("desc");
      ascending = "desc";
    }
    loadOrders(
      undefined,
      undefined,
      undefined,
      undefined,
      sortField,
      ascending
    );
  }

  const classes = useStyles();
  return (
    <>
      <OrderFilter getValuesFromFilter={getValuesFromFilter}></OrderFilter>
      <TableContainer component={Paper} className={classes.table}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="right" style={{ minWidth: 170 }}>
                Order number
              </TableCell>
              <TableCell align="right" style={{ minWidth: 170 }}>
                Room
              </TableCell>
              <TableCell align="right" style={{ minWidth: 170 }}>
                <TableSortLabel
                  active={currentSortField === "DateOrdered"}
                  direction={currentAscending}
                  onClick={() => orderBy("DateOrdered")}
                >
                  Order date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" style={{ minWidth: 170 }}>
                <TableSortLabel
                  active={currentSortField === "StartDate"}
                  direction={currentAscending}
                  onClick={() => orderBy("StartDate")}
                >
                  Check in date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" style={{ minWidth: 170 }}>
                <TableSortLabel
                  active={currentSortField === "EndDate"}
                  direction={currentAscending}
                  onClick={() => orderBy("EndDate")}
                >
                  Check out date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" style={{ minWidth: 170 }}>
                <TableSortLabel
                  active={currentSortField === "NumberOfDays"}
                  direction={currentAscending}
                  onClick={() => orderBy("NumberOfDays")}
                >
                  Number of days
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" style={{ minWidth: 170 }}>
                <TableSortLabel
                  active={currentSortField === "FullPrice"}
                  direction={currentAscending}
                  onClick={() => orderBy("FullPrice")}
                >
                  Full price
                </TableSortLabel>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <Row
                key={order.id}
                order={order}
                handleClickDeleteIcon={handleClickDeleteIcon}
              />
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
      <BaseDeleteDialog
        open={deleteDialogOpen}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        title="cancel order"
        message="order will be canceled."
        deleteItem={deleteOrder}
      ></BaseDeleteDialog>
    </>
  );
}
