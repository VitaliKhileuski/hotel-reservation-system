import { React, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import profileImage from "./../../img/userProfile.png";
import { Grid, Typography, Paper, Button } from "@material-ui/core";
import { display } from "@material-ui/system";
import { useSelector } from "react-redux";
import API from "../../api";
import UpdateUserForm from "./../User/UpdateUserForm";
import ChangePasswordForm from "./../User/ChangePasswordForm";
import BaseDialog from "../shared/BaseDialog";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function UserProfile({}) {
  const classes = useStyles();
  const userId = useSelector((state) => state.userId);
  const [user, setUser] = useState();
  const token = localStorage.getItem("token");
  const [updateUserDialogOpen, setUpdateUserDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordOpen] = useState(false);
  const updateUserForm = (
    <UpdateUserForm
      changeFlag={changeflagForRerender}
      handleClose={handlecloseUpdateUserDialog}
      user={user}
    ></UpdateUserForm>
  );
  const changePasswordForm = (
    <ChangePasswordForm
      user={user}
      handleClose={handlecloseChangePassword}
    ></ChangePasswordForm>
  );
  const [flagForRerender, setFlagForRerender] = useState(false);
  useEffect(async () => {
    const loadUser = async () => {
      await API.get("/users/" + userId, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          setUser(data);
          console.log(data);
        })
        .catch((error) => console.log(error.response.data.message));
    };
    if (!!userId && flagForRerender === false) {
      await loadUser();
      setFlagForRerender(true);
    }
  }, [userId, updateUserDialogOpen, flagForRerender]);

  function handlecloseUpdateUserDialog() {
    setUpdateUserDialogOpen(false);
  }
  function handlecloseChangePassword() {
    setChangePasswordOpen(false);
  }

  function changeflagForRerender() {
    setFlagForRerender(false);
  }

  function editProfile() {
    setUpdateUserDialogOpen(true);
  }
  function changePassword() {
    setChangePasswordOpen(true);
  }

  return (
    <>
      <Grid
        container
        direction="row"
        style={{ marginTop: 30 }}
        justify="center"
        lignItems="center"
      >
        <Grid sm={4} item>
          <img src={profileImage}></img>
        </Grid>
        <Grid item sm={4}>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="flex-start"
          >
            <Paper>
              <Typography style={{ margin: 30 }} variant="h5" color="primary">
                Email: {!!user ? user.email : ""}
              </Typography>
              <Typography style={{ margin: 30 }} variant="h5" color="primary">
                Phone number : {!!user ? user.phoneNumber : ""}
              </Typography>
              <Typography style={{ margin: 30 }} variant="h5" color="primary">
                Name: {!!user ? user.name : ""}
              </Typography>
              <Typography style={{ margin: 30 }} variant="h5" color="primary">
                Surname: {!!user ? user.surname : ""}
              </Typography>
              <Typography variant="h5" color="primary"></Typography>
              <div
                style={
                  ({ margin: 30 },
                  { display: "flex" },
                  { justifyContent: "space-around" })
                }
              >
                <Button
                  variant="contained"
                  onClick={editProfile}
                  style={{ marginRight: 20 }}
                  color="primary"
                >
                  Edit profile
                </Button>
                <Button
                  variant="contained"
                  onClick={changePassword}
                  color="primary"
                >
                  Change password
                </Button>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <BaseDialog
        open={updateUserDialogOpen}
        handleClose={handlecloseUpdateUserDialog}
        form={updateUserForm}
        title="Update"
      ></BaseDialog>
      <BaseDialog
        open={changePasswordDialogOpen}
        handleClose={handlecloseChangePassword}
        form={changePasswordForm}
        title="Change password"
      ></BaseDialog>
    </>
  );
}
