import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
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
import API from "./../../api";
import AddServiceForm from "./AddServiceForm";
import BaseAlert from "./../shared/BaseAlert";
import BaseDialog from "../shared/BaseDialog";
import BaseDeleteDialog from "./../shared/BaseDeleteDialog";
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

  const [addAlertOpen, setAddAlertOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [updateAlertOpen, setUpdateAlertOpen] = useState(false);

  let form = (
    <AddServiceForm
      handleClose={() => handleClose()}
      hotelId={hotelId}
      service={service}
      callAddAlert={callAddAlert}
      callUpdateAlert={callUpdateAlert}
    ></AddServiceForm>
  );
  useEffect(() => {
    if (hotelId === undefined) {
      setServices(serviceList);
    }
  }, [serviceList, service]);

  useEffect(() => {
    if (hotelId !== undefined) {
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
            console.log(data);
            console.log(data);
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
    var newService = {
      id: service.id,
      name: service.name,
      payment: service.payment,
      quantity: service.quantity++,
    };
    setService(newService);
  }
  function reduceQuantity(service) {
    if (service.quantity !== 1) {
      var newService = {
        id: service.id,
        name: service.name,
        payment: service.payment,
        quantity: service.quantity--,
      };
      setService(newService);
    }
  }
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAddAlertOpen(false);
    setDeleteAlertOpen(false);
    setUpdateAlertOpen(false);
  };
  function callAddAlert() {
    setAddAlertOpen(true);
  }
  function callUpdateAlert() {
    setUpdateAlertOpen(true);
  }
  function callDeleteAlert() {
    setDeleteAlertOpen(true);
  }
  function slice(services) {
    if (hotelId === undefined) {
      return services.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      return services;
    }
  }

  async function deleteService() {
    const DeleteService = async () => {
      await API.delete("/services/" + serviceId, {
        headers: { Authorization: "Bearer " + token },
      }).catch((error) => console.log(error.response.data.message));
    };

    await DeleteService();
    handleCloseDeleteDialog();
    callDeleteAlert();
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
                {hotelId === undefined ? (
                  <TableCell align="right" style={{ minWidth: 50 }}>
                    Quantity
                  </TableCell>
                ) : (
                  ""
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
                  {hotelId === undefined ? (
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
                  ) : (
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
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 50]}
          component="div"
          count={hotelId === undefined ? services.length : maxNumberOfServices}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {hotelId === undefined ? (
        ""
      ) : (
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
            open={addAlertOpen}
            handleClose={handleCloseAlert}
            message={"service added successfully"}
          ></BaseAlert>
          <BaseAlert
            open={deleteAlertOpen}
            handleClose={handleCloseAlert}
            message={"service deleted succesfully"}
          ></BaseAlert>
          <BaseAlert
            open={updateAlertOpen}
            handleClose={handleCloseAlert}
            message={"service updated succesfully"}
          ></BaseAlert>
        </>
      )}
    </>
  );
}
