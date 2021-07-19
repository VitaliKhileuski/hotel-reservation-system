import { React, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import TableHead from "@material-ui/core/TableHead";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import API from "../../api";
import BaseDialog from "../shared/BaseDialog";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import BaseImageDialog from "../shared/BaseImageDialog";
import RoomFilter from "../Filters/RoomFilter";
import BaseAlert from "../shared/BaseAlert";
import AddRoomForm from "./AddRoomForm";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    minHeight: 500,
  },
  addHotelButton: {
    marginTop: 30,
  },
});

export default function RoomTable({ hotelId }) {
  const token = localStorage.getItem("token");
  const [rooms, setRooms] = useState([]);
  const [maxNumberOfRooms, setMaxNumberOfRooms] = useState(0);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [pageForRequest, SetPageForRequest] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [roomId, setRoomId] = useState(0);
  const [room, setRoom] = useState();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSuccessStatus, setAlertSuccessStatus] = useState(true);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentRoomNumber, setCurrentRoomNumber] = useState("");

  function callImageDialog(room) {
    setRoomId(room.id);
    setRoom(room);
    console.log(room);
    console.log(room.imageUrls);
    setImageDialogOpen(true);
  }

  function handleCloseImageDialog() {
    setImageDialogOpen(false);
  }

  const form = (
    <AddRoomForm
      handleClose={handleClose}
      hotelId={hotelId}
      room={room}
      callAlert={callAlert}
    ></AddRoomForm>
  );

  useEffect(() => {
    loadRooms();
  }, [rowsPerPage, page, openDialog, openDeleteDialog]);

  const loadRooms = async (roomNumber, flag) => {
    if (flag === undefined) {
      roomNumber = currentRoomNumber;
    }
    console.log(roomNumber);
    await API.get(
      "/rooms/" +
        hotelId +
        "?roomNumber=" +
        roomNumber +
        "&PageNumber=" +
        pageForRequest +
        "&PageSize=" +
        rowsPerPage
    )
      .then((response) => response.data)
      .then((data) => {
        setRooms(data.items);
        setMaxNumberOfRooms(data.numberOfItems);
      })
      .catch((error) => console.log(error.response.data.message));
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

  function OpenAddRoomDialog(room) {
    setRoom(room);
    setOpenDialog(true);
  }

  function handleClose() {
    setOpenDialog(false);
  }

  function callDeleteDialog(roomId) {
    setRoomId(roomId);
    setOpenDeleteDialog(true);
  }
  function handleCloseDeleteDialog() {
    setOpenDeleteDialog(false);
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

  function callAlert(message, successStatus) {
    setAlertMessage(message);
    setAlertSuccessStatus(successStatus);
    setAlertOpen(true);
  }

  async function deleteRoom() {
    const DeleteRoom = async () => {
      await API.delete("/rooms/" + roomId, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          callAlert("room deleted successfully", true);
        })
        .catch((error) => callAlert(false));
    };

    await DeleteRoom();
    handleCloseDeleteDialog();
  }

  function getValuesFromFilter(roomNumber) {
    setCurrentRoomNumber(roomNumber);
    loadRooms(roomNumber, true);
  }

  return (
    <>
      <RoomFilter
        hotelId={hotelId}
        getValuesFromFilter={getValuesFromFilter}
      ></RoomFilter>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="right" style={{ minWidth: 70 }}>
                  Room number
                </TableCell>
                <TableCell align="right" style={{ minWidth: 70 }}>
                  BedsNumber
                </TableCell>
                <TableCell align="right" style={{ minWidth: 70 }}>
                  Payment per day
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell align="right">{room.roomNumber}</TableCell>
                  <TableCell align="right">{room.bedsNumber}</TableCell>
                  <TableCell align="right">{room.paymentPerDay}</TableCell>
                  <TableCell>
                    <IconButton
                      color="inherit"
                      onClick={() => OpenAddRoomDialog(room)}
                    >
                      <EditIcon></EditIcon>
                    </IconButton>
                    <IconButton
                      color="inherit"
                      onClick={() => callDeleteDialog(room.id)}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                    <IconButton
                      color="inherit"
                      onClick={() => callImageDialog(room)}
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
          count={maxNumberOfRooms}
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
        onClick={OpenAddRoomDialog}
      >
        Create room
      </Button>
      <BaseDialog
        open={openDialog}
        handleClose={handleClose}
        form={form}
      ></BaseDialog>
      <BaseDeleteDialog
        open={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        deleteItem={deleteRoom}
        title={"Are you sure to delete this room?"}
        message={"room will be permanently deleted"}
      ></BaseDeleteDialog>
      <BaseImageDialog
        roomId={roomId}
        open={imageDialogOpen}
        handleClose={() => handleCloseImageDialog()}
        imageUrls={!!room ? room.imageUrls : undefined}
        filesLimit={5}
      ></BaseImageDialog>
      <BaseAlert
        open={alertOpen}
        handleClose={handleCloseAlert}
        message={alertMessage}
        success={alertSuccessStatus}
      ></BaseAlert>
    </>
  );
}
