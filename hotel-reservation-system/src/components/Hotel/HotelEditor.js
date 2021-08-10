import { React, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { Box } from "@material-ui/core/";
import Grid from "@material-ui/core/Grid";
import API from "./../../api";
import RoomTable from "./../Room/RoomTable";
import BaseImageDialog from "./../shared/BaseImageDialog";
import ServiceTable from "../Service/ServiceTable";
import { ADMIN } from "../../constants/Roles";
import AddHotelForm from "./AddHotelForm";

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
    display: "flex",
  },
  section: {
    width: "80%",
    alignItems: "center",
  },
  serviceSection: {
    width: "40%",
  },
  createRoomButton: {
    marginTop: 10,
  },
}));

export default function HotelEditor(props) {
  console.log(props);
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [hotel, setHotel] = useState(
    !!props.location.state ? props.location.state.hotel : ""
  );
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const role = useSelector((state) => state.tokenData.role);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function toRoomSection() {
    setValue(1);
  }

  function handleCloseImageDialog() {
    setImageDialogOpen(false);
  }

  async function updateMainInfo() {
    const GetHotel = async () => {
      await API.get("/hotels/" + hotel.id)
        .then((response) => response.data)
        .then((data) => {
          setHotel(data);
        })
        .catch((error) => {
          console.log(error.response.data.Message);
        });
    };
    await GetHotel();
    toRoomSection();
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
        <Tab label="Main Info" />
        <Tab label="Rooms" />
        <Tab label="Services" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
        >
          {role === ADMIN ? (
            <Grid item lg={12}>
              <AddHotelForm
                toRoomSection={toRoomSection}
                hotel={hotel}
                updateMainInfo={updateMainInfo}
              ></AddHotelForm>
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      </TabPanel>

      <TabPanel className={classes.section} value={value} index={1}>
        <RoomTable hotelId={hotel.id}></RoomTable>
      </TabPanel>
      <TabPanel className={classes.serviceSection} value={value} index={2}>
        <ServiceTable hotelId={hotel.id}></ServiceTable>
      </TabPanel>
      <BaseImageDialog
        hotelId={hotel.id}
        open={imageDialogOpen}
        handleClose={handleCloseImageDialog}
        updateMainInfo={updateMainInfo}
        imageUrls={hotel.imageUrls}
      ></BaseImageDialog>
    </div>
  );
}
