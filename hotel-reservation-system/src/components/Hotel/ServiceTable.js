import {React, useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import {Redirect, useHistory} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import {Paper,IconButton, Table, TableBody, TableCell, TableContainer, TableHead,
   TablePagination, TableRow, Button} from '@material-ui/core';
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
  addHotelButton : {
    marginTop : 30
  }
});

export default function ServiceTable({services}){


    const [hotelServices, setHotelServices] = useState(services);
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);    
  };

  
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
                        style={{ minWidth: 100 }}
                      >
                      Payment
                      </TableCell>
                    <TableCell/>
                    <TableCell/>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hotelServices.map((service) => (
                      <TableRow key ={service.id} >
                        <TableCell align='right'>
                          {service.id}
                        </TableCell>
                        <TableCell align='right'>
                          {service.name}
                        </TableCell>
                        <TableCell align='right'>
                          {service.payment}
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
              count={hotelServices.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
          </>
        );
}