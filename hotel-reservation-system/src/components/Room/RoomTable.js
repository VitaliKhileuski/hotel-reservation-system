import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import BaseImageDialog from "../shared/BaseImageDialog";
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
import BaseDialog from "../shared/BaseDialog";
import AddRoomForm from "./AddRoomForm";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import BaseAlert from "../shared/BaseAlert";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";

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
  const [currentRoomImages, setCurrentRoomImages] = useState([]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSuccessStatus, setAlertSuccessStatus] = useState(true);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

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
      handleClose={() => handleClose()}
      hotelId={hotelId}
      room={room}
      callAlert={callAlert}
    ></AddRoomForm>
  );

  useEffect(() => {
    const loadRooms = async () => {
      await API.get(
        "/rooms/" +
          hotelId +
          "/?PageNumber=" +
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
    loadRooms();
  }, [rowsPerPage, page, openDialog, openDeleteDialog]);

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
        .catch((error) =>
          callAlert(false)
        );
    };

    await DeleteRoom();
    handleCloseDeleteDialog();
  }

  return (
    <>
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
        onClick={() => OpenAddRoomDialog()}
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
