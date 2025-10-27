const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_PATH = "/api";
const BASE_PATH = `${BASE_URL}${API_PATH}`;

export const authEndPoints = {
  login: `${BASE_PATH}/auth/login`,
  logout: `${BASE_PATH}/logout`,
  refreshToken: `${BASE_PATH}/auth/refresh-token`,
};

export const userEndPoints = {
  getUserDetails: `${BASE_PATH}/user/details`,
};

export const petitionEndPoints = {
  getAllDepartment: `${BASE_PATH}/master/department`,
  getAllModeOfComplaints: `${BASE_PATH}/master/modeOfComplaint`,
  getAllReferredBy: `${BASE_PATH}/master/referredBy`,
  getAllReceivedBy: `${BASE_PATH}/master/receivedBy`,
  getAllState: `${BASE_PATH}/master/state`,
  getAllHabitation: `${BASE_PATH}/master/habitation`,
  petition: `${BASE_PATH}/petition`,
  createPetition: `${BASE_PATH}/petition`,
  generatePetitionNo: `${BASE_PATH}/petition/petition-no`,
  getallPetition: `${BASE_PATH}/petition`,
  getallPetitionList: `${BASE_PATH}/petition/petitions`,
  deletePetition: `${BASE_PATH}/petition`,
  petitionsReportDetail: `${BASE_PATH}/master/getPetitionsReportDetail`,
  allPetitionsReportDetail: `${BASE_PATH}/master/getAllPetitionsReportDetail`,
  getAllPanchayatList: `${BASE_PATH}/master/panchayat`,
};
export const fieldVisitEndPoints = {
  fieldVisit: `${BASE_PATH}/field-visit`,
  createFieldVisit: `${BASE_PATH}/field-visit`,
  getallFieldVisit: `${BASE_PATH}/field-visit`,
};
export const letterEndPoints = {
  letter: `${BASE_PATH}/letter`,
  createLetter: `${BASE_PATH}/letter`,
  getallLetter: `${BASE_PATH}/letter`,
};
export const FinalResponseEndPoints = {
  finalResponse: `${BASE_PATH}/final-response`,
  createFinalResponse: `${BASE_PATH}/final-response`,
  getallFinalResponse: `${BASE_PATH}/final-response`,
};

export const dashboardEndPoints = {
  dashboardRootUrl: `${BASE_PATH}/master/dashboard`,
};
export const letterFormatEndPoints = {
  letterFormat: `${BASE_PATH}/letter-format`,
  letterFormatMaster: `${BASE_PATH}/letter-format/letterFormats`,
};
export const fileUploadEndPoints = {
  fileUpload: `${BASE_PATH}/upload`,
  // letterFormatMaster: `${BASE_PATH}/letter-format/letterFormats`,
};
