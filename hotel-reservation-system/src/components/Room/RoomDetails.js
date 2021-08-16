import { React, useState } from "react";
import { makeStyles } from "@material-ui/core";
import GridListTile from "@material-ui/core/GridListTile";
import GridList from "@material-ui/core/GridList";
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography";
import BaseDialog from "../shared/BaseDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 30,
    display: "flex",
  },
  gridList: {
    maxWidth: "60%",
    height: "100%",
  },
}));

export default function RoomDetails({ room }) {
  const classes = useStyles();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [element, setElement] = useState();

  function closeImageDialog() {
    setImageDialogOpen(false);
  }

  function zoomImage(url) {
    const img = <img src={url}></img>;
    setElement(img);
    setImageDialogOpen(true);
  }

  return (
    <>
    <Grid container
    className={classes.root}
    direction="row"
    >
      <Grid item style={{maxWidth : "50%"}}>
      {room.imageUrls !== null && room.imageUrls.length !== 0 ? (
        <GridList cellHeight={200} className={classes.gridList} cols={3}>
          {room.imageUrls.map((image) => (
            <GridListTile key={image} cols={1}>
              <img onClick={() => zoomImage(image)} src={image} />
            </GridListTile>
          ))}
        </GridList>
      ) : (
        <Grid item style={{width: 1000}}>
        <Typography>No images</Typography>
        </Grid>
        
      )}
      </Grid>  
      <Grid item>
        <Grid container direction="row">
          <Grid container sm={5}  justify="flex-start" 
            alignItems="flex-start">
            <Grid item>
            <Typography variant="h4">room number:</Typography>
            </Grid>
            <Grid item>
            <Typography variant="h4">number of beds:</Typography>
            </Grid>
            <Grid item>
            <Typography variant="h4">payment per day:</Typography>
            </Grid>
          </Grid>
          <Grid sm={6} container direction="column"justify="flex-start"
            alignItems="flex-start" >
              <Grid item>
                <Typography variant="h4">{room.roomNumber}</Typography>
              </Grid>
              <Grid item>
              <Typography variant="h4">{room.bedsNumber}</Typography>
              </Grid>
              <Grid item>
              <Typography variant="h4">{room.paymentPerDay}</Typography>
              </Grid>
            </Grid>
        </Grid>
        </Grid>   
    </Grid>
      <BaseDialog
        title="Image"
        open={imageDialogOpen}
        handleClose={closeImageDialog}
        form={element}
      ></BaseDialog>
    </>
  );
}
