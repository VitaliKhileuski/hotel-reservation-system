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
  const [encodedBase64, setEncodedBase64] = useState("");
  const [base64Images, setBase64Images] = useState([]);

  useEffect(() => {
    const loadImage = async () => {
      await API.get("/images/" + room.id + "/getRoomImages", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          if (data !== null) {
            console.log(data);
            setBase64Images(data);
          }
        })
        .catch((error) => console.log(error));
    };
    loadImage();
  }, []);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        {base64Images.length===0 ?
         <CardMedia
         image = {defaultImage}
         className={classes.media}>
        </CardMedia>
        :  <Carousel
        indicators ={false}>
        {base64Images.map((item, i) => (
          <CardMedia
            key={i}
            image={
              item === ''
                ? defaultImage
                : `data:image/png;base64,${item.image}`
            }
            className={classes.media}
          ></CardMedia>
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
