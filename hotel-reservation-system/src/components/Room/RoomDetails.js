import { React, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  GridList,
  GridListTile,
  makeStyles,
  CardMedia,
  Typography,
} from "@material-ui/core";
import BaseCard from "./../shared/BaseCard";
import BaseDialog from "../shared/BaseDialog";
import DateFilter from "../Filters/DateFilter";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 30,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  gridList: {
    width: "60%",
    height: "100%",
  },
  text: {},
  dateFilter: {},
}));

export default function RoomDetails({ room }) {
  const classes = useStyles();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [element, setElement] = useState();

  function closeImageDialog() {
    setImageDialogOpen(false);
  }
  function zoomImage(url) {
    let img = <img src={url}></img>;
    setElement(img);
    setImageDialogOpen(true);
  }

  return (
    <div className={classes.root}>
      {room.imageUrls !== null && room.imageUrls.length !== 0 ? (
        <GridList cellHeight="200" className={classes.gridList} cols={3}>
          {room.imageUrls.map((image) => (
            <GridListTile key={image} cols={1}>
              <img onClick={() => zoomImage(image)} src={image} />
            </GridListTile>
          ))}
        </GridList>
      ) : (
        <Typography>No images</Typography>
      )}

      <div className={classes.text}>
        <Typography variant="h4">room number: {room.roomNumber}</Typography>
        <Typography variant="h4">number of beds: {room.bedsNumber}</Typography>
        <Typography variant="h4">
          payment per day: {room.paymentPerDay}
        </Typography>
      </div>
      <BaseDialog
        title="Image"
        open={imageDialogOpen}
        handleClose={closeImageDialog}
        form={element}
      ></BaseDialog>
    </div>
  );
}
