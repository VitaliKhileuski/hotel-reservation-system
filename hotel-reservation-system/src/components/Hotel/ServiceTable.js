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
import BaseAddDialog from "../shared/BaseAddDialog";
import BaseDeleteDialog from "./../shared/BaseDeleteDialog";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    minHeight: 600,
  },
  addHotelButton: {
    marginTop: 30,
  },
});

export default function ServiceTable({ hotelId }) {
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
          setServices(data.item1);
          setMaxNumberOfServices(data.item2);
        })
        .catch((error) => console.log(error.response.data.message));
    };
    loadServices();
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
                <TableCell align="right" style={{ minWidth: 50 }}>
                  Id
                </TableCell>
                <TableCell align="right" style={{ minWidth: 170 }}>
                  Name
                </TableCell>
                <TableCell align="right" style={{ minWidth: 100 }}>
                  Payment
                </TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell align="right">{service.id}</TableCell>
                  <TableCell align="right">{service.name}</TableCell>
                  <TableCell align="right">{service.payment}</TableCell>
                  <TableCell>
                    <IconButton
                      color="inherit"
                      onClick={() => OpenAddServiceDialog(service)}
                    >
                      <EditIcon></EditIcon>
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="inherit"
                      onClick={() => callDeleteDialog(service.id)}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 50]}
          component="div"
          count={maxNumberOfServices}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
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
      <BaseAddDialog
        open={openDialog}
        handleClose={handleClose}
        form={form}
      ></BaseAddDialog>
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
  );
}
