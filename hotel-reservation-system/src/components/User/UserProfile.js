import { React, useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { useSelector } from "react-redux";
import API from "../../api";
import profileImage from "./../../img/userProfile.png";
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
              <Typography
                style={{ margin: 30 }}
                variant="h5"
                color={isVerified ? "primary" : "error"}
              >
                {isVerified ? "verified" : "you are not verified"}
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
                  style={{ marginRight: 20 }}
                  variant="contained"
                  onClick={changePassword}
                  color="primary"
                >
                  Change password
                </Button>
                {isVerified ? (
                  ""
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleClickEmailVerification}
                    color="primary"
                  >
                    Verificate email
                  </Button>
                )}
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
