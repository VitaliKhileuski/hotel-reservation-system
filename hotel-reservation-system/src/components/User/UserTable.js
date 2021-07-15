import { React, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper"
import IconButton from "@material-ui/core/IconButton"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TablePagination from "@material-ui/core/TablePagination"
import TableRow from "@material-ui/core/TableRow"
import Button from "@material-ui/core/Button"
import DeleteIcon from "@material-ui/icons/Delete";
import API from "../../api";
import BaseDialog from "../shared/BaseDialog";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import Register from "./../Authorization/Register";

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
});

export default function UserTable({ hotelId }) {
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
  const form = <Register handleClose={handleCloseAddUserDialog}></Register>;

  useEffect(() => {
    const loadUsers = async () => {
      await API.get(
        "/users/" +
          "?PageNumber=" +
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
    if (
      deleteDialogOpen === false &&
      addUserDialogOpen === false &&
      userId === undefined
    ) {
      loadUsers();
    }
  }, [rowsPerPage, page, deleteDialogOpen, addUserDialogOpen]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    SetPageForRequest(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    SetPageForRequest(1);
  };

  async function deleteUser() {
    const DeleteUser = async () => {
      await API.delete("/users/" + userId, {
        headers: { Authorization: "Bearer " + token },
      }).catch((error) => console.log(error.response.data.message));
    };
    DeleteUser();
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

  return (
    <>
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
    </>
  );
}