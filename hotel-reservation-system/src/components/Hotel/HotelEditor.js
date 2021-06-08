import {React, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AddHotelForm from './AddHotelForm';
import BaseAlert from './../shared/BaseAlert'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 3,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
}));

export default function HotelEditor(props) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [hotel,setHotel] = useState(props.location.state.hotel);
  const [updateAlertOpen, setUpdateAlertOpen] = useState(false);
  console.log(props);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function callUpdateAlert(){
    setUpdateAlertOpen(true);
  }
  
  const handleCloseUpdateAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setUpdateAlertOpen(false);
  }
  function toRoomSection(){
    setValue(1);
  }

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"

        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="Main Info"/>
        <Tab label="Rooms"/>
        <Tab label="Services"/>
      </Tabs>
      <TabPanel value={value} index={0}>
        <AddHotelForm toRoomSection ={toRoomSection} hotel = {hotel} callUpdateAlert={callUpdateAlert}></AddHotelForm>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Rooms
      </TabPanel>
      <TabPanel value={value} index={2}>
        Services
      </TabPanel>
      <BaseAlert open ={updateAlertOpen}  handleClose ={handleCloseUpdateAlert} message = {'hotel updated succesfully'}></BaseAlert>
    </div>
  );
}