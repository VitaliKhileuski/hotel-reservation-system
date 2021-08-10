import { React } from "react";
import { useSelector } from "react-redux";
import Carousel from "react-material-ui-carousel";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router";
import defaultImage from "./../../img/room.jpg";
import { ROOM_DETAILS_PATH } from "./../../constants/RoutingPaths";

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
  const history = useHistory();

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
    </>
  );
}
