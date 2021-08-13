import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import Button from "@material-ui/core/Button";
import { ERROR_STRINGS } from "../../constants/ErrorStrings";
import { HOME_PATH } from "../../constants/RoutingPaths";

const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: "15%",
  },
}));

export default function NotFoundErrorPage() {
  const classes = useStyles();
  const history = useHistory();

  function toHomePage() {
    history.push({
      pathname: HOME_PATH,
    });
  }

  return (
    <Grid className={classes.content} container direction="column" spacing={3}>
      <Grid item>
        <Typography variant="h5">{ERROR_STRINGS.NOT_FOUND}</Typography>
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={toHomePage} color="primary">
          To home page
        </Button>
      </Grid>
    </Grid>
  );
}
