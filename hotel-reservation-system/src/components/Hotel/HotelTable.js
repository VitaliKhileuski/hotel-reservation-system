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
import BaseAlert from "./../shared/BaseAlert";
import BaseAddDialog from "./../shared/BaseAddDialog";
import AddHotelForm from "./AddHotelForm";
import BaseDeleteDialog from "./../shared/BaseDeleteDialog";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import HotelAdminDialog from "./HotelAdminDialog";
import {
  IS_LOGGED,
  NAME,
  ROLE,
  USER_ID,
} from "./../../storage/actions/actionTypes";

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

export default function HotelTable() {
  const history = useHistory();
  const role = useSelector((state) => state.role);
  const token = localStorage.getItem("token");
  const [hotels, setHotels] = useState([]);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pageForRequest, SetPageForRequest] = useState(0);
  const [maxNumberOfHotels, setMaxNumberOfHotels] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [hotelId, setHotelId] = useState();
  const [flag, setFlag] = useState(false);
  const [message, setMessage] = useState("");
  const [assingFlag, setAssignFlag] = useState(false);

  const [addAlertOpen, setAddAlertOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [assignAdminAlertOpen, setAssignAdminAlertOpen] = useState(false);
  const [deleteAdminAlertOpen, setDeleteAdminAlertOpen] = useState(false);

  const isLogged = useSelector((state) => state.isLogged);
  const adminId = useSelector((state) => state.userId);
  let hotelAdminField = "";
  let form = (
    <AddHotelForm
      handleClose={() => handleClose()}
      callAlert={() => callAddAlert()}
    ></AddHotelForm>
  );
  let component = (
    <HotelAdminDialog
      hotelId={hotelId}
      message={message}
      handleClose={() => handleClose()}
      callAssignAdminAlert={() => callAssignAdminAlert()}
      callDeleteAdminAlert={() => callDeleteAdminAlert()}
      assingFlag={assingFlag}
    ></HotelAdminDialog>
  );

  useEffect(() => {
    const loadHotels = async () => {
      await API.get(
        "/hotels/pages?PageNumber=" +
          pageForRequest +
          "&PageSize=" +
          rowsPerPage,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
          setHotels(data.item1);
          setMaxNumberOfHotels(data.item2);
        })
        .catch((error) => console.log(error.response.data.Message));
    };
    if (role === "Admin") {
      loadHotels();
    }
    if (role === "HotelAdmin") {
      loadHotelAdminHotels();
    }
  }, [rowsPerPage, page, open, openDeleteDialog]);

  const loadHotelAdminHotels = async () => {
    await API.get(
      "hotels/hotelAdmin/" +
        adminId +
        "/pages?PageNumber=" +
        pageForRequest +
        "&PageSize=" +
        rowsPerPage
    )
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setHotels(data.item1);
        setMaxNumberOfHotels(data.item2);
      })
      .catch((error) => console.log(error.response.data.Message));
  };

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

  function handleClose() {
    setOpen(false);
    setFlag(false);
  }

  function OpenAddHotelDialog() {
    setOpen(true);
    console.log(true);
  }

  function handleCloseDeleteDialog() {
    setOpenDeleteDialog(false);
  }

  async function deleteHotel() {
    console.log(hotelId);
    const DeleteHotel = async () => {
      await API.delete("/hotels/" + hotelId, {
        headers: { Authorization: "Bearer " + token },
      }).catch((error) => console.log(error.response.data.message));
    };

    await DeleteHotel();
    handleCloseDeleteDialog();
    callDeleteAlert();
  }

  function callAlertDialog(hotelId) {
    setHotelId(hotelId);
    console.log(hotelId);
    setOpenDeleteDialog(true);
  }
  function toHotelEditor(hotel) {
    history.push({
      pathname: "/hotelEditor",
      state: {
        hotel,
      },
    });
  }
  function callAddAlert() {
    setAddAlertOpen(true);
  }

  function callDeleteAlert() {
    setDeleteAlertOpen(true);
  }
  function callAssignAdminAlert() {
    setAssignAdminAlertOpen(true);
  }
  function callDeleteAdminAlert() {
    setDeleteAdminAlertOpen(true);
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAddAlertOpen(false);
    setDeleteAlertOpen(false);
    setAssignAdminAlertOpen(false);
    setDeleteAdminAlertOpen(false);
  };
  function SetAdmin(hotelId) {
    setMessage("add admin");
    setFlag(true);
    setAssignFlag(true);
    setHotelId(hotelId);
    OpenAddHotelDialog();
  }
  function DeleteAdmin(hotelId) {
    SetAdmin(hotelId);
    setAssignFlag(false);
    setMessage("delete admin");
  }

  if (!isLogged || role === "User") {
    return <Redirect to="/home"></Redirect>;
  } else {
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
                    Building Number
                  </TableCell>
                  <TableCell style={{ minWidth: 30 }} />
                  <TableCell style={{ minWidth: 30 }} />
                  <TableCell style={{ minWidth: 30 }} />
                  <TableCell style={{ minWidth: 30 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {hotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell align="right">{hotel.id}</TableCell>
                    <TableCell align="right">{hotel.name}</TableCell>
                    <TableCell align="right">
                      {hotel.location.country}
                    </TableCell>
                    <TableCell align="right">{hotel.location.city}</TableCell>
                    <TableCell align="right">{hotel.location.street}</TableCell>
                    <TableCell align="right">
                      {hotel.location.buildingNumber}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="inherit"
                        onClick={() => toHotelEditor(hotel)}
                      >
                        <EditIcon></EditIcon>
                      </IconButton>
                      <IconButton
                        color="inherit"
                        onClick={() => callAlertDialog(hotel.id)}
                      >
                        <DeleteIcon></DeleteIcon>
                      </IconButton>
                      <IconButton
                        color="inherit"
                        onClick={() => SetAdmin(hotel.id)}
                      >
                        <PersonAddIcon></PersonAddIcon>
                      </IconButton>
                      <IconButton
                        color="inherit"
                        onClick={() => DeleteAdmin(hotel.id)}
                      >
                        <PersonAddDisabledIcon></PersonAddDisabledIcon>
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
            count={maxNumberOfHotels}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        {role === "Admin" ? (
          <Button
            variant="contained"
            color="primary"
            size="large"
            margin="normal"
            className={classes.addHotelButton}
            onClick={OpenAddHotelDialog}
          >
            Add hotel
          </Button>
        ) : (
          ""
        )}
        <BaseAddDialog
          open={open}
          handleClose={handleClose}
          form={flag === true ? component : form}
        ></BaseAddDialog>
        <BaseDeleteDialog
          open={openDeleteDialog}
          handleCloseDeleteDialog={handleCloseDeleteDialog}
          deleteItem={deleteHotel}
          title={"Are you sure to delete this hotel?"}
          message={"the hotel will be permanently deleted"}
        ></BaseDeleteDialog>

        <BaseAlert
          open={addAlertOpen}
          handleClose={handleCloseAlert}
          message={"hotel added successfully"}
        ></BaseAlert>
        <BaseAlert
          open={deleteAlertOpen}
          handleClose={handleCloseAlert}
          message={"hotel deleted succesfully"}
        ></BaseAlert>
        <BaseAlert
          open={assignAdminAlertOpen}
          handleClose={handleCloseAlert}
          message={" hotel admin assigned successfully"}
        ></BaseAlert>
        <BaseAlert
          open={deleteAdminAlertOpen}
          handleClose={handleCloseAlert}
          message={"hotel admin deleted successfully"}
        ></BaseAlert>
      </>
    );
  }
}
