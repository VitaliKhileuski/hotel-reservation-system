import React from 'react';
import './../../css/App.css'
import { Link } from 'react-router-dom'
import { AppBar,Button,Toolbar,IconButton, Typography} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  navElement: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [
      theme.breakpoints.up('sm')]: {
        display: 'block',
    },
  }
}));

function NavBar() {
  const classes = useStyles();

    return (
        <AppBar position="static">
  <Toolbar>
    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
      <MenuIcon/>
    </IconButton>
    <Typography variant="h6" className="title">
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