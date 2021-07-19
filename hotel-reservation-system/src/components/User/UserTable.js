import { React, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Grid from "@material-ui/core/Grid";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import API from "../../api";
import BaseDialog from "../shared/BaseDialog";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import Register from "./../Authorization/Register";
import UsersFilter from "../Filters/UserFilter";
import BaseAlert from "../shared/BaseAlert";

const useStyles = makeStyles({
  root: {
    width: "100%",
    margin: 10,
  },
  container: {
    minHeight: 500,
  },
  addButton: {
    marginTop: 30,
  },
  grid: {
    margin: 15,
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
  },
});

export default function UserTable() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [maxNumberOfUsers, setMaxNumberOfUsers] = useState(0);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [pageForRequest, SetPageForRequest] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userId, setUserId] = useState();
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userSurname, setUserSurname] = useState("");
  const [alertSuccessStatus, setAlertSuccessStatus] = useState(true);
  const form = <Register handleClose={handleCloseAddUserDialog}></Register>;

  useEffect(() => {
    if (deleteDialogOpen === false && addUserDialogOpen === false) {
      loadUsers();
    }
  }, [rowsPerPage, page, deleteDialogOpen, addUserDialogOpen]);

  const loadUsers = async (email, surname, flag) => {
    if (flag === undefined) {
      email = userEmail;
      surname = userSurname;
    }
    if (email === undefined) {
      email = "";
    }
    if (surname === undefined) {
      surname = "";
    }

    await API.get(
      "/users/" +
        "?email=" +
        email +
        "&surname=" +
        surname +
        "&PageNumber=" +
        pageForRequest +
        "&PageSize=" +
        rowsPerPage,
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
      .then((response) => response.data)
      .then((data) => {
        setUsers(data.items);
        setMaxNumberOfUsers(data.numberOfItems);
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

  async function deleteUser() {
    const DeleteUser = async () => {
      await API.delete("/users/" + userId, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          callAlert("user deleted successfully", true);
        })
        .catch((error) => callAlert(false));
    };
    await DeleteUser();
    handleCloseDeleteDialog();
    setUserId(undefined);
  }

  function deleteUserById(userId) {
    setUserId(userId);
    setDeleteDialogOpen(true);
  }

  function handleCloseDeleteDialog() {
    setDeleteDialogOpen(false);
  }

  function openAddUserDialog() {
    setAddUserDialogOpen(true);
  }

  function handleCloseAddUserDialog() {
    setAddUserDialogOpen(false);
  }
  function getValuesFromFilter(email, surname) {
    setUserEmail(email);
    setUserSurname(surname);
    loadUsers(email, surname, true);
  }

  return (
    <>
      <Grid
        container
        className={classes.grid}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <UsersFilter getValuesFromFilter={getValuesFromFilter}></UsersFilter>
      </Grid>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="right" style={{ minWidth: 100 }}>
                  Role
                </TableCell>
                <TableCell align="right" style={{ minWidth: 150 }}>
                  Email
                </TableCell>
                <TableCell align="right" style={{ minWidth: 150 }}>
                  Name
                </TableCell>
                <TableCell align="right" style={{ minWidth: 150 }}>
                  Surname
                </TableCell>
                <TableCell align="right" style={{ minWidth: 150 }}>
                  Phone number
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell align="right">{user.role.name}</TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                  <TableCell align="right">{user.name}</TableCell>
                  <TableCell align="right">{user.surname}</TableCell>
                  <TableCell align="right">{user.phoneNumber}</TableCell>
                  <TableCell>
                    {user.role.name !== "Admin" ? (
                      <IconButton
                        color="inherit"
                        onClick={() => deleteUserById(user.id)}
                      >
                        <DeleteIcon></DeleteIcon>
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 50]}
          component="div"
          count={maxNumberOfUsers}
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
        className={classes.addButton}
        onClick={openAddUserDialog}
      >
        Add User
      </Button>
      <BaseDeleteDialog
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        title="delete user"
        message="user and his orders will be permanently deleted"
        deleteItem={deleteUser}
        open={deleteDialogOpen}
      ></BaseDeleteDialog>
      <BaseDialog
        title="Add User"
        open={addUserDialogOpen}
        form={form}
        handleClose={handleCloseAddUserDialog}
      ></BaseDialog>
      <BaseAlert
        message={alertMessage}
        open={alertOpen}
        success={alertSuccessStatus}
        handleClose={handleCloseAlert}
      ></BaseAlert>
    </>
  );
}
