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
  roomId,
}) {
     
    const [fileObjects, setFileObjects] = useState([]);
    const token = localStorage.getItem('token');
    const [requestFiles,setRequestFiles] = useState([]);
    const [currentRoomImages,setCurrentRoomImages] = useState([]);
    
    useEffect(() => {
      const loadImage = async () => {
        await API.get("/images/" + roomId + "/getRoomImages", {
          headers: { Authorization: "Bearer " + token },
        })
          .then((response) => response.data)
          .then((data) => {
            if (data !== null) {
              data.forEach(item => {
                let base64Image = item.imageBase64;
                let type = item.type;
                let name = item.title;
                let file = {
                  data : `data:${type};base64,${base64Image}`,
                  file : {
                    name : name,
                    type : type, 
                  }
                }
                currentRoomImages.push(file);
                console.log(fileObjects);
              });
              setFileObjects(currentRoomImages);
              setCurrentRoomImages([]) 
            }
          })
          .catch((error) => console.log(error));
      };
      if(roomId!==0 && roomId!==undefined){
        loadImage();
        console.log("zdarova")
      }
      
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
        Title : name,
        Type : type,
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
           Title : name,
           Type : type,
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
    filesLimit = {filesLimit}
    
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