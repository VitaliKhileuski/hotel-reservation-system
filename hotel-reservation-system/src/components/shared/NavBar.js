import { React, useState, useRef, useEffect } from "react";
import "./../../css/App.css";
import { Link, Redirect, useHistory } from "react-router-dom";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  MenuItem,
  MenuList,
  Popper,
  ClickAwayListener,
  Paper,
  Grow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useDispatch } from "react-redux";
import { Logout } from "../Authorization/TokenData";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  navElement: {
    marginLeft: theme.spacing(1),
  },
  link: {
    textDecoration: "none",
  },
}));
export default function NavBar() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const classes = useStyles();
  const isLogged = useSelector((state) => state.isLogged);
  const role = useSelector((state) => state.role);

  const name = useSelector((state) => state.name);
  useSelector((state) => console.log(state));
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    console.log(role);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }
  function toHomePage() {
    history.push({
      pathname: "/home",
    });
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            onClick={toHomePage}
            align="left"
            variant="h6"
            className={classes.title}
          >
            Hotels
          </Typography>
          {isLogged ? (
            <div>
              <Button
                ref={anchorRef}
                style={{ color: "white" }}
                aria-controls={open ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <AccountCircleIcon />
                <Typography className={classes.navElement}>{name}</Typography>
              </Button>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                style={{ zIndex: 3 }}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDown}
                        >
                          <Link to="/userProfile" className={classes.link}>
                            <MenuItem onClick={handleClose}>
                              User profile
                            </MenuItem>
                          </Link>
                          {role === "Admin" ? (
                            <Link to="/users" className={classes.link}>
                              <MenuItem onClick={handleClose}>Users</MenuItem>
                            </Link>
                          ) : (
                            ""
                          )}
                          <Link to="/orders" className={classes.link}>
                            <MenuItem onClick={handleClose}>Orders</MenuItem>
                          </Link>
                          {role !== "User" ? (
                            <Link to="/ownedHotels" className={classes.link}>
                              <MenuItem onClick={handleClose}>
                                Owned hotels
                              </MenuItem>
                            </Link>
                          ) : (
                            ""
                          )}
                          <MenuItem
                            onClick={(e) => {
                              handleClose(e);
                              Logout(dispatch, history);
                            }}
                          >
                            Logout
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button variant="contained" color="primary" disableElevation>
                  Sign in
                </Button>
              </Link>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <Button variant="contained" color="primary" disableElevation>
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
