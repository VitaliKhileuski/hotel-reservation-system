import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button,Dialog,AppBar,Typography, } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function BaseAddDialog({open,handleClose,form}) {
  const classes = useStyles();


  return (
      <Dialog  open={open} onClose={() => handleClose()} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
          <Typography variant="h6" className={classes.title}>
              Create/Update
            </Typography>
            <IconButton edge="end" color="inherit" onClick={() => handleClose()} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {form}
      </Dialog>
  );
}