import { dashboardEndPoints } from "../constants/apiEndPoints";
import { ApiUtils } from "../utils";

const { dashboardRootUrl } = dashboardEndPoints;

const getDashboardDetails = async () => {
  return await ApiUtils.getWithToken(dashboardRootUrl);
};

export { getDashboardDetails };
