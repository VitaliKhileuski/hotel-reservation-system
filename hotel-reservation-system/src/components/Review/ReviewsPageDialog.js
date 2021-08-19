import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Drawer from "@material-ui/core/Drawer";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  drawer: {
    width: "35%",
  },
  ratings: {
    flexWrap: "noWrap",
    marginLeft: 10,
  },
}));

export default function ReviewsPageDialog({ open, handleClose, hotel }) {
  const classes = useStyles();

  console.log(hotel);
  return (
    <Drawer open={open} classes={{ paper: classes.drawer }}>
      <Grid
        direction="column"
        justifyContent="center"
        alignItems="flex-end"
        className={classes.root}
        container
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
              based on {hotel.reviews.length} reviews
            </Typography>
          </Grid>
        </Grid>
        <Divider variant="middle"></Divider>
        <Grid
          container
          item
          className={classes.ratings}
          direction="column"
          alignItems="center"
          justifyContent="space-around"
        >
          {hotel.averageCategoryRatings.map((categoryWithRating, i) => (
            <Grid container xs={12} style={{ margin: 10 }}>
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
              <Grid item xs={4}>
                <Typography>
                  based on {categoryWithRating.numberOfReviews} reviews
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Drawer>
  );
}
