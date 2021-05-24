import React from 'react';
import './../../css/App.css'
import { Link } from 'react-router-dom'
import { AppBar,Button,Toolbar,Typography} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  navElement: {
    marginRight: theme.spacing(2),
  },
}));

function NavBar() {
  const classes = useStyles();

    return (
        <AppBar position="static">
  <Toolbar>
    <Typography variant="h6" className={classes.title}>
      Hotels
    </Typography>
    <Link to="/login"  style={{ textDecoration: 'none' }}>
    <Button variant="contained" color="primary" disableElevation>
        Sign in
      </Button>
    </Link >
    <Link to="/register"  style={{ textDecoration: 'none' }}>
      <Button variant="contained" color="primary" disableElevation>
        Sign up
      </Button>
    </Link>
  </Toolbar>
</AppBar>
    )
};
export default NavBar;