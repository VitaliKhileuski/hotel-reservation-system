import {React, useState, useEffect} from "react";
import { DropzoneDialogBase } from 'material-ui-dropzone';
import { USER_ID } from "./../../storage/actions/actionTypes";
import { useSelector } from "react-redux";
import API from './../../api'
import axios from "axios";

export default function BaseImageDialog({
  open,
  imageUrls,
  hotelId,
  handleClose,
  updateMainInfo,
  roomId,
}) {
    const [fileObjects, setFileObjects] = useState([]);
    const token = localStorage.getItem('token');
    const [requestFiles,setRequestFiles] = useState([]);
    const [currentRoomImages,setCurrentRoomImages] = useState([]);
    
    useEffect(() => {
      const loadImages = async () => {
        await imageUrls.forEach(item =>{
          axios.get(item)
          .then((response) => response.data)
          .then((data) => {
            if (data !== null) {
              console.log(data);
              currentRoomImages.push(data);
            }
          })
          .catch((error) => console.log(error));
        });
      };
      if(imageUrls!==undefined){
        console.log("urls");
        console.log(imageUrls);
        loadImages();
      }
      setFileObjects(currentRoomImages);
    }, [open]); 

   
    async function saveImages(){
      console.log(roomId)
      if(roomId!==undefined){
      await saveImagesForRoom();
      }
      else{
        saveImagesForHotel();
      }
    }


   async function saveImagesForRoom(){
    fileObjects.forEach(item => {
      let base64Image = item.data.split(',')[1];
      let type = item.file.type;
      let name = item.file.name;
      let request = {
        FileBase64 : base64Image,
        FileName : name,
        FileExtension : type
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
    setCurrentRoomImages([]);
    handleClose();
   }
   
    async function saveImagesForHotel(){
       if(hotelId!==undefined){
        var base64Image = fileObjects[0].data.split(',')[1];
        var type = fileObjects[0].file.type;
        var name = fileObjects[0].file.name;
      
        const request = {
           ImageBase64 : base64Image,
           FileName : name,
           FileExtension : type,
         }
        
        const setImageToHotel = async () => {
          await API.post("/images/" + hotelId+'/setHotelImage',request, {
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
    filesLimit = {8}
    
    cancelButtonText={"cancel"}
    submitButtonText={"submit"}
    fileObjects={fileObjects}
    maxFileSize={5000000}
    open={open}
    onClose={() => handleClose()}
    onSave={() => saveImages()}
    onAdd={newFileObjs => {
        console.log(...newFileObjs);
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