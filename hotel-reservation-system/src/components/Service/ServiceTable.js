import { React, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import API from "../../api";
import callAlert from "../../Notifications/NotificationHandler";
import BaseDialog from "../shared/BaseDialog";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import AddServiceForm from "./AddServiceForm";

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

export default function ServiceTable({
  hotelId,
  serviceList,
  isDisableCU,
  rerender,
}) {
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
  const [updateTable, setUpdateTable] = useState(true);
  const [currentSortField, setCurrentSortField] = useState("");
  const [currentAscending, setCurrentAscending] = useState("");
  const [currentRerender, setCurrentRerender] = useState(rerender);

  const form = (
    <AddServiceForm
      handleClose={handleClose}
      hotelId={hotelId}
      service={service}
    ></AddServiceForm>
  );

  useEffect(() => {
    if (hotelId === undefined) {
      setServices(serviceList);
      setCurrentRerender(false);
    }
  }, [serviceList, services, currentRerender]);

  useEffect(() => {
    if (updateTable && !!hotelId) {
      loadServices();
    }
  }, [rowsPerPage, page, openDialog, updateTable]);

  const loadServices = async (sortField, ascending) => {
    if (sortField === null || sortField === undefined) {
      sortField = currentSortField;
    }
    let requestAscending = (ascending || currentAscending) === "asc";
    await API.get("/services/" + hotelId + "/pages", {
      params: {
        PageNumber: pageForRequest,
        PageSize: rowsPerPage,
        SortField: sortField,
        Ascending: requestAscending,
      },
    })
      .then((response) => response.data)
      .then((data) => {
        setServices(data.items);
        setMaxNumberOfServices(data.numberOfItems);
      })
      .catch((error) => console.log(error.response.data.message));
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
    loadServices(sortField, ascending);
  }

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
    console.log(service);
    setService(service);
    setOpenDialog(true);
  }

  function handleClose() {
    setOpenDialog(false);
  }

  function callDeleteDialog(serviceId) {
    setServiceId(serviceId);
    setUpdateTable(false);
    setOpenDeleteDialog(true);
  }

  function handleCloseDeleteDialog() {
    setOpenDeleteDialog(false);
  }

  function increaseQuantity(service) {
    const newService = {
      id: service.id,
      name: service.name,
      payment: service.payment,
      quantity: service.quantity++,
    };
    setService(newService);
  }

  function reduceQuantity(service) {
    if (service.quantity !== 1) {
      const newService = {
        id: service.id,
        name: service.name,
        payment: service.payment,
        quantity: service.quantity--,
      };
      setService(newService);
    } else {
      deleteServiceFromCollection(service);
      setCurrentRerender(true);
    }
  }
  function deleteServiceFromCollection(service) {
    const index = services.indexOf(service);
    if (index > -1) {
      services.splice(index, 1);
    }
  }

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
  function ccyFormat(num) {
    return `${num.toFixed(2)}`;
  }

  async function deleteService() {
    const DeleteService = async () => {
      await API.delete("/services/" + serviceId, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          setUpdateTable(true);
          callAlert(true, "service deleted successfully");
        })
        .catch((error) => callAlert(false));
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
                {!!hotelId ? (
                  <>
                    <TableCell align="right" style={{ minWidth: 170 }}>
                      <TableSortLabel
                        active={currentSortField === "Name"}
                        direction={currentAscending}
                        onClick={() => orderBy("Name")}
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right" style={{ minWidth: 100 }}>
                      <TableSortLabel
                        active={currentSortField === "Payment"}
                        direction={currentAscending}
                        onClick={() => orderBy("Payment")}
                      >
                        Payment
                      </TableSortLabel>
                    </TableCell>
                    <TableCell></TableCell>
                  </>
                ) : (
                  <>
                    <TableCell align="right" style={{ minWidth: 50 }}>
                      Name
                    </TableCell>
                    <TableCell align="right" style={{ minWidth: 170 }}>
                      Payment
                    </TableCell>
                    <TableCell align="right" style={{ minWidth: 50 }}>
                      Quantity
                    </TableCell>
                    <TableCell />
                    <TableCell align="center" style={{ minWidth: 50 }}>
                      Total sum
                    </TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {slice(services).map((service) => (
                <TableRow key={service.id}>
                  <TableCell align="right">{service.name}</TableCell>
                  <TableCell align="right">
                    {ccyFormat(service.payment)}
                  </TableCell>
                  {!!hotelId ? (
                    <TableCell>
                      <Tooltip title="edit">
                        <IconButton
                          color="inherit"
                          onClick={() => OpenAddServiceDialog(service)}
                        >
                          <EditIcon></EditIcon>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="delete">
                        <IconButton
                          color="inherit"
                          onClick={() => callDeleteDialog(service.id)}
                        >
                          <DeleteIcon></DeleteIcon>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  ) : (
                    <>
                      <TableCell align="right">{service.quantity}</TableCell>
                      <TableCell>
                        {!isDisableCU ? (
                          <Tooltip title="add">
                            <IconButton
                              onClick={() => increaseQuantity(service)}
                              color="inherit"
                            >
                              <AddIcon></AddIcon>
                            </IconButton>
                          </Tooltip>
                        ) : (
                          ""
                        )}
                        <Tooltip title="substract">
                          <IconButton
                            onClick={() => reduceQuantity(service)}
                            color="inherit"
                          >
                            <RemoveIcon></RemoveIcon>
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        {ccyFormat(service.quantity * service.payment)}
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
        </>
      ) : (
        ""
      )}
    </>
  );
}
