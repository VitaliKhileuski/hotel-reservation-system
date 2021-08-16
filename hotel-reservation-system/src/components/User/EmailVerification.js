import { React, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import API from "./../../api/";
import moment from 'moment'
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

export default function EmailVerification() {
  const classes = useStyles();
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCodeErrorLabel, setVerificationCodeErrorLabel] = useState("")
  const [passwordErrorLabel, setPasswordErrorLabel] = useState("");
  const token = localStorage.getItem("token");
  const [seconds, setSeconds ] = useState()
  const [minutes, setMinutes] = useState()


  useEffect(() => {
      console.log("sdfsdf")
    startTimer(300);
  }, []);
  
  function startTimer(duration) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        setSeconds(seconds);
        setMinutes(minutes);

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}
 

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
            <div className={classes.form}>
              <Grid container spacing={2}>
                  <Grid item xs={12}>
                      <Typography variant='h6'>We sent to your email verification code. Please, write it below.
                      <br></br> You you can get new code after {minutes}:{seconds}</Typography>
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
              <Button
                onClick={() => startTimer(300)}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Send
              </Button>
            </div>
      </div>
      <Box mt={5}></Box>
    </Container>
  );
}
