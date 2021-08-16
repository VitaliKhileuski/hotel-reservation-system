import { React, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { useSelector } from "react-redux";
import API from "../../api";
import profileImage from "./../../img/userProfile.png";
import Skeleton from "@material-ui/lab/Skeleton";
import UpdateUserForm from "./../User/UpdateUserForm";
import ChangePasswordForm from "./../User/ChangePasswordForm";
import BaseDialog from "../shared/BaseDialog";
import EmailVerification from "./EmailVerification";

export default function UserProfile() {
  const userId = useSelector((state) => state.tokenData.userId);
  const [user, setUser] = useState();
  const token = localStorage.getItem("token");
  const [updateUserDialogOpen, setUpdateUserDialogOpen] = useState(false);
  const [verificateEmailDialogOpen, setVerificateEmailDialogOpen] =
    useState(false);
  const [changePasswordDialogOpen, setChangePasswordOpen] = useState(false);
  const [flagForRerender, setFlagForRerender] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

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
  const emailVerificationForm = (
    <EmailVerification
      userId={userId}
      handleClose={handleCloseVerificationEmailDialog}
    ></EmailVerification>
  );

  useEffect(async () => {
    const loadUser = async () => {
      await API.get("/users/" + userId, {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          setUser(data);
          setIsVerified(data.isVerified);
          console.log(data);
        })
        .catch((error) => console.log(error.response.data.message));
    };
    if (!!userId && !flagForRerender) {
      await loadUser();
      setFlagForRerender(true);
    }
  }, [userId, updateUserDialogOpen, flagForRerender]);

  function handleCloseVerificationEmailDialog() {
    setVerificateEmailDialogOpen(false);
    setFlagForRerender(false);
  }

  function handleClickEmailVerification() {
    setVerificateEmailDialogOpen(true);
  }

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
        alignItems="center"
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
            {!!user ? (
              <Paper style={{ width: "100%", height: "50%", padding: 20 }}>
                <Grid container direction="row">
                  <Grid
                    container
                    sm={6}
                    direction="column"
                    spacing={3}
                    justify="flex-start"
                    alignItems="flex-start"
                  >
                    <Grid item>
                      <Typography variant="h5" color="primary">
                        Email:
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h5" color="primary">
                        Phone number:
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h5" color="primary">
                        Name:
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h5" color="primary">
                        Surname:
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="h5"
                        color={isVerified ? "primary" : "error"}
                      >
                        {isVerified ? "verified" : "you are not verified"}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    sm={6}
                    direction="column"
                    spacing={3}
                    justify="flex-start"
                    alignItems="flex-start"
                  >
                    <Grid item>
                      <Typography variant="h5" color="primary">
                        {user.email}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h5" color="primary">
                        {user.phoneNumber}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h5" color="primary">
                        {user.name}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h5" color="primary">
                        {user.surname}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  style={{ marginTop: 50 }}
                  alignItems="center"
                  justify="center"
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={editProfile}
                      style={{ marginRight: 20 }}
                      color="primary"
                    >
                      Edit profile
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      style={{ marginRight: 20 }}
                      variant="contained"
                      onClick={changePassword}
                      color="primary"
                    >
                      Change password
                    </Button>
                  </Grid>
                  {isVerified ? (
                    ""
                  ) : (
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={handleClickEmailVerification}
                        color="primary"
                      >
                        Verificate email
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            ) : (
              <Skeleton width="100%" height={400} variant="rect"></Skeleton>
            )}
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
        open={verificateEmailDialogOpen}
        handleClose={handleCloseVerificationEmailDialog}
        form={emailVerificationForm}
        title="email verification"
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
