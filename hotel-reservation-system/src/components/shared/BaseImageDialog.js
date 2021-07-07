import { React, useState, useEffect } from "react";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { USER_ID } from "./../../storage/actions/actionTypes";
import { useSelector } from "react-redux";
import API from "./../../api";
import axios from "axios";
import { set } from "date-fns";

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
  const [currentImages, setCurrentImages] = useState([]);
  const [tempImages, setTempImages] = useState([]);

  useEffect(async () => {
    if (open === true) {
      setFileObjects([]);
      if (currentImages.length !== 0) {
        setFileObjects(currentImages);
      } else {
        if (open === false) {
          setFileObjects([]);
        }
        if (imageUrls !== undefined) {
          await loadImages();
        }
      }
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
      if (fileObjects.length !== 0) {
        if (flag === true) {
          setFlag(false);
        } else {
          setFlag(true);
        }
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
          if (tempImages.length === imageUrls.length) {
            setCurrentImages(tempImages);
            setFileObjects(tempImages);
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
    setCurrentImages(fileObjects);
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
      setCurrentImages(fileObjects);
      console.log("current images save");
      setFileObjects([]);
      setRequestFiles([]);
      console.log(currentImages);
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
      onClose={() => handleClose()}
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
