import {React, useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import {Redirect, useHistory} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import {Paper,IconButton, Table, TableBody, TableCell, TableContainer, TableHead,
   TablePagination, TableRow, Button} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import API from './../../api'
import AddHotelDialog from './AddHotelDialog'
import DeleteHotelDialog from './DeleteHotelDialog'
import BaseAlert from './../shared/BaseAlert'



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

export default function HotelTable(){
    const history = useHistory();
    const role = useSelector((state) => state.role)
    const [hotels, setHotels] = useState([]);
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [pageForRequest,SetPageForRequest] = useState(0);
    const [maxNumberOfHotels,setMaxNumberOfHotels] = useState(0);
    const [open,setOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [hotelId, setHotelId] = useState();


    const [addAlertOpen,setAddAlertOpen] = useState(false);
    const [deleteAlertOpen,setDeleteAlertOpen] = useState(false)
    
    const isLogged = useSelector((state) => state.isLogged);
    let hotelAdminField = ''
    const token = localStorage.getItem("token");

  useEffect(() => {
    const loadHotels = async () => {
      await  API
      .get('/hotels/pages?PageNumber='+ pageForRequest + '&PageSize=' + rowsPerPage)
      .then(response => response.data)
      .then((data) => {
        console.log(data);
        setHotels(data.item1);
        setMaxNumberOfHotels(data.item2);
      })
      .catch((error) => console.log(error.response.data.message));
    };
    loadHotels();     
  },[rowsPerPage, page,open,openDeleteDialog])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    SetPageForRequest(newPage+1);
    console.log(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    
  };

  function handleClose(){
     setOpen(false);
  }

  function OpenAddHotelDialog(){
    setOpen(true);
    console.log(true);
  }

  function handleCloseDeleteDialog(){
    setOpenDeleteDialog(false);
  };

  async function deleteHotel(){
    console.log(hotelId);
    const DeleteHotel = async () => {
    await API
    .delete('/hotels/'+ hotelId,{
      headers: { Authorization: "Bearer " + token}
    })
  .catch((error) => console.log(error.response.data.message));
};

    await DeleteHotel();
    handleCloseDeleteDialog();
    callDeleteAlert();
  }


  function callAlertDialog(hotelId){
    setHotelId(hotelId);
    console.log(hotelId);
    setOpenDeleteDialog(true);
  }
  function toHotelEditor(hotel){
    history.push(({
    pathname:"/hotelEditor",
    state:{
      hotel
     }
   }));
  }
  function callAddAlert(){
    setAddAlertOpen(true);
  }
  function callDeleteAlert(){
    setDeleteAlertOpen(true);
  }
  
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAddAlertOpen(false);
    setDeleteAlertOpen(false);
  };
    
    if(!isLogged || role==='User'){
        return <Redirect to='/home'></Redirect>
      }
      else{
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
                        style={{ minWidth: 170 }}
                      >
                      Name
                      </TableCell>
                      <TableCell
                        align='right'
                        style={{ minWidth: 170 }}
                      >
                      Country
                      </TableCell>
                      <TableCell
                        align='right'
                        style={{ minWidth: 170 }}
                      >
                      City
                      </TableCell>
                      <TableCell
                        align='right'
                        style={{ minWidth: 170 }}
                      >
                      Street
                      </TableCell>
                      <TableCell
                        align='right'
                        style={{ minWidth: 170 }}
                      >
                      Building Number
                      </TableCell>
                      <TableCell
                        align='right'
                        style={{ minWidth: 170 }}
                      >
                      Hotel Admin
                      </TableCell>
                    <TableCell/>
                    <TableCell/>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hotels.map((hotel) => (
                      <TableRow key ={hotel.id} >
                        <TableCell align='right'>
                          {hotel.id}
                        </TableCell>
                        <TableCell align='right'>
                          {hotel.name}
                        </TableCell>
                        <TableCell align='right'>
                          {hotel.location.country}
                        </TableCell>
                        <TableCell align='right'>
                          {hotel.location.city}
                        </TableCell>
                        <TableCell align='right'>
                          {hotel.location.street}
                        </TableCell>
                        <TableCell align='right'>
                          {hotel.location.buildingNumber}
                        </TableCell>
                        <TableCell align='right'>
                           { hotelAdminField = hotel.admin === null ? "not assigned" : hotel.admin.name + " " + hotel.admin.surname} 
                           <br></br>
                           {hotel.admin===null ? '' : "("+hotel.admin.email+")"}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="inherit"
                            onClick={() => toHotelEditor(hotel)}>
                          <EditIcon ></EditIcon>
                          </IconButton>
                        </TableCell>
                        <TableCell>
                           <IconButton color="inherit"
                           onClick = {() => callAlertDialog(hotel.id)}>
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
              count={maxNumberOfHotels}
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
            className={classes.addHotelButton}
            onClick={OpenAddHotelDialog}>
            Add hotel
          </Button>
          <AddHotelDialog open={open} handleClose={handleClose} callAlert={callAddAlert}></AddHotelDialog>
          <DeleteHotelDialog open={openDeleteDialog} handleCloseDeleteDialog={handleCloseDeleteDialog} deleteHotel={deleteHotel}></DeleteHotelDialog>
          
          <BaseAlert open={addAlertOpen} handleClose = {handleCloseAlert} message = {'hotel added successfully'}></BaseAlert>
          <BaseAlert open ={deleteAlertOpen} handleClose ={handleCloseAlert} message = {'hotel deleted succesfully'}></BaseAlert>
          </>
        );
}
}