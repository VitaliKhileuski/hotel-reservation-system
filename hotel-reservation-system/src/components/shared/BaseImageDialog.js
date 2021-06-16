import {React, useState, useEffect} from "react";
import { DropzoneDialogBase } from 'material-ui-dropzone';
import { USER_ID } from "./../../storage/actions/actionTypes";
import { useSelector } from "react-redux";
import API from './../../api'

export default function BaseImageDialog({
  open,
  hotelId,
  handleClose,
  updateMainInfo,
  filesLimit,
  roomId
}) {

    const [fileObjects, setFileObjects] = useState([]);
    const adminId = useSelector((state) => state.userId);
    const token = localStorage.getItem('token');
    const [requestFiles,setRequestFiles] = useState([]);
    
  
   
    async function saveImages(){
      console.log(roomId)
      if(roomId!==undefined){
        saveImagesForRoom();
      }
      else{
        saveImagesForHotel();
      }
    }


   async function saveImagesForRoom(){
    fileObjects.forEach(item => {
      var base64Image = item.data.split(',')[1];
      let request = {
        Image: base64Image
      }
      requestFiles.push(request);
    });

    console.log(requestFiles);
    
    const setImagesToRoom = async () => {
      await API.post("/images/" + roomId + '/setRoomImages',requestFiles, {
        headers: { Authorization: "Bearer " + token },
      }).catch((error) => console.log(error.response.data.message));
    };
    setImagesToRoom();
    setRequestFiles([]);
    setFileObjects([]);
    handleClose();
   }
   
    async function saveImagesForHotel(){
       if(hotelId!==undefined){
        var base64Image = fileObjects[0].data.split(',')[1];
        const request = {
           Image : base64Image
         }
        
        const setImageToHotel = async () => {
          await API.post("/images/" + hotelId+'/' + adminId+"/"+'setHotelImage',request, {
            headers: { Authorization: "Bearer " + token },
          }).catch((error) => console.log(error.response.data.message));
        };
        setImageToHotel();
        updateMainInfo();
        setFileObjects([]);
        handleClose();
       }
    }

        
    
    function deleteFile(file){
                var index = fileObjects.indexOf(file);
                if (index > -1) {
                fileObjects.splice(index, 1);
                }
    }

    return (
    <DropzoneDialogBase
    acceptedFiles={['image/*']}
    filesLimit = {filesLimit}
    
    cancelButtonText={"cancel"}
    submitButtonText={"submit"}
    fileObjects={fileObjects}
    maxFileSize={5000000}
    open={open}
    clearOnUnmount ={true}
    onClose={() => handleClose()}
    onSave={() => saveImages()}
    onAdd={newFileObjs => {
        console.log(newFileObjs);
        setFileObjects([].concat(fileObjects, newFileObjs));
      }}
      onDelete={deleteFileObj => {
        deleteFile(deleteFileObj);
      }}
    showPreviews={true}
    showFileNamesInPreview={true}
  />
    )
}