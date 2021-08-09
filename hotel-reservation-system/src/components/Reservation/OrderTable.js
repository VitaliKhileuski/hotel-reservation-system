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
import UpdateIcon from "@material-ui/icons/Update";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import BaseDialog from "../shared/BaseDialog";
import { useStyles } from "@material-ui/pickers/views/Calendar/SlideTransition";
import API from "./../../api";
import OrderFilter from "../Filters/OrderFilter";
import Payment from "./Payment";
import RoomDetails from "../Room/RoomDetails";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import CallAlert from "../../Notifications/NotificationHandler";
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

function Row({ order, handleClickDeleteIcon, handleClickUpdateOrder }) {
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
          <Tooltip title="look to room details">
            <IconButton
              color="inherit"
              onClick={() => openRoomDetails(order.room)}
            >
              <ZoomInIcon></ZoomInIcon>
            </IconButton>
          </Tooltip>
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
        <TableCell align="right">{order.checkInTime}</TableCell>
        <TableCell align="right">{order.checkOutTime}</TableCell>
        <TableCell align="right">{order.numberOfDays}</TableCell>
        <TableCell align="right">{ccyFormat(order.fullPrice)}</TableCell>
        <TableCell>
          <Tooltip title="update check In date">
            <IconButton
              color="inherit"
              onClick={() => handleClickUpdateOrder(order)}
            >
              <UpdateIcon></UpdateIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="delete">
            <IconButton color="inherit">
              <DeleteIcon
                onClick={() => handleClickDeleteIcon(order.id)}
              ></DeleteIcon>
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      {order.services.length === 0 ? (
        ""
      ) : (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
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
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
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
  const [openUpdateOrder, setOpenUpdateOrder] = useState(false);
  const [currentAscending, setCurrentAscending] = useState("asc");
  const [currentLimitDays, setCurrentLimitDays] = useState();
  const [orderId, setOrderId] = useState("");
  const [currentOrder, setCurrentOrder] = useState();
  const token = localStorage.getItem("token");
  const [filterflag, setFilterFlag] = useState(true);
  const updateOrderForm = !!currentOrder ? (
    <Payment
      selectedServices={currentOrder.services}
      room={currentOrder.room}
      checkInDate={new Date(currentOrder.startDate)}
      checkOutDate={new Date(currentOrder.endDate)}
      isEditOrder={true}
      checkInTime={currentOrder.checkInTime}
      checkOutTime={currentOrder.checkOutTime}
      orderId={currentOrder.id}
      handleCloseUpdateOrderDialog={handleCloseUpdateOrderDialog}
      limitDays={currentOrder.room.hotel.limitDays}
      isCheckOutTimeShifted={currentOrder.isCheckOutTimeShifted}
    ></Payment>
  ) : (
    ""
  );

  useEffect(() => {
    if (deleteDialogOpen === false && filterflag && !openUpdateOrder) {
      loadOrders();
    }
  }, [rowsPerPage, page, deleteDialogOpen, openUpdateOrder]);

  const loadOrders = async (
    country,
    city,
    surname,
    orderNumber,
    flag,
    pageNumber,
    sortField,
    ascending
  ) => {
    let requestCountry = country;
    let requestCity = city;
    let requestSurname = surname;
    let requestOrderNumber = orderNumber;
    let requestPageNumber = !!pageNumber ? pageNumber : pageForRequest;
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
        PageNumber: requestPageNumber,
        PageSize: rowsPerPage,
        SortField: sortField,
        Ascending: requestAscending,
      },
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        console.log(data.items);
        setOrders(data.items);
        setMaxNumberOfOrders(data.numberOfItems);
      })
      .catch((error) => console.log(error.response.data.Message));
    setFilterFlag(true);
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
    setFilterFlag(false);
    setPage(0);
    setPageForRequest(1);
    const orderNumberNoSpaces = orderNumber.trim();
    setHotelCountry(country);
    setHotelCity(city);
    setCurrentSurname(surname);
    setCurrentOrderNumber(orderNumberNoSpaces);
    loadOrders(country, city, surname, orderNumberNoSpaces, true, 1);
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
      undefined,
      undefined,
      sortField,
      ascending
    );
  }
  function handleCloseUpdateOrderDialog() {
    setOpenUpdateOrder(false);
  }

  function handleClickUpdateOrder(order) {
    let currentOrder = Object.assign({}, order);
    let newServices = [];
    currentOrder.services.forEach((item) => {
      let serviceId = item.service.id;
      let payment = item.service.payment;
      let quantity = item.quantity;
      let name = item.service.name;
      let newService = {
        ServiceId: serviceId,
        name: name,
        payment: payment,
        quantity: quantity,
      };
      newServices.push(newService);
    });
    currentOrder.services = newServices;
    setCurrentOrder(currentOrder);
    setOpenUpdateOrder(true);
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
              <TableCell align="right" style={{ minWidth: 130 }}>
                Order number
              </TableCell>
              <TableCell align="right" style={{ minWidth: 30 }}>
                Room
              </TableCell>
              <TableCell align="right" style={{ minWidth: 100 }}>
                <TableSortLabel
                  active={currentSortField === "DateOrdered"}
                  direction={currentAscending}
                  onClick={() => orderBy("DateOrdered")}
                >
                  Order date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" style={{ minWidth: 100 }}>
                <TableSortLabel
                  active={currentSortField === "StartDate"}
                  direction={currentAscending}
                  onClick={() => orderBy("StartDate")}
                >
                  Check-in date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" style={{ minWidth: 100 }}>
                <TableSortLabel
                  active={currentSortField === "EndDate"}
                  direction={currentAscending}
                  onClick={() => orderBy("EndDate")}
                >
                  Check-out date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" style={{ minWidth: 100 }}>
                <TableSortLabel
                  active={currentSortField === "CheckInTime"}
                  direction={currentAscending}
                  onClick={() => orderBy("CheckInTime")}
                >
                  Check-in time
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" style={{ minWidth: 100 }}>
                <TableSortLabel
                  active={currentSortField === "CheckOutTime"}
                  direction={currentAscending}
                  onClick={() => orderBy("CheckOutTime")}
                >
                  Check-out time
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" style={{ minWidth: 100 }}>
                <TableSortLabel
                  active={currentSortField === "NumberOfDays"}
                  direction={currentAscending}
                  onClick={() => orderBy("NumberOfDays")}
                >
                  Number of days
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" style={{ minWidth: 100 }}>
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
                handleClickUpdateOrder={handleClickUpdateOrder}
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
      <BaseDialog
        title="update check In Date"
        open={openUpdateOrder}
        handleClose={handleCloseUpdateOrderDialog}
        form={updateOrderForm}
        fullWidth={true}
      ></BaseDialog>
    </>
  );
}
