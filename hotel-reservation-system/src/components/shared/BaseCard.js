import { React, useState } from "react";
import { useSelector } from "react-redux";
import Carousel from "react-material-ui-carousel";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import defaultImage from "./../../img/room.jpg";
import API from "./../../api";
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
  const islogged = useSelector((state) => state.isLogged);
  const token = localStorage.getItem("token");

  function callReservationDialog() {
    console.log(islogged);
    if (islogged) {
      blockRoom();
    }
    setReservationDialogOpen(true);
  }
  const blockRoom = async () => {
    await API.put("/rooms/" + room.id + "/block", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {})
      .catch((error) => console.log(error.response.data.message));
  };

  function handleCloseReservationDialog() {
    setReservationDialogOpen(false);
  }

  return (
    <>
      <Card
        className={classes.root}
        onClick={!!room ? callReservationDialog : clickAction}
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
        handleClose={handleCloseReservationDialog}
        open={reservationDialogOpen}
        room={room}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
      ></MainReservationDialog>
    </>
  );
}