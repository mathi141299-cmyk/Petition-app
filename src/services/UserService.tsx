import { userEndPoints } from "../constants/apiEndPoints";
import { ApiUtils } from "../utils";

const getUserDetails = async () => {
  return await ApiUtils.getWithToken(userEndPoints.getUserDetails);
};

export { getUserDetails };
