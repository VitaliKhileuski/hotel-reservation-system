import { React, useState, useEffect } from "react";
import API from "./../../api";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import Carousel from "react-material-ui-carousel";
import defaultImage from "./../../img/room.jpg";
import {
  Card,
  makeStyles,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import MainReservationDialog from "../Reservation/MainReservationDialog";

const useStyles = makeStyles({
  root: {
    minWidth: 350,
    margin: 11,
  },
  media: {
    height: 170,
  },
});

export default function BaseCard({
  imageUrls,
  room,
  contentRows,
  clickAction,
  checkInDate,
  checkOutDate,
}) {
  const classes = useStyles();
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const history = useHistory();
  const token = localStorage.getItem("token");
  console.log(room);
  console.log(checkOutDate);

  function callReservationDialog() {
    console.log("click");
    setReservationDialogOpen(true);
  }
  function handleCloseReservationDialog() {
    setReservationDialogOpen(false);
  }
  return (
    <>
      <Card
        className={classes.root}
        onClick={room !== undefined ? callReservationDialog : clickAction}
      >
        <CardActionArea>
          {imageUrls === undefined || imageUrls.length === 0 ? (
            <CardMedia
              image={defaultImage}
              className={classes.media}
            ></CardMedia>
          ) : (
            <Carousel indicators={false}>
              {imageUrls.map((item, i) => (
                <CardMedia
                  key={i}
                  className={classes.media}
                  image={item}
                ></CardMedia>
              ))}
            </Carousel>
          )}
          <CardContent>
            {contentRows.map((content, i) => {
              return (
                <Typography variant="body2" key={i}>
                  {content}
                </Typography>
              );
            })}
          </CardContent>
        </CardActionArea>
      </Card>
      <MainReservationDialog
        handleClose={() => handleCloseReservationDialog()}
        open={reservationDialogOpen}
        room={room}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
      ></MainReservationDialog>
    </>
  );
}
