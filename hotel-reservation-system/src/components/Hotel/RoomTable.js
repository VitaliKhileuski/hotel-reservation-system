import {React, useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import {Redirect, useHistory} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import {Paper,IconButton, Table, TableBody, TableCell, TableContainer, TableHead,
   TablePagination, TableRow, Button} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import API from './../../api'
import BaseAddDialog from '../shared/BaseAddDialog';
import AddRoomForm from './AddRoomForm'




const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    minHeight: 600,
  },
  addHotelButton : {
    marginTop : 30
  }
});

export default function RoomTable({rooms,hotelId}){

    console.log(rooms);
    const [hotelRooms, setHotelRooms] = useState(rooms);
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openDialog,setOpenDialog] = useState(false);

    let form = <AddRoomForm
    handleClose={() => handleClose()}
    addRoomToTable = {addRoomToTable}
    hotelId = {hotelId}
    >
   </AddRoomForm>;
   
   useEffect(() => {
    
  },[hotelRooms])

   function addRoomToTable(room){
        hotelRooms.push(room);
   }
    
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);    
  };
  function OpenAddRoomDialog(){
    setOpenDialog(true);
  }
  function handleClose(){
    setOpenDialog(false);
 }

  
        return (
          <>
          <Paper className={classes.root}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                      <TableCell
                        align='right'
                        style={{ minWidth: 50 }}
                      >
                      Id
                      </TableCell>
                      <TableCell
                        align='right'
                        style={{ minWidth: 70 }}
                      >
                      Room number
                      </TableCell>
                      <TableCell
                        align='right'
                        style={{ minWidth: 70 }}
                      >
                      BedsNumber
                      </TableCell>
                      <TableCell
                        align='right'
                        style={{ minWidth: 70 }}
                      >
                      Payment per day
                      </TableCell>
                    <TableCell/>
                    <TableCell/>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hotelRooms.map((room) => (
                      <TableRow key ={room.id} >
                        <TableCell align='right'>
                          {room.id}
                        </TableCell>
                        <TableCell align='right'>
                          {room.roomNumber}
                        </TableCell>
                        <TableCell align='right'>
                          {room.bedsNumber}
                        </TableCell>
                        <TableCell align='right'>
                          {room.paymentPerDay}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="inherit">
                          <EditIcon ></EditIcon>
                          </IconButton>
                        </TableCell>
                        <TableCell>
                           <IconButton color="inherit">
                           <DeleteIcon></DeleteIcon>
                           </IconButton>
                        </TableCell>
                      </TableRow>
                      
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 50]}
              component="div"
              count={rooms.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
          <Button
        variant="contained"
        color="primary"
        size="large"
        margin='normal'
        className = {classes.createRoomButton}
        onClick ={OpenAddRoomDialog}>
          Create room
        </Button>
        <BaseAddDialog open={openDialog} handleClose = {handleClose} form ={form}></BaseAddDialog>
          </>
        );
}