import {React, useState} from "react";
import { DropzoneDialogBase } from 'material-ui-dropzone';
import { USER_ID } from "./../../storage/actions/actionTypes";
import { useSelector } from "react-redux";
import API from './../../api'

export default function BaseImageDialog({
  open,
  hotelId,
  handleClose,
}) {

    const [fileObjects, setFileObjects] = useState([]);
    const [base64Image,setBase64Image] = useState('');
    const adminId = useSelector((state) => state.userId);
    const token = localStorage.getItem('token');
  
    function saveImages(){
       if(hotelId!==undefined){
        var base64Image = fileObjects[0].data.split(',')[1];
        setImageToHotel(base64Image);
        handleClose();
       }
    }

        const setImageToHotel = async (base64Image) => {
          await API.put("/images/" + hotelId+'/' + adminId,base64Image, {
            headers: { Authorization: "Bearer " + token },
          }).catch((error) => console.log(error.response.data.message));
        };
    
    function deleteFile(file){
                var index = fileObjects.indexOf(file);
                if (index > -1) {
                fileObjects.splice(index, 1);
                }
    }

    return (
    <DropzoneDialogBase
    acceptedFiles={['image/*']}
    filesLimit = {1.01}
    
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