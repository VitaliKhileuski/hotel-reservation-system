import { React, useState, useEffect } from "react";
import API from "./../api";
import { useSelector } from "react-redux";
import defaultImage from "./../img/hotel.jpg";
import { useHistory } from "react-router";
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

export default function HotelListItem({ hotel }) {
  const classes = useStyles();
  const history = useHistory();
  const adminId = useSelector((state) => state.userId);
  const token = localStorage.getItem("token");
  const [encodedBase64, setEncodedBase64] = useState("");
  const [fileType,setFileType] = useState("");

  useEffect(() => {
    setEncodedBase64('');
    const loadImage = async () => {
      await API.get("/images/" + hotel.id + "/getHotelImage", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
          if (data !== null) {
            setEncodedBase64(data.imageBase64);
            setFileType(data.type);
          }
          else{
            setEncodedBase64("");
          }
        })
        .catch((error) => console.log(error));
    };
    loadImage();
  }, [hotel]);

  function toRoomsPage(hotelId) {
    history.push({
      pathname: "/rooms",
      state: {
        hotelId,
      },
    });
  }

  return (
    <Card className={classes.root} onClick={() => toRoomsPage(hotel.id)}>
      <CardActionArea>
        <CardMedia
          image={
            encodedBase64 === ''
              ? defaultImage
              : `data:${fileType};base64,${encodedBase64}`
          }
          className={classes.media}
          title={hotel.name}
        ></CardMedia>
        <CardContent>
          <Typography>{hotel.name}</Typography>
          <Typography variant="body2">
            counrty:{hotel.location.country}
          </Typography>
          <Typography variant="body2">city:{hotel.location.city}</Typography>
          <Typography variant="body2">
            street:{hotel.location.street} {hotel.location.buildingNumber}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
