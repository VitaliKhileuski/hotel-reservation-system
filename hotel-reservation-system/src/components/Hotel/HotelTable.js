import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Grid from "@material-ui/core/Grid";
import TablePagination from "@material-ui/core/TablePagination";
import TableHead from "@material-ui/core/TableHead";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import API from "./../../api";
import BaseAlert from "./../shared/BaseAlert";
import BaseDialog from "../shared/BaseDialog";
import BaseDeleteDialog from "./../shared/BaseDeleteDialog";
import BaseImageDialog from "../shared/BaseImageDialog";
import AddHotelForm from "./AddHotelForm";
import HotelAdminDialog from "./HotelAdminDialog";
import UsersFilter from "../Filters/UserFilter";
import HotelFilter from "../Filters/HotelFilter";

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
  grid: {
    margin: 15,
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
  },
});

export default function HotelTable() {
  const history = useHistory();
  const role = useSelector((state) => state.role);
  const token = localStorage.getItem("token");
  const [hotel, setHotel] = useState();
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
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSuccessStatus, setAlertSuccessStatus] = useState(true);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [hotelName, setHotelName] = useState("");
  const [hotelAdminEmail, setHotelAdminEmail] = useState("");
  const [hotelAdminSurname, setHotelAdminSurname] = useState("");
  const [currentSortField, setCurrentSortField] = useState("");
  const [currentAscending, setCurrentAscending] = useState("asc");
  const isLogged = useSelector((state) => state.isLogged);
  const adminId = useSelector((state) => state.userId);

  const form = (
    <AddHotelForm
      handleClose={handleClose}
      callAlert={callAlert}
    ></AddHotelForm>
  );

  const component = (
    <HotelAdminDialog
      hotelId={hotelId}
      message={message}
      handleClose={handleClose}
      callAlert={callAlert}
      assingFlag={assingFlag}
    ></HotelAdminDialog>
  );

  useEffect(() => {
    if (!openDeleteDialog && !open && !imageDialogOpen) {
      if (role === "Admin") {
        loadHotels();
      }
      if (role === "HotelAdmin") {
        loadHotelAdminHotels();
      }
    }
  }, [rowsPerPage, page, open, openDeleteDialog,imageDialogOpen]);

  const loadHotels = async (email, surname, flag, sortField, ascending) => {
    let requestEmail = email;
    let requestSurname = surname;
    if (flag === undefined) {
      requestEmail = hotelAdminEmail;
      requestSurname = hotelAdminSurname;
    }
    if (sortField === null || sortField === undefined) {
      sortField = currentSortField;
    }
    let requestAscending = (ascending || currentAscending) === "asc";
    await API.get(
      "/hotels/page",
      {
        params: {
          UserId: adminId,
          HotelName: hotelName,
          Email: requestEmail,
          Surname: requestSurname,
          PageNumber: pageForRequest,
          PageSize: rowsPerPage,
          SortField: sortField,
          Ascending: requestAscending,
        },
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
      .then((response) => response.data)
      .then((data) => {
        console.log(data.items);
        setHotels(data.items);
        setMaxNumberOfHotels(data.numberOfItems);
      })
      .catch((error) => {});
  };

  const loadHotelAdminHotels = async () => {
    await API.get("hotels/hotelAdmin/" + adminId + "/pages", {
      params: {
        PageNumber: pageForRequest,
        PageSize: rowsPerPage,
      },
    })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setHotels(data.items);
        setMaxNumberOfHotels(data.numberOfItems);
      })
      .catch((error) => console.log(error));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    SetPageForRequest(newPage + 1);
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
  }

  function handleCloseDeleteDialog() {
    setOpenDeleteDialog(false);
  }

  async function deleteHotel() {
    const DeleteHotel = async () => {
      await API.delete("/hotels/" + hotelId, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          handleClose();
          setAlertMessage("hotel deleted successfully", true);
          setAlertOpen(true);
        })
        .catch((error) => {
          callAlert(false);
        });
    };
    await DeleteHotel();
    handleCloseDeleteDialog();
  }

  function callAlertDialog(hotelId) {
    setHotelId(hotelId);
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

  function callAlert(message, successStatus) {
    setAlertMessage(message);
    setAlertSuccessStatus(successStatus);
    setAlertOpen(true);
  }

  function callImageDialog(hotel) {
    setHotel(hotel);
    setImageDialogOpen(true);
  }

  function handleCloseImageDialog() {
    setImageDialogOpen(false);
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
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
  function getValuesFromFilter(email, surname) {
    console.log(email);
    setHotelAdminEmail(email);
    setHotelAdminSurname(surname);
    loadHotels(email, surname, true);
  }
  function getValueFromHotelFilter(hotelName) {
    setHotelName(hotelName);
  }
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
    loadHotels(undefined, undefined, undefined, sortField, ascending);
  }

  if (!isLogged || role === "User") {
    return <Redirect to="/home"></Redirect>;
  }
  return (
    <>
      <Grid
        className={classes.grid}
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <HotelFilter
          getValuesFromFilter={getValueFromHotelFilter}
        ></HotelFilter>
        <UsersFilter
          getValuesFromFilter={getValuesFromFilter}
          isHotelAdmins={true}
        ></UsersFilter>
      </Grid>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="right" style={{ minWidth: 170 }}>
                  <TableSortLabel
                    active={currentSortField === "Name"}
                    direction={currentAscending}
                    onClick={() => orderBy("Name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" style={{ minWidth: 170 }}>
                  <TableSortLabel
                    active={currentSortField === "Location.Country"}
                    direction={currentAscending}
                    onClick={() => orderBy("Location.Country")}
                  >
                    Country
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" style={{ minWidth: 170 }}>
                  <TableSortLabel
                    active={currentSortField === "Location.City"}
                    direction={currentAscending}
                    onClick={() => orderBy("Location.City")}
                  >
                    City
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" style={{ minWidth: 170 }}>
                  <TableSortLabel
                    active={currentSortField === "Location.Street"}
                    direction={currentAscending}
                    onClick={() => orderBy("Location.Street")}
                  >
                    Street
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" style={{ minWidth: 170 }}>
                  <TableSortLabel
                    active={currentSortField === "Location.BuildingNumber"}
                    direction={currentAscending}
                    onClick={() => orderBy("Location.BuildingNumber")}
                  >
                    Building number
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ minWidth: 30 }} />
                <TableCell style={{ minWidth: 30 }} />
                <TableCell style={{ minWidth: 30 }} />
                <TableCell style={{ minWidth: 30 }} />
                <TableCell style={{ minWidth: 30 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {hotels.map((hotel) => (
                <TableRow key={hotel.id}>
                  <TableCell align="right">{hotel.name}</TableCell>
                  <TableCell align="right">{hotel.location.country}</TableCell>
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
                    <IconButton
                      color="inherit"
                      onClick={() => callImageDialog(hotel)}
                    >
                      <AddPhotoAlternateIcon></AddPhotoAlternateIcon>
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
      <BaseDialog
        title="create/update"
        open={open}
        handleClose={handleClose}
        form={flag ? component : form}
      ></BaseDialog>
      {!!hotel ? (
        <BaseImageDialog
          hotelId={hotel.id}
          open={imageDialogOpen}
          handleClose={handleCloseImageDialog}
          imageUrls={hotel.imageUrls}
        ></BaseImageDialog>
      ) : (
        ""
      )}
      <BaseDeleteDialog
        open={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        deleteItem={deleteHotel}
        title={"Are you sure to delete this hotel?"}
        message={"the hotel will be permanently deleted"}
      ></BaseDeleteDialog>
      <BaseAlert
        open={alertOpen}
        handleClose={handleCloseAlert}
        message={alertMessage}
        success={alertSuccessStatus}
      ></BaseAlert>
    </>
  );
}
