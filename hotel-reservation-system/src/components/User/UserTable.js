import { React, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import API from "../../api";
import callAlert from "../../Notifications/NotificationHandler";
import BaseDialog from "../shared/BaseDialog";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import Register from "./../Authorization/Register";
import UsersFilter from "../Filters/UserFilter";
import { ADMIN } from "../../constants/Roles";

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
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [maxNumberOfUsers, setMaxNumberOfUsers] = useState(0);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [pageForRequest, SetPageForRequest] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userId, setUserId] = useState();
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userSurname, setUserSurname] = useState("");
  const [currentSortField, setCurrentSortField] = useState("");
  const [currentAscending, setCurrentAscending] = useState("");
  const [filterFlag, setFilterFlag] = useState(true);

  const form = <Register handleClose={handleCloseAddUserDialog}></Register>;

  useEffect(() => {
    if (!deleteDialogOpen && !addUserDialogOpen && filterFlag) {
      loadUsers();
    }
  }, [rowsPerPage, page, deleteDialogOpen, addUserDialogOpen]);

  const loadUsers = async (
    sortField,
    ascending,
    email,
    surname,
    flag,
    pageNumber
  ) => {
    let requestEmail = email;
    let requestSurname = surname;
    let requestPageNumber = !!pageNumber ? pageNumber : pageForRequest;
    if (flag === undefined) {
      requestEmail = userEmail;
      requestSurname = userSurname;
    }
    if (sortField === null || sortField === undefined) {
      sortField = currentSortField;
    }
    let requestAscending = (ascending || currentAscending) === "asc";
    await API.get("/users", {
      params: {
        Email: requestEmail,
        Surname: requestSurname,
        PageNumber: requestPageNumber,
        PageSize: rowsPerPage,
        SortField: sortField,
        Ascending: requestAscending,
      },
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setUsers(data.items);
        setMaxNumberOfUsers(data.numberOfItems);
      })
      .catch((error) => console.log(error.response.data.message));
    setFilterFlag(true);
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

  async function deleteUser() {
    const DeleteUser = async () => {
      await API.delete("/users/" + userId, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          callAlert(true, "user deleted successfully");
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
    console.log(email);
    setFilterFlag(false);
    setPage(0);
    SetPageForRequest(1);
    setUserEmail(email);
    setUserSurname(surname);
    loadUsers(undefined, "asc", email, surname, true, 1);
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
    loadUsers(sortField, ascending);
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
                  <TableSortLabel
                    active={currentSortField === "Role.Name"}
                    direction={currentAscending}
                    onClick={() => orderBy("Role.Name")}
                  >
                    Role
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" style={{ minWidth: 150 }}>
                  <TableSortLabel
                    active={currentSortField === "Email"}
                    direction={currentAscending}
                    onClick={() => orderBy("Email")}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" style={{ minWidth: 150 }}>
                  <TableSortLabel
                    active={currentSortField === "Name"}
                    direction={currentAscending}
                    onClick={() => orderBy("Name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" style={{ minWidth: 150 }}>
                  <TableSortLabel
                    active={currentSortField === "Surname"}
                    direction={currentAscending}
                    onClick={() => orderBy("Surname")}
                  >
                    Surname
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" style={{ minWidth: 150 }}>
                  <TableSortLabel
                    active={currentSortField === "PhoneNumber"}
                    direction={currentAscending}
                    onClick={() => orderBy("PhoneNumber")}
                  >
                    Phone number
                  </TableSortLabel>
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
                    {user.role.name !== ADMIN ? (
                      <Tooltip title="delete">
                        <IconButton
                          color="inherit"
                          onClick={() => deleteUserById(user.id)}
                        >
                          <DeleteIcon></DeleteIcon>
                        </IconButton>
                      </Tooltip>
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
