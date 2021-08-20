import React, { useState, useEfffect } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import moment from "moment";
import Button from "@material-ui/core/Button";
import { REVIEW_RATINGS } from "../../constants/ReviewRatings";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    color: "black",
    width: "100%",
  },
  rating: {
    justifyContent: "flex-end",
  },
}));

export default function ReviewItem({ review }) {
  const classes = useStyles();
  let reviewRatingSentence = "";
  const averageRating = review.averageRating;
  switch (true) {
    case averageRating >= 1 && averageRating < 2:
      reviewRatingSentence = REVIEW_RATINGS.from1to2;
      break;
    case averageRating >= 2 && averageRating < 3:
      reviewRatingSentence = REVIEW_RATINGS.from2to3;
      break;
    case averageRating >= 3 && averageRating < 4:
      reviewRatingSentence = REVIEW_RATINGS.from3to4;
      break;
    case averageRating >= 4 && averageRating < 4.5:
      reviewRatingSentence = REVIEW_RATINGS.from4to4_5;
      break;
    case averageRating >= 4.5 && averageRating <= 5:
      reviewRatingSentence = REVIEW_RATINGS.from4_5to5;
      break;
  }

  return (
    <Grid
      container
      direction="row"
      style={{ padding: 20 }}
      justifyContent="center"
    >
      <Grid
        xs={3}
        spacing={1}
        item
        container
        direction="column"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Grid item>
          <Typography className={classes.customerName}>
            {review.user.name}
          </Typography>
        </Grid>
        <Grid item>
          <Typography>{moment(review.order.startDate).format("LL")}</Typography>
        </Grid>
        <Grid item>
          <Typography>
            {review.order.numberOfDays}{" "}
            {review.order.numberOfDays === 1 ? " night" : " nights"}
          </Typography>
        </Grid>
      </Grid>
      <Grid xs={8} spacing={4} item container direction="column">
        <Grid item container className={classes.rating} direction="row">
          <Grid item xs={10} container direction="column">
            <Typography>
              Review Date: {moment(review.createdAt).format("LL")}
            </Typography>
            <Typography variant="h6">{reviewRatingSentence}</Typography>
          </Grid>
          <Grid item xs={2}>
            {!!review.averageRating ? (
              <Button
                color="primary"
                style={{ backgroundColor: "#0B50A1", color: "white" }}
                disabled={true}
                variant="contained"
              >
                {review.averageRating}
              </Button>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
        <Grid item>
          <Typography>{review.comment}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
