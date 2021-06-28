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

const useStyles = makeStyles({
  root: {
    minWidth: 350,
    margin: 11,
  },
  media: {
    height: 170,
  },
});

export default function RoomListItem({ room }) {
  const classes = useStyles();
  const history = useHistory();
  const adminId = useSelector((state) => state.userId);
  const token = localStorage.getItem("token");
  
  return (
    <Card className={classes.root}>
      <CardActionArea>
        {room.imageUrls.length===0 ?
         <CardMedia
         image = {defaultImage}
         className={classes.media}>
        </CardMedia>
        :  <Carousel
        indicators ={false}>
        {room.imageUrls.map((item, i) => (
          <CardMedia
            key={i}
            className={classes.media}
          >
            <img
            src={item}>
            </img>

          </CardMedia>
        ))}
      </Carousel>}
        <CardContent>
          <Typography variant="body2">room number:{room.roomNumber}</Typography>
          <Typography variant="body2">beds number:{room.bedsNumber}</Typography>
          <Typography variant="body2">
            payment per day:{room.paymentPerDay}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
