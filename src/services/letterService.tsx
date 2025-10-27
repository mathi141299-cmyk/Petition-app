import {
  letterEndPoints,
  letterFormatEndPoints,
} from "../constants/apiEndPoints";
import { ApiUtils } from "../utils";
import { setQueryParams } from "../utils/GeneralUtils";

const createLetterDetail = async (data: any) => {
  try {
    return await ApiUtils.postWithToken(letterEndPoints.letter, data);
  } catch (error) {
    console.log("Error occurs while creating the Letter:", error);
    throw error;
  }
};
const getLetterById = async (id: number | string | any) => {
  try {
    return await ApiUtils.getWithToken(`${letterEndPoints.letter}/${id}`);
  } catch (error) {
    console.log("Error occurs while updating the Letter:", error);
    throw error;
  }
};

const updateLetterById = async (id: number | string | any, data: any) => {
  try {
    return await ApiUtils.putWithToken(
      `${letterEndPoints.letter}/${id}`,
      data,
      true
    );
  } catch (error) {
    console.log("Error occurs while updating the Letter:", error);
    throw error;
  }
};
const getLettersList = async (params: any) => {
  const apiUrl = setQueryParams(params, letterEndPoints.letter);
  return await ApiUtils.getWithToken(apiUrl);
};

const createLetterFormatDetail = async (data: any) => {
  try {
    return await ApiUtils.postWithToken(
      letterFormatEndPoints.letterFormat,
      data
    );
  } catch (error) {
    console.log("Error occurs while creating the Letter:", error);
    throw error;
  }
};
const getAllLetterFormatsByLetterId = async (id: number | string | any) => {
  try {
    return await ApiUtils.getWithToken(
      `${letterFormatEndPoints.letterFormat}/letterId/${id}`
    );
  } catch (error) {
    console.log("Error occurs while updating the Letter:", error);
    throw error;
  }
};

const getLetterFormatById = async (id: number | string | any) => {
  try {
    return await ApiUtils.getWithToken(
      `${letterFormatEndPoints.letterFormat}/${id}`
    );
  } catch (error) {
    console.log("Error occurs while updating the Letter:", error);
    throw error;
  }
};

const updateLetterFormatById = async (id: number | string | any, data: any) => {
  try {
    return await ApiUtils.putWithToken(
      `${letterFormatEndPoints.letterFormat}/${id}`,
      data
    );
  } catch (error) {
    console.log("Error occurs while updating the Letter:", error);
    throw error;
  }
};
const deleteLetterFormat = async (id: number) => {
  return await ApiUtils.deleteWithToken(
    `${letterFormatEndPoints.letterFormat}/${id}`
  );
};

const getAllLetterFormatsMasterData = async () => {
  try {
    return await ApiUtils.getWithToken(
      `${letterFormatEndPoints.letterFormatMaster}`
    );
  } catch (error) {
    console.log("Error occurs while updating the Letter:", error);
    throw error;
  }
};

export {
  createLetterDetail,
  getLetterById,
  updateLetterById,
  getLettersList,
  createLetterFormatDetail,
  getAllLetterFormatsByLetterId,
  getLetterFormatById,
  updateLetterFormatById,
  deleteLetterFormat,
  getAllLetterFormatsMasterData,
};
