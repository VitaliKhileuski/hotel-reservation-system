import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import Button from "@material-ui/core/Button";
import { ERROR_STRINGS } from "../../constants/ErrorStrings";
import {
  HOME_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
} from "../../constants/RoutingPaths";

const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: "15%",
  },
}));

export default function ForbiddenPage() {
  const history = useHistory();
  const classes = useStyles();

  function toHomePage() {
    history.push({
      pathname: HOME_PATH,
    });
  }

  function toLoginPage() {
    history.push({
      pathname: LOGIN_PATH,
    });
  }

  function toRegisterPage() {
    history.push({
      pathname: REGISTER_PATH,
    });
  }

  return (
    <Grid container direction="column" spacing={4} className={classes.content}>
      <Grid item>
        <Typography variant="h4">{ERROR_STRINGS.NOT_AUTHORIZED}</Typography>
      </Grid>
      <Grid item>
        <Grid
          container
          align="center"
          justify="center"
          direction="row"
          spacing={3}
        >
          <Grid item>
            <Button onClick={toHomePage} variant="contained" color="primary">
              to home page
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={toLoginPage} variant="contained" color="primary">
              login
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={toRegisterPage}
              variant="contained"
              color="primary"
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
