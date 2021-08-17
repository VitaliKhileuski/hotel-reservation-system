import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import { useSelector } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import BaseDialog from "./../shared/BaseDialog";
import BaseDeleteDialog from "../shared/BaseDeleteDialog";
import {
  updateTableWithCallingAlert,
  deleteTrigger,
} from "../../helpers/UpdateTableWithCallingAlert";
import { callErrorAlert } from "../../Notifications/NotificationHandler";
import API from "./../../api";
import ReviewCategoryForm from "./ReviewCategoryForm";

const useStyles = makeStyles((theme) => ({
  list: {
    backgroundColor: "#EFF5F2",
  },
  button: {
    marginTop: 10,
  },
  title: {
    margin: theme.spacing(0, 0, 2),
  },
}));

export default function ReviewCategoriesList() {
  const classes = useStyles();
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] =
    useState(false);
  const [categories, setCategories] = useState([]);
  const createCategoryForm = (
    <ReviewCategoryForm
      handleClose={handleCloseAddCategoryDialog}
    ></ReviewCategoryForm>
  );
  const updateTableInfo = useSelector((state) => state.updateTableInfo);
  const token = localStorage.getItem("token");
  const [currentCategoryId, setCurrentCategoryId] = useState();

  useEffect(() => {
    if (updateTableInfo.updateTable || !!updateTableInfo.action) {
      loadReviewCategories();
    }
  }, [updateTableInfo]);

  function handleCloseAddCategoryDialog() {
    setAddCategoryDialogOpen(false);
  }

  function handleClickCreateCategory() {
    setAddCategoryDialogOpen(true);
  }
  function handleClickDeleteCategory(categoryId) {
    setCurrentCategoryId(categoryId);
    setDeleteCategoryDialogOpen(true);
  }
  function handleCloseDeleteCategoryDialog() {
    setDeleteCategoryDialogOpen(false);
  }

  const loadReviewCategories = async () => {
    API.get("/review/getAllReviewCategories", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        setCategories(data);
        updateTableWithCallingAlert(
          updateTableInfo,
          "review category successfully created",
          "review category successfully deleted"
        );
      })
      .catch((error) => {
        callErrorAlert();
      });
  };
  const deleteCategory = async () => {
    API.delete("/review/" + currentCategoryId + "/deleteReviewCategory", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.data)
      .then((data) => {
        deleteTrigger();
        handleCloseDeleteCategoryDialog();
      })
      .catch((error) => {
        callErrorAlert();
      });
  };

  return (
    <>
      <Grid container>
        <Grid style={{ margin: 30 }} item md={2}>
          <Typography className={classes.title} variant="h6">
            Review categories
          </Typography>
          {categories.length !== 0 ? (
            <List className={classes.list}>
              {categories.map((category) => (
                <ListItem>
                  <ListItemText primary={category.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => handleClickDeleteCategory(category.id)}
                      edge="end"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="h6">No categories</Typography>
          )}
          <Button
            className={classes.button}
            onClick={handleClickCreateCategory}
            color="primary"
            variant="contained"
          >
            Add category
          </Button>
        </Grid>
      </Grid>
      <BaseDialog
        title="create category"
        open={addCategoryDialogOpen}
        handleClose={handleCloseAddCategoryDialog}
        form={createCategoryForm}
      ></BaseDialog>
      <BaseDeleteDialog
        open={deleteCategoryDialogOpen}
        deleteItem={deleteCategory}
        title={"Are you sure to delete this category?"}
        message={"category will be permanently deleted"}
        handleCloseDeleteDialog={handleCloseDeleteCategoryDialog}
      ></BaseDeleteDialog>
    </>
  );
}
