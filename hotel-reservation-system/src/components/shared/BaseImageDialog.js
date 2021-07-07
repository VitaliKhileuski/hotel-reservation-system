import { React, useState, useEffect } from "react";
import { DropzoneDialogBase } from "material-ui-dropzone";
import API from "./../../api";
import axios from "axios";


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
  const [flag, setFlag] = useState(false);
  const [tempImages,setTempImages] = useState([])

  useEffect(async () => {
    setTempImages([])
    setFileObjects([]);
    if (imageUrls !== undefined) {
        await loadImages();
        }
  }, [open]);

  useEffect(() => {
    if (open === true) {
      console.log("rerender");
      console.log(fileObjects);
    }
  }, [flag]);

  async function saveImages() {
    mapImagesForRequest();
    if (roomId !== undefined) {
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
      
        if (flag === true) {
          setFlag(false);
        } else {
          setFlag(true);
        
        console.log(fileObjects);
        console.log(`flag ${flag}`);
      }
    });
  };

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

          tempImages.push(file);
            setFileObjects(tempImages)
            if (flag === true) {
              setFlag(false);
            } else {
              setFlag(true);
            }
        }
      })
      .catch((error) => console.log(error));
  };

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

  async function saveImagesForHotel() {
    if (hotelId !== undefined) {
      const setImagesToHotel = async () => {
        await API.post("/images/" + hotelId + "/setHotelImages", requestFiles, {
          headers: { Authorization: "Bearer " + token },
        }).catch((error) => console.log(error.response.data.message));
      };
      setImagesToHotel();
      console.log("file objects save");
      console.log(fileObjects);
      setFileObjects([]);
      setRequestFiles([]);
      handleClose();
    }
  }

  function deleteFile(file) {
    var index = fileObjects.indexOf(file);
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
      onClose={() =>{
        handleClose();
      }
    } 
      onSave={() => saveImages()}
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
