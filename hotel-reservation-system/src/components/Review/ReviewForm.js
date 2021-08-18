import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Rating from "@material-ui/lab/Rating";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {
  callErrorAlert,
  callSuccessAlert,
} from "../../Notifications/NotificationHandler";
import API from "./../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 20,
    flexGrow: 1,
    width: 450,
  },
  button: {
    margin: 15,
  },
  textField: {
    margin: 15,
  },
}));

export default function ReviewForm({ orderId, handleClose }) {
  const classes = useStyles();
  const [categoriesWithRatings, setCategoriesWithRatings] = useState([]);
  const [comment, setComment] = useState("");
  const [commentErrorLabel, setCommentErrorLabel] = useState("");
  const token = localStorage.getItem("token");
  const [rerender, setRerender] = useState(false);
  const maxLengthOfComment = 2000;
  useEffect(() => {
    loadReviewCategories();
  }, []);

  useEffect(() => {
    if (rerender) {
      if (setRerender(false));
    }
  }, [rerender]);

  const createReview = async () => {
    const requestRatings = [];
    categoriesWithRatings.map((category) => {
      if (category.Rating >= 1) {
        requestRatings.push(category);
      }
    });

    const request = {
      Ratings: requestRatings,
      Comment: comment.trim(),
    };
    API.post("/review/" + orderId + "/createReview", request, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        handleClose();
        callSuccessAlert("rated successfully");
      })
      .catch((error) => {
        console.log(error);
        callErrorAlert();
      });
  };
  const loadReviewCategories = async () => {
    API.get("/review/getAllReviewCategories", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        var tempCategories = [];
        data.map((category) => {
          tempCategories.push({
            Category: category,
            Rating: 0,
          });
        });
        setCategoriesWithRatings(tempCategories);
      })
      .catch((error) => {
        callErrorAlert();
      });
  };
  function handleClickCreateReview() {
    if (comment.length <= maxLengthOfComment) {
      createReview();
    } else {
      setCommentErrorLabel(
        `number of characters should be less than ${maxLengthOfComment}`
      );
    }
  }

  return (
    <>
      <div className={classes.root}>
        {categoriesWithRatings.length !== 0 ? (
          <Grid
            container
            classname={classes.ratings}
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-end"
          >
            {categoriesWithRatings.map((categoryWithRating, i) => (
              <Grid container item xs={10} style={{ margin: 15 }}>
                <Grid item xs={6}>
                  <Typography>{categoryWithRating.Category.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Rating
                    name={categoryWithRating.Category.name}
                    value={categoryWithRating.Rating}
                    onChange={(e) => {
                      if (parseFloat(e.target.value) >= 1.0) {
                        categoryWithRating.Rating = parseFloat(e.target.value);
                        setRerender(true);
                      }
                    }}
                    precision={0.5}
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No review categories</Typography>
        )}
      </div>
      <TextField
        className={classes.textField}
        id="outlined-multiline-static"
        label={`Write a comment. maximum number of characters ${maxLengthOfComment}`}
        value={comment}
        onChange={(e) => {
          if (!!commentErrorLabel && comment.length - 1 <= maxLengthOfComment) {
            setCommentErrorLabel("");
          }
          setComment(e.target.value);
        }}
        multiline
        error={!!commentErrorLabel}
        helperText={commentErrorLabel}
        rows={6}
        variant="outlined"
      />
      <Button
        onClick={handleClickCreateReview}
        className={classes.button}
        disabled={!!commentErrorLabel}
        variant="contained"
        color="primary"
      >
        Send a review
      </Button>
    </>
  );
}
