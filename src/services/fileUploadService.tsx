import {
  fileUploadEndPoints,
  petitionEndPoints,
} from "../constants/apiEndPoints";
import { ApiUtils } from "../utils";
import { setQueryParams } from "../utils/GeneralUtils";

const createFileUploadDetail = async (data: any) => {
  try {
    return await ApiUtils.postWithToken(
      fileUploadEndPoints.fileUpload,
      data
      //   true
    );
  } catch (error) {
    console.log("Error occurs while creating the petition:", error);
    throw error;
  }
};
const getFileUploadDataById = async (id: number | string | any, name: any) => {
  try {
    return await ApiUtils.getWithToken(
      `${fileUploadEndPoints.fileUpload}/${id}?name=${name}`
    );
  } catch (error) {
    console.log("Error occurs while updating the Letter:", error);
    throw error;
  }
};




const deleteFile= async (id: number) => {
  return await ApiUtils.deleteWithToken(
    `${fileUploadEndPoints.fileUpload}/${id}`
  );
};
export { createFileUploadDetail, getFileUploadDataById, deleteFile };
