import {React ,useEffect, useState} from 'react'
import RoomList from './RoomList';



export default function(props){

    const [hotelId,setHotelId] = useState(props.location.state.hotelId)
    const [rooms, setRooms] = useState([]);
    
    useEffect(() => {
        const loadRooms = async () => {
          await API.get(
            "/rooms/" +
              hotelId +
              "/pages?PageNumber=" +
              pageForRequest +
              "&PageSize=" +
              rowsPerPage
          )
            .then((response) => response.data)
            .then((data) => {
              console.log(data);
              setRooms(data.item1);
              setMaxNumberOfRooms(data.item2);
            })
            .catch((error) => console.log(error.response.data.message));
        };
        loadRooms();
      }, [rowsPerPage, page, openDialog, openDeleteDialog]);

    console.log(props);


    return (
        <RoomList rooms ={rooms}></RoomList>
    );
}