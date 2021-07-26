import { React, useState, useEffect } from "react";
import axios from "axios";
import { DropzoneDialogBase } from "material-ui-dropzone";
import API from "./../../api";

export default function BaseImageDialog({
  open,
  imageUrls,
  hotelId,
  handleClose,
  roomId,
}) {
  const [fileObjects, setFileObjects] = useState([]);
  const token = localStorage.getItem("token");
  const [requestFiles, setRequestFiles] = useState([]);
  const [rerender, setRerender] = useState(0);
  const [flag,setFlag] = useState(true);
  
  useEffect(async () => {
      if (!!imageUrls && open) {
        console.log("first")
      await loadImages();
    } 
  }, [open]);

  async function saveImages() {
    mapImagesForRequest();
    if (!!roomId) {
      await saveImagesForRoom();
    } else {
      await saveImagesForHotel();
    }
    if (fileObjects.length === 0) {
      imageUrls = [];
    }
  }

  const loadImages = async () => {

      await imageUrls.forEach(async (item) => {
        await GetImage(item);
      });
      if (fileObjects.length ===  imageUrls.length) {
        setRerender((rerender) => rerender + 1);
      }
    }
  
  const GetImage = async (item) => {
    await axios
      .get(item + "/imageInfo")
      .then((response) => response.data)
      .then((data) => {
        if (data !== null) {
          let file = {
            data: `data:${data.contentType};base64,${data.fileContents}`,
            file: {
              name: data.fileDownloadName,
              type: data.contentType,
            },
            id: data.id,
          };
          fileObjects.push(file);
          if (fileObjects.length === imageUrls.length ) {
            setRerender((rerender) => rerender + 1);
          }
        }
      })
      .catch((error) => console.log(error));
  }

  async function mapImagesForRequest() {
    fileObjects.forEach((item) => {
      let base64Image = item.data.split(",")[1];
      let type = item.file.type;
      let name = item.file.name;
      let request = {
        FileBase64: base64Image,
        FileName: name,
        FileExtension: type,
      };
      requestFiles.push(request);
    });
  }

  async function saveImagesForRoom() {
    const setImagesToRoom = async () => {
      await API.post("/images/" + roomId + "/setRoomImages", requestFiles, {
        headers: { Authorization: "Bearer " + token },
      }).catch((error) => console.log(error.response.data.message));
    };
    setImagesToRoom();
    setRequestFiles([]);
    setFileObjects([]);
    handleClose();
  }

  function closeDialog() {
    setFileObjects([]);
    setFlag(false);
    handleClose();
  }

  async function saveImagesForHotel() {
    if (!!hotelId) {
      const setImagesToHotel = async () => {
        await API.post("/images/" + hotelId + "/setHotelImages", requestFiles, {
          headers: { Authorization: "Bearer " + token },
        }).catch((error) => console.log(error.response.data.message));
      };
      setImagesToHotel();
      setRequestFiles([]);
      closeDialog();
    }
  }

  function deleteFile(file) {
    const index = fileObjects.indexOf(file);
    if (index > -1) {
      fileObjects.splice(index, 1);
    }
    console.log("delete");
    console.log(fileObjects);
  }

  return (
    <DropzoneDialogBase
      acceptedFiles={["image/*"]}
      filesLimit={8}
      cancelButtonText={"cancel"}
      submitButtonText={"submit"}
      fileObjects={fileObjects}
      maxFileSize={5000000}
      open={open}
      onClose={closeDialog}
      onSave={saveImages}
      onAdd={(newFileObjs) => {
        console.log(...newFileObjs);
        setFileObjects([].concat(fileObjects, newFileObjs));
      }}
      onDelete={(deleteFileObj) => {
        deleteFile(deleteFileObj);
      }}
      showPreviews={true}
      showFileNamesInPreview={true}
    />
  );
}
