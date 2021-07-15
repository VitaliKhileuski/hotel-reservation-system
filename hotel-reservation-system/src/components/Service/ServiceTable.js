import { React, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import API from "../../api";
import AddServiceForm from "./AddServiceForm";
import BaseAlert from "../shared/BaseAlert";
import BaseDialog from "../shared/BaseDialog";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const useStyles = makeStyles({
  root: {
    minWidth: "50%",
  },
  container: {
    marginTop: 10,
    minHeight: 380,
  },
  addHotelButton: {
    marginTop: 30,
  },
});

export default function ServiceTable({ hotelId, serviceList }) {
  const token = localStorage.getItem("token");
  const [services, setServices] = useState([]);
  const [maxNumberOfServices, setMaxNumberOfServices] = useState(0);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [pageForRequest, SetPageForRequest] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [serviceId, setServiceId] = useState(0);
  const [service, setService] = useState();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSuccessStatus, setAlertSuccessStatus] = useState(true);

  let form = (
    <AddServiceForm
      handleClose={() => handleClose()}
      hotelId={hotelId}
      service={service}
      callAlert={callAlert}
    ></AddServiceForm>
  );
  useEffect(() => {
    if (hotelId === undefined) {
      setServices(serviceList);
    }
  }, [serviceList, service]);

  useEffect(() => {
    if (!!hotelId) {
      const loadServices = async () => {
        await API.get(
          "/services/" +
            hotelId +
            "/pages?PageNumber=" +
            pageForRequest +
            "&PageSize=" +
            rowsPerPage
        )
          .then((response) => response.data)
          .then((data) => {
            setServices(data.item1);
            setMaxNumberOfServices(data.item2);
          })
          .catch((error) => console.log(error.response.data.message));
      };
      loadServices();
    }
  }, [rowsPerPage, page, openDialog, openDeleteDialog]);

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

  function OpenAddServiceDialog(service) {
    setService(service);
    setOpenDialog(true);
  }
  function handleClose() {
    setOpenDialog(false);
  }

  function callDeleteDialog(serviceId) {
    setServiceId(serviceId);
    setOpenDeleteDialog(true);
  }

  function handleCloseDeleteDialog() {
    setOpenDeleteDialog(false);
  }

  function increaseQuantity(service) {
    let newService = {
      id: service.id,
      name: service.name,
      payment: service.payment,
      quantity: service.quantity++,
    };
    setService(newService);
  }

  function reduceQuantity(service) {
    if (service.quantity !== 1) {
      let newService = {
        id: service.id,
        name: service.name,
        payment: service.payment,
        quantity: service.quantity--,
      };
      setService(newService);
    }
  }
  function callAlert(message, successStatus) {
    setAlertMessage(message);
    setAlertSuccessStatus(successStatus);
    setAlertOpen(true);
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  function slice(services) {
    if (!!hotelId) {
      return services;
    } else {
      return services.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    }
  }

  async function deleteService() {
    const DeleteService = async () => {
      await API.delete("/services/" + serviceId, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          callAlert("service deleted successfully", true);
        })
        .catch((error) =>
          callAlert(false)
        );
    };

    await DeleteService();
    handleCloseDeleteDialog();
  }

  return (
    <>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="right" style={{ minWidth: 170 }}>
                  Name
                </TableCell>
                <TableCell align="right" style={{ minWidth: 100 }}>
                  Payment
                </TableCell>
                {!!hotelId ? (
                  ""
                ) : (
                  <TableCell align="right" style={{ minWidth: 50 }}>
                    Quantity
                  </TableCell>
                )}
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {slice(services).map((service) => (
                <TableRow key={service.id}>
                  <TableCell align="right">{service.name}</TableCell>
                  <TableCell align="right">{service.payment}</TableCell>
                  {!!hotelId ? (
                    <TableCell>
                      <IconButton
                        color="inherit"
                        onClick={() => OpenAddServiceDialog(service)}
                      >
                        <EditIcon></EditIcon>
                      </IconButton>
                      <IconButton
                        color="inherit"
                        onClick={() => callDeleteDialog(service.id)}
                      >
                        <DeleteIcon></DeleteIcon>
                      </IconButton>
                    </TableCell>
                  ) : (
                    <>
                      <TableCell align="right">{service.quantity}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => increaseQuantity(service)}
                          color="inherit"
                        >
                          <AddIcon></AddIcon>
                        </IconButton>
                        <IconButton
                          onClick={() => reduceQuantity(service)}
                          color="inherit"
                        >
                          <RemoveIcon></RemoveIcon>
                        </IconButton>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 50]}
          component="div"
          count={!!hotelId ? maxNumberOfServices : services.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {!!hotelId ? (
        <>
          <Button
            variant="contained"
            color="primary"
            size="large"
            margin="normal"
            className={classes.createRoomButton}
            onClick={() => OpenAddServiceDialog()}
          >
            Create Service
          </Button>
          <BaseDialog
            open={openDialog}
            handleClose={handleClose}
            form={form}
          ></BaseDialog>
          <BaseDeleteDialog
            open={openDeleteDialog}
            handleCloseDeleteDialog={handleCloseDeleteDialog}
            deleteItem={deleteService}
            title={"Are you sure to delete this service?"}
            message={"service will be permanently deleted"}
          ></BaseDeleteDialog>
          <BaseAlert
            open={alertOpen}
            handleClose={handleCloseAlert}
            message={alertMessage}
            success={alertSuccessStatus}
          ></BaseAlert>
        </>
      ) : (
        ""
      )}
    </>
  );
}
