import { React, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import API from "./../../api/";
import moment from "moment";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function EmailVerification({ userId, handleClose }) {
  const classes = useStyles();
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCodeErrorLabel, setVerificationCodeErrorLabel] =
    useState("");
  const token = localStorage.getItem("token");
  const [seconds, setSeconds] = useState();
  const [minutes, setMinutes] = useState();

  useEffect(() => {
    sendEmailWithVerificationCode();
  }, []);

  function startTimer(duration) {
    let timer = duration,
      minutes,
      seconds;
    const timerId = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      setSeconds(seconds);
      setMinutes(minutes);

      if (--timer < 0) {
        setSeconds();
        setMinutes();
        clearInterval(timerId);
      }
    }, 1000);
  }

  const sendEmailWithVerificationCode = async () => {
    await API.post("/emailVerification/" + userId, null, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setMinutes();
        setSeconds();
        startTimer(30);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkVerificationCode = async () => {
    await API.put("/emailVerification/" + userId, null, {
      headers: { Authorization: "Bearer " + token },
      params: { verificationCode: verificationCode },
    })
      .then((response) => response.data)
      .then((data) => {
        if (data) {
          handleClose();
        }
      })
      .catch((error) => {
        setVerificationCodeErrorLabel(error.response.data.Message);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                We sent to your email verification code. Please, write it below.
              </Typography>
              <br></br>
              {!!minutes && !!seconds ? (
                <Typography variant="h6">
                  You can get new code after {minutes}:{seconds}
                </Typography>
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="verificationCode"
                label="verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                error={!!verificationCodeErrorLabel}
                helperText={verificationCodeErrorLabel}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                disabled={!!minutes || !!seconds}
                onClick={sendEmailWithVerificationCode}
                color="primary"
                className={classes.submit}
              >
                send code again
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                disabled={verificationCode === ""}
                fullWidth
                onClick={checkVerificationCode}
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
      <Box mt={5}></Box>
    </Container>
  );
}
