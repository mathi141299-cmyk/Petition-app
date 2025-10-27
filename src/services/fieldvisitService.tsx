import {
  fieldVisitEndPoints,
  petitionEndPoints,
} from "../constants/apiEndPoints";
import { ApiUtils } from "../utils";
import { setQueryParams } from "../utils/GeneralUtils";

const createFieldVisitDetail = async (data: any) => {
  try {
    return await ApiUtils.postWithToken(
      fieldVisitEndPoints.createFieldVisit,
      data
    );
  } catch (error) {
    console.log("Error occurs while creating the FieldVisit:", error);
    throw error;
  }
};
const getFieldVisitById = async (id: number | string | any) => {
  try {
    return await ApiUtils.getWithToken(
      `${fieldVisitEndPoints.fieldVisit}/${id}`
    );
  } catch (error) {
    console.log("Error occurs while updating the FieldVisit:", error);
    throw error;
  }
};

const updateFieldVisitById = async (id: number | string | any, data: any) => {
  try {
    return await ApiUtils.putWithToken(
      `${fieldVisitEndPoints.fieldVisit}/${id}`,
      data,
      true
    );
  } catch (error) {
    console.log("Error occurs while updating the FieldVisit:", error);
    throw error;
  }
};
const getFieldVisitsList = async (params: any) => {
  const apiUrl = setQueryParams(params, fieldVisitEndPoints.getallFieldVisit);
  return await ApiUtils.getWithToken(apiUrl);
};
const getPetitionsList = async (params: any) => {
  const apiUrl = setQueryParams(params, petitionEndPoints.getallPetitionList);
  return await ApiUtils.getWithToken(apiUrl);
};
export {
  createFieldVisitDetail,
  getFieldVisitById,
  updateFieldVisitById,
  getFieldVisitsList,
  getPetitionsList,
};
