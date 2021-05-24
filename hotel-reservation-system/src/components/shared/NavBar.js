import React from 'react';
import './../../css/App.css'
import { Link } from 'react-router-dom'
import { AppBar,Button,Toolbar,Typography} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import {useSelector} from 'react-redux'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
const useStyles = makeStyles((theme) => ({
  root : {
    flexGrow : 1
  },
  title: {
    flexGrow: 1,
  },
  navElement: {
    marginLeft: theme.spacing(1),
  },
}));

function NavBar() {
  const classes = useStyles();
  const isLogged = useSelector((state) => state.isLogged);
  const name = useSelector((state) => state.name);
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography align='left' variant="h6" className={classes.title}>
              Hotels
            </Typography>
              {isLogged ? (<>
                <AccountCircleIcon/>
              <Typography className={classes.navElement}>
              {name}
              </Typography>
              </>
                ) : (<>
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
            </>
              )} 
          </Toolbar>
        </AppBar>
      </div>
        
    )
};
export default NavBar;