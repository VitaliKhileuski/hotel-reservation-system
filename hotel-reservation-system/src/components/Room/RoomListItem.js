import { React,useState,useEffect} from "react";
import API from './../api'
import { useSelector } from "react-redux";
import defaultImage from './../img/hotel.jpg'
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

  const adminId = useSelector((state) => state.userId);
  const token = localStorage.getItem('token');
  const [encodedBase64, setEncodedBase64] = useState('');

  useEffect(() => {
    const loadImage = async () => {
      await API.get("/images/" + hotel.id +'/'+ adminId + "/getHotelImage", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => response.data)
        .then((data) => {
          if (data !== null){
            console.log(data);
            setEncodedBase64(data.image);
          } 
        })
        .catch((error) => console.log(error));
    };
    loadImage();
  }, [hotel]);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          image={encodedBase64===null ? defaultImage : `data:image/png;base64,${encodedBase64}`}
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
