import {React, useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import {Redirect} from 'react-router-dom'
import EditHotelDialog from './EditHotelDialog'
import { makeStyles } from '@material-ui/core/styles';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import API from './../../api'


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    minHeight: 600,
  },
});

export default function HotelTable(){
    const role = useSelector((state) => state.role)
    const [hotels, setHotels] = useState([]);
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(1);


  useEffect(() => {
    const loadHotels = async () => {
      await  API
      .get('/hotels/pages?PageNumber='+ page + '&PageSize=' + rowsPerPage)
      .then(response => response.data)
      .then((data) => {
        console.log(data);
        setHotels(data);
      })
      .catch((error) => console.log(error.response.data.message));
    };
    loadHotels();     
  },[rowsPerPage, page])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
    const ToEditHotelDialog = () => {
      return <EditHotelDialog/>
    }
    
    if(role==='User'){
        return <Redirect to='/home'></Redirect>
      }
      else{
      
      
        return (
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
                          {hotel.admin.name} {hotel.admin.surname}
                          <br></br>
                          ({hotel.admin.email})
                        </TableCell>
                        <TableCell>
                          <EditIcon></EditIcon>
                        </TableCell>
                        <TableCell>
                          <DeleteIcon></DeleteIcon>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 50]}
              component="div"
              count={hotels.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        );
}
}