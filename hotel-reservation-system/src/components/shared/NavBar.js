import {React , useState, useRef, useEffect} from 'react';
import './../../css/App.css'
import { Link } from 'react-router-dom'
import { AppBar,Button,Toolbar,Typography, MenuItem , MenuList, Popper, ClickAwayListener, Paper, Grow} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import {useSelector} from 'react-redux'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {useDispatch} from 'react-redux'
import {IS_LOGGED, NAME} from './../../storage/actions/actionTypes'
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
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const classes = useStyles();
  const isLogged = useSelector((state) => state.isLogged);
  
  const name = useSelector((state) => state.name);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }
  
  // return focus to the button when we transitioned from !open -> open


   const Logout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    dispatch({ type: IS_LOGGED, isLogged: false });
    dispatch({ type: NAME, name: '' });
  }
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography align='left' variant="h6" className={classes.title}>
              Hotels
            </Typography>
              {isLogged ? (
                <div>
                <Button
                  ref={anchorRef}
                  style={{ color: 'white' }}
                  aria-controls={open ? 'menu-list-grow' : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                >
                  <AccountCircleIcon/>
              <Typography className={classes.navElement}>
              {name}
              </Typography>
                </Button>
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick ={(e) => {handleClose(e);Logout();}} >Logout</MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
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