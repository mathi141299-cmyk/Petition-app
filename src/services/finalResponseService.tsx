import { FinalResponseEndPoints } from "../constants/apiEndPoints";
import { ApiUtils } from "../utils";
import { setQueryParams } from "../utils/GeneralUtils";

const createFinalResponseDetails = async (data: any) => {
  try {
    return await ApiUtils.postWithToken(
      FinalResponseEndPoints.finalResponse,
      data,
      true
    );
  } catch (error) {
    console.log("Error occurs while creating the FinalResponse:", error);
    throw error;
  }
};
const getFinalResponseById = async (id: number | string | any) => {
  try {
    return await ApiUtils.getWithToken(
      `${FinalResponseEndPoints.finalResponse}/${id}`
    );
  } catch (error) {
    console.log("Error occurs while updating the FinalResponse:", error);
    throw error;
  }
};

const updateFinalResponseById = async (
  id: number | string | any,
  data: any
) => {
  try {
    return await ApiUtils.putWithToken(
      `${FinalResponseEndPoints.finalResponse}/${id}`,
      data,
      true
    );
  } catch (error) {
    console.log("Error occurs while updating the FinalResponse:", error);
    throw error;
  }
};
const getFinalResponsesList = async (params: any) => {
  const apiUrl = setQueryParams(params, FinalResponseEndPoints.finalResponse);
  return await ApiUtils.getWithToken(apiUrl);
};

export {
  createFinalResponseDetails,
  getFinalResponseById,
  updateFinalResponseById,
  getFinalResponsesList,
};
