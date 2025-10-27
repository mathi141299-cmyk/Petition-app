import { petitionEndPoints } from "../constants/apiEndPoints";
import { ApiUtils } from "../utils";
import { setQueryParams } from "../utils/GeneralUtils";

const departmentDetails = async () => {
  return await ApiUtils.getWithToken(petitionEndPoints.getAllDepartment);
};
const modeOfComplaintDetails = async () => {
  return await ApiUtils.getWithToken(petitionEndPoints.getAllModeOfComplaints);
};
const referredByDetails = async () => {
  return await ApiUtils.getWithToken(petitionEndPoints.getAllReferredBy);
};
const receivedByDetails = async () => {
  return await ApiUtils.getWithToken(petitionEndPoints.getAllReceivedBy);
};
const stateDetails = async () => {
  return await ApiUtils.getWithToken(petitionEndPoints.getAllState);
};
const getAllHabitationLists = async (data: any) => {
  const apiUrl = setQueryParams(data, petitionEndPoints.getAllHabitation);

  return await ApiUtils.getWithToken(apiUrl);
};

const panchayatDetails = async () => {
  return await ApiUtils.getWithToken(petitionEndPoints.getAllPanchayatList);
};

const createPetitionDetail = async (data: any) => {
  try {
    return await ApiUtils.postWithToken(petitionEndPoints.createPetition, data);
  } catch (error) {
    console.log("Error occurs while creating the petition:", error);
    throw error;
  }
};
const generatePetitionNumber = async (date: any) => {
  // return await ApiUtils.getWithToken(petitionEndPoints.generatePetitionNo);
  return await ApiUtils.getWithToken(
    `${petitionEndPoints.generatePetitionNo}?date=${date}`
  );
};
const getPetitionById = async (id: number | string | any) => {
  try {
    return await ApiUtils.getWithToken(`${petitionEndPoints.petition}/${id}`);
  } catch (error) {
    console.log("Error occurs while updating the petition:", error);
    throw error;
  }
};

const updatePetitionById = async (id: number | string | any, data: any) => {
  try {
    return await ApiUtils.putWithToken(
      `${petitionEndPoints.petition}/${id}`,
      data
    );
  } catch (error) {
    console.log("Error occurs while updating the petition:", error);
    throw error;
  }
};
const getPetitionsList = async (params: any) => {
  const apiUrl = setQueryParams(params, petitionEndPoints.getallPetition);
  return await ApiUtils.getWithToken(apiUrl);
};

const getPetitionsReportDetail = async (params: any) => {
  const apiUrl = setQueryParams(
    params,
    petitionEndPoints.petitionsReportDetail
  );
  return await ApiUtils.getWithToken(apiUrl);
};

const getAllPetitionsReportDetail = async (params: any) => {
  const apiUrl = setQueryParams(
    params,
    petitionEndPoints.allPetitionsReportDetail
  );
  return await ApiUtils.getWithToken(apiUrl);
};
const deletePetitions = async (id: number) => {
  return await ApiUtils.deleteWithToken(
    `${petitionEndPoints.deletePetition}/${id}`
  );
};
export {
  departmentDetails,
  modeOfComplaintDetails,
  referredByDetails,
  receivedByDetails,
  stateDetails,
  getAllHabitationLists,
  createPetitionDetail,
  generatePetitionNumber,
  getPetitionById,
  updatePetitionById,
  getPetitionsList,
  getPetitionsReportDetail,
  getAllPetitionsReportDetail,
  panchayatDetails,
  deletePetitions,
};
