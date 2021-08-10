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
import Tooltip from "@material-ui/core/Tooltip";
import { useSelector, useDispatch } from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import API from "../../api";
import BaseDialog from "../shared/BaseDialog";
import CallAlert from "../../Notifications/NotificationHandler";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import BaseImageDialog from "../shared/BaseImageDialog";
import RoomFilter from "../Filters/RoomFilter";
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
  const dispatch = useDispatch();
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
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentSortField, setCurrentSortField] = useState("");
  const [currentAscending, setCurrentAscending] = useState("");
  const [currentRoomNumber, setCurrentRoomNumber] = useState("");
  const userId = useSelector((state) => state.tokenData.userId);
  const [filterFlag, setFilterFlag] = useState(true);

  function callImageDialog(room) {
    setRoomId(room.id);
    setRoom(room);
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
    ></AddRoomForm>
  );

  useEffect(() => {
    if (filterFlag) {
      loadRooms();
    }
  }, [rowsPerPage, page, openDialog, openDeleteDialog]);

  const loadRooms = async (
    roomNumber,
    flag,
    pageNumber,
    sortField,
    ascending
  ) => {
    let requestRoomNumber = roomNumber;
    let requestPageNumber = !!pageNumber ? pageNumber : pageForRequest;
    if (flag === undefined) {
      requestRoomNumber = currentRoomNumber;
    }

    if (sortField === null || sortField === undefined) {
      sortField = currentSortField;
    }
    let requestAscending = (ascending || currentAscending) === "asc";
    await API.get("/rooms/" + hotelId, {
      params: {
        UserId: userId,
        RoomNumber: requestRoomNumber,
        PageNumber: requestPageNumber,
        PageSize: rowsPerPage,
        SortField: sortField,
        Ascending: requestAscending,
      },
    })
      .then((response) => response.data)
      .then((data) => {
        setRooms(data.items);
        setMaxNumberOfRooms(data.numberOfItems);
      })
      .catch((error) => console.log(error.response.data.message));
    setFilterFlag(true);
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
    loadRooms(undefined, undefined, undefined, sortField, ascending);
  }

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
    console.log(room);
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

  async function deleteRoom() {
    const DeleteRoom = async () => {
      await API.delete("/rooms/" + roomId, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          CallAlert(dispatch, true, "room deleted successfully");
        })
        .catch((error) => CallAlert(dispatch, false));
    };

    await DeleteRoom();
    handleCloseDeleteDialog();
  }

  function getValuesFromFilter(roomNumber) {
    setFilterFlag(false);
    setPage(0);
    SetPageForRequest(1);
    setCurrentRoomNumber(roomNumber);
    loadRooms(roomNumber, true, 1);
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
                  <TableSortLabel
                    active={currentSortField === "RoomNumber"}
                    direction={currentAscending}
                    onClick={() => orderBy("RoomNumber")}
                  >
                    Room Number
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" style={{ minWidth: 70 }}>
                  <TableSortLabel
                    active={currentSortField === "BedsNumber"}
                    direction={currentAscending}
                    onClick={() => orderBy("BedsNumber")}
                  >
                    Beds amount
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" style={{ minWidth: 70 }}>
                  <TableSortLabel
                    active={currentSortField === "PaymentPerDay"}
                    direction={currentAscending}
                    onClick={() => orderBy("PaymentPerDay")}
                  >
                    Payment per day
                  </TableSortLabel>
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
                    <Tooltip title="edit">
                      <IconButton
                        color="inherit"
                        onClick={() => OpenAddRoomDialog(room)}
                      >
                        <EditIcon></EditIcon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="delete">
                      <IconButton
                        color="inherit"
                        onClick={() => callDeleteDialog(room.id)}
                      >
                        <DeleteIcon></DeleteIcon>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="add images to room">
                      <IconButton
                        color="inherit"
                        onClick={() => callImageDialog(room)}
                      >
                        <AddPhotoAlternateIcon></AddPhotoAlternateIcon>
                      </IconButton>
                    </Tooltip>
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
    </>
  );
}
