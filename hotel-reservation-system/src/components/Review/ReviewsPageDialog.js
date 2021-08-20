import React, { useState, useEffect, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import Drawer from "@material-ui/core/Drawer";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Divider from "@material-ui/core/Divider";
import Pagination from "@material-ui/lab/Pagination";
import API from "../../api";
import { callErrorAlert } from "../../Notifications/NotificationHandler";
import ReviewItem from "./ReviewItem";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    justifyContent: "space-evenly",
  },
  drawer: {
    width: "35%",
  },
  ratings: {
    flexWrap: "noWrap",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
  },
  divider: {
    color: "black",
    width: "100%",
  },
}));

export default function ReviewsPageDialog({ open, handleClose, hotel }) {
  const classes = useStyles();
  const drawerRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const rowsPerPage = 5;
  const [requestPageNumber, setRequestPageNumber] = useState(1);
  const [reviewsCount, setReviewsCount] = useState();

  useEffect(() => {
    loadReviews();
    if (!!reviews && !!drawerRef && !!drawerRef.current) {
      drawerRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [requestPageNumber]);

  useEffect(() => {}, []);

  const loadReviews = async () => {
    API.get("/review/" + hotel.id + "/page", {
      params: {
        pageNumber: requestPageNumber,
        pageSize: rowsPerPage,
      },
    })
      .then((response) => response.data)
      .then((data) => {
        setReviews(data.items);
        setReviewsCount(data.numberOfPages);
      })
      .catch((error) => {
        console.log(error);
        callErrorAlert();
      });
  };
  const handleChange = (event, value) => {
    setRequestPageNumber(value);
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      classes={{ paper: classes.drawer }}
    >
      <Grid
        container
        direction="column"
        alignItems="flex-end"
        className={classes.root}
      >
        <Grid item>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid
          item
          container
          direction="column"
          style={{ marginBottom: 15 }}
          alignItems="center"
        >
          <Grid item>
            <Rating readOnly value={hotel.averageRating} precision={0.1} />
          </Grid>
          <Grid item>
            <Typography variant="h6">
              based on {reviews.length} reviews
            </Typography>
          </Grid>
        </Grid>
        <Divider className={classes.divider}></Divider>
        <Grid
          ref={drawerRef}
          container
          justifyContent="space-evenly"
          className={classes.ratings}
          direction="column"
          alignItems="center"
        >
          {hotel.averageCategoryRatings.map((categoryWithRating, i) => (
            <Grid
              classes={{ container: classes.container }}
              container
              xs={12}
              style={{ margin: 10 }}
            >
              <Grid item xs={3}>
                <Typography>{categoryWithRating.categoryName}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Rating
                  name={categoryWithRating.categoryName}
                  value={categoryWithRating.averageRating}
                  readOnly
                  precision={0.1}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  based on {categoryWithRating.numberOfReviews} reviews
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Divider className={classes.divider}></Divider>
        <Grid container direction="column">
          {reviews.map((review, i) => (
            <Grid item>
              <ReviewItem review={review}></ReviewItem>
              <Divider className={classes.divider}></Divider>
            </Grid>
          ))}
          {reviewsCount !== 1 ? (
            <Pagination
              count={reviewsCount}
              page={requestPageNumber}
              onChange={handleChange}
            ></Pagination>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </Drawer>
  );
}
