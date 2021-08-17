import { React, useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { ClickAwayListener } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { ADMIN, USER } from "../../constants/Roles";
import { logout } from "../Authorization/TokenData";
import {
  HOME_PATH,
  USERS_PATH,
  ORDERS_PATH,
  OWNED_HOTELS_PATH,
  USER_PROFILE_PATH,
  REVIEWS_MANAGMENT_PATH,
} from "./../../constants/RoutingPaths";
import "./../../css/App.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 5,
  },
  title: {
    flexGrow: 1,
    cursor: "pointer",
  },
  navElement: {
    marginLeft: theme.spacing(1),
  },
  link: {
    textDecoration: "none",
  },
}));
export default function NavBar() {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const classes = useStyles();
  const isLogged = useSelector((state) => state.tokenData.isLogged);
  const role = useSelector((state) => state.tokenData.role);
  const name = useSelector((state) => state.tokenData.name);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  console.log(isLogged);
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
      pathname: HOME_PATH,
    });
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            as={Button}
            onClick={toHomePage}
            align="left"
            variant="h6"
            className={classes.title}
          >
            Hotels
          </Typography>
          {isLogged ? (
            <div style={{ marginRight: 30 }}>
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
                          <Link to={USER_PROFILE_PATH} className={classes.link}>
                            <MenuItem onClick={handleClose}>
                              User profile
                            </MenuItem>
                          </Link>
                          {role === ADMIN ? (
                            <>
                              <Link to={USERS_PATH} className={classes.link}>
                                <MenuItem onClick={handleClose}>Users</MenuItem>
                              </Link>
                              <Link
                                to={REVIEWS_MANAGMENT_PATH}
                                className={classes.link}
                              >
                                <MenuItem onClick={handleClose}>
                                  Reviews managment
                                </MenuItem>
                              </Link>
                            </>
                          ) : (
                            ""
                          )}
                          <Link to={ORDERS_PATH} className={classes.link}>
                            <MenuItem onClick={handleClose}>Orders</MenuItem>
                          </Link>
                          {role !== USER ? (
                            <Link
                              to={OWNED_HOTELS_PATH}
                              className={classes.link}
                            >
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
                              logout(history);
                            }}
                            style={{ color: "blue" }}
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
