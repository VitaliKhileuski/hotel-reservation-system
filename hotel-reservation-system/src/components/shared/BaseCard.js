import { React } from "react";
import { useSelector } from "react-redux";
import Carousel from "react-material-ui-carousel";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import { useHistory } from "react-router";
import defaultImage from "./../../img/room.jpg";
import { ROOM_DETAILS_PATH } from "./../../constants/RoutingPaths";

const useStyles = makeStyles({
  root: {
    width: 350,
    margin: 11,
  },
  media: {
    height: 170,
  },
  cardContent: {
    height: 120,
  },
});

export default function BaseCard({
  hotel,
  imageUrls,
  room,
  contentRows,
  clickAction,
  checkInDate,
  checkOutDate,
}) {
  const classes = useStyles();
  const history = useHistory();
  console.log(hotel);

  function openRoomDetails() {
    history.push({
      pathname: ROOM_DETAILS_PATH,
      state: {
        room,
        checkInDate,
        checkOutDate,
      },
    });
  }

  return (
    <>
      <Card
        className={classes.root}
        onClick={!!room ? () => openRoomDetails(room) : clickAction}
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
          <CardContent className={classes.cardContent}>
            {contentRows.map((content, i) => {
              return (
                <Typography variant="body2" key={i}>
                  {content}
                </Typography>
              );
            })}
            {!!hotel ? (
              <>
                <Rating readOnly value={hotel.averageRating}></Rating>
                <Typography variant="body2">
                  {!!hotel.reviews ? hotel.reviews.length : "0"} reviews
                </Typography>
              </>
            ) : (
              ""
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
