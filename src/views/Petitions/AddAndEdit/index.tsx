import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  ButtonBase,
  Grid,
  IconButton,
  MenuItem,
  Typography,
  debounce,
} from "@mui/material";
import {
  emailValidator,
  mobileNumberValidator,
  requiredValidator,
  updateFormDataWithHelperText,
} from "../../../utils/ValidationUtils";
import {
  DateTimePicker,
  TextField,
  Select,
  Radio,
  Button,
  AutoComplete,
  PageLoader,
} from "../../../components/basic";
import dayjs from "dayjs";
import AutoCompleteWithCheckBoxes from "../../../components/basic/autocompletewithcheckbox";
import CancelButton from "../../../components/basic/button/cancelButton";
import { EditIcon } from "../../../assets/icons";
import { useNavigate, useParams } from "react-router-dom";
import Textarea from "@mui/joy/Textarea";
import moment from "moment";
import {
  createPetitionDetail,
  departmentDetails,
  generatePetitionNumber,
  getAllHabitationLists,
  getPetitionById,
  modeOfComplaintDetails,
  receivedByDetails,
  referredByDetails,
  stateDetails,
  updatePetitionById,
} from "../../../services/petitionService";
import {
  setSnackBarFailed,
  setSnackBarSuccess,
} from "../../../redux/slices/snackbar";
import { useDispatch } from "react-redux";
import { petitionPageConst } from "../../../constants/displayText";
import { RouteUrls } from "../../../constants/routes";
const PetitionsAddAndEdit = () => {
  const styles = {
    selectStyle: {
      width: "431px",
      height: "48px",
      boxShadow: "none",
      borderRadius: "5px",
      borderColor: "#E5E7EB",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E5E7EB",
      },
      "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E5E7EB",
      },
      marginRight: "130px",
    },
    textFieldStyle: {
      width: "431px",
      "& .MuiOutlinedInput-root": {
        height: "48px",
        borderRadius: "5px",
        paddingLeft: "8px",
        boxShadow: "none",
      },
      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E5E7EB",
      },

      "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E5E7EB",
      },
      marginRight: "130px",
    },
  };

  const initialInfoError = {
    petitionNo: "",
    dateAndTime: "",
    complaintMode: "",
    receivedBy: "",
    referredBy: "",
    petitionerName: "",
    mobile: "",
    email: "",
    department: "",
    issueType: "",
    isFieldVisitRequired: "",
    address: "",
    panchayat: "",
    habitation: "",
    taluk: "",
    district: "",
    state: "",
  };

  const [infoError, setInfoError] = useState<any>(initialInfoError);

  const initialInfoData = {
    petitionNo: null,
    dateAndTime: dayjs(),
    complaintMode: null,
    receivedBy: null,
    referredBy: null,
    petitionerName: "",
    mobile: null,
    email: "",
    department: [],
    issueType: "",
    isFieldVisitRequired: 1,
    address: "",
    panchayat: null,
    habitation: null,
    habitation_input: "",
    taluk: null,
    district: null,
    state: 1,
  };

  const [infoData, setInfoData] = useState<any>(initialInfoData);
  // console.log("petition infoData", infoData);
  const fieldData = {
    petitionNo: {
      label: "Petition No",
      name: "petitionNo",
      value: infoData.petitionNo,
      placeholder: "150424/05/60",
      isError: infoError.petitionNo === "" ? false : true,
      helperText: infoError.petitionNo,
      isDisabled: false,
      isRequiredField: true,
    },
    dateAndTime: {
      label: "Date And Time",
      name: "dateAndTime",
      value: infoData.dateAndTime,
      placeholder: "Select Date And Time",
      isError: infoError.dateAndTime === "" ? false : true,
      helperText: infoError.dateAndTime,
      isDisabled: false,
      isRequired: true,
    },
    complaintMode: {
      label: "Mode Of Complaint",
      name: "complaintMode",
      value: infoData.complaintMode,
      placeholder: "Select Mode Of Complaint",
      isError: infoError.complaintMode === "" ? false : true,
      helperText: infoError.complaintMode,
      isDisabled: false,
      isRequired: true,
    },
    receivedBy: {
      label: "Received By",
      name: "receivedBy",
      value: infoData.receivedBy,
      placeholder: "Select Received By",
      isError: infoError.receivedBy === "" ? false : true,
      helperText: infoError.receivedBy,
      isDisabled: false,
      isRequired: true,
    },
    referredBy: {
      label: "Referred By",
      name: "referredBy",
      value: infoData.referredBy,
      placeholder: "Select Referred By",
      isError: infoError.referredBy === "" ? false : true,
      helperText: infoError.referredBy,
      isDisabled: false,
      isRequired: false,
    },
    petitionerName: {
      label: "Petitioner Name",
      name: "petitionerName",
      value: infoData.petitionerName,
      placeholder: "Enter Petitioner Name",
      isError: infoError.petitionerName === "" ? false : true,
      helperText: infoError.petitionerName,
      isDisabled: false,
      isRequired: false,
    },
    mobile: {
      label: "Mobile",
      name: "mobile",
      value: infoData.mobile,
      placeholder: "Enter Mobile No",
      isError: infoError.mobile === "" ? false : true,
      helperText: infoError.mobile,
      isDisabled: false,
      isRequired: false,
    },
    email: {
      label: "Email",
      name: "email",
      value: infoData.email,
      placeholder: "Enter Email",
      isError: infoError.email === "" ? false : true,
      helperText: infoError.email,
      isDisabled: false,
      isRequired: false,
    },
    department: {
      label: "Department",
      name: "department",
      value: infoData.department,
      placeholder: "Select Department",
      isError: infoError.department === "" ? false : true,
      helperText: infoError.department,
      isDisabled: false,
      isRequired: false,
    },
    issueType: {
      label: "Type Of Issue",
      name: "issueType",
      value: infoData.issueType,
      placeholder: "Enter Type Of Issue",
      isError: infoError.issueType === "" ? false : true,
      helperText: infoError.issueType,
      isDisabled: false,
      isRequired: false,
    },
    isFieldVisitRequired: {
      label: "Field Visit Required",
      name: "isFieldVisitRequired",
      value: infoData.isFieldVisitRequired,
      placeholder: "",
      isError: infoError.isFieldVisitRequired === "" ? false : true,
      helperText: infoError.isFieldVisitRequired,
      isDisabled: false,
      isRequired: false,
    },
    address: {
      label: "Address",
      name: "address",
      value: infoData.address,
      placeholder: "Enter Address",
      isError: infoError.address === "" ? false : true,
      helperText: infoError.address,
      isDisabled: false,
      isRequired: false,
    },
    panchayat: {
      label: "Panchayat",
      name: "panchayat",
      value: infoData.panchayat,
      placeholder: "Enter Panchayat",
      isError: infoError.panchayat === "" ? false : true,
      helperText: infoError.panchayat,
      isDisabled: false,
      isRequired: false,
    },
    habitation: {
      label: "Habitation",
      name: "habitation",
      value: infoData.habitation,
      habitation_input: infoData.habitation_input,
      placeholder: "Enter Habitation",
      isError: infoError.habitation === "" ? false : true,
      helperText: infoError.habitation,
      isDisabled: false,
      isRequired: false,
    },
    taluk: {
      label: "Taluk",
      name: "taluk",
      value: infoData.taluk,
      placeholder: "Enter Taluk",
      isError: infoError.taluk === "" ? false : true,
      helperText: infoError.taluk,
      isDisabled: false,
      isRequired: false,
    },
    district: {
      label: "District",
      name: "district",
      value: infoData.district,
      placeholder: "Enter district",
      isError: infoError.district === "" ? false : true,
      helperText: infoError.district,
      isDisabled: false,
      isRequired: false,
    },
    state: {
      label: "State",
      name: "state",
      value: infoData.state,
      placeholder: "Enter State",
      isError: infoError.state === "" ? false : true,
      helperText: infoError.state,
      isDisabled: false,
      isRequired: false,
    },
  };

  const { signInUrl, petitionListUrl, createUrl, editUrl, listUrl } = RouteUrls;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [infoFieldData, setInfoFieldData] = useState<any>(fieldData);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDefaultDisabled, setIsDefaultDisabled] = useState(true);
  const [isAutoCompleteClear, setIsAutoCompleteClear] = useState<any>(false);
  const [departments, setDepartments] = useState<any>([]);
  const [modeOfComplaints, setModeOfComplaints] = useState<any>([]);
  const [receivedByList, setReceivedByList] = useState<any>([]);
  const [referredByList, setReferredByList] = useState<any>([]);
  const [habitationList, setHabitationList] = useState<any>([]);
  const [stateList, setStateList] = useState<any>([]);
  const [isPageLoader, setIsPageLoader] = useState(false);
  // const [isEdit, setIsEdit] = useState(false);
  // console.log("setIsEdit", isEdit);
  // console.log("habitationList", habitationList);
  // //form validation functions
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleAutoCompletesChange = (selectedOptions: any) => {
    setSelectedOptions(selectedOptions);
  };

  const handleValidation = (e: any) => {
    const { name, value, label } = e.target;
    // console.log(" name, value, label");
    switch (name) {
      case "petitionNo":
      case "dateAndTime":
      case "complaintMode":
      case "petitionerName":
      case "address":
      case "panchayat":
      case "habitation":
      case "taluk":
      case "district":
      case "state": {
        if (requiredValidator(value, label)) {
          // console.log("requiredValidator");
          updateFormDataWithHelperText(
            name,
            requiredValidator(value, label),
            setInfoError
          );
        } else {
          updateFormDataWithHelperText(name, "", setInfoError);
        }
        break;
      }
      case "mobile": {
        if (
          mobileNumberValidator(
            value !== null ? value.slice(0, 10) : value,
            label
          )
        ) {
          updateFormDataWithHelperText(
            name,
            mobileNumberValidator(
              value !== null ? value.slice(0, 10) : value,
              label
            ),
            setInfoError
          );
        } else {
          updateFormDataWithHelperText(name, "", setInfoError);
        }
        break;
      }
      case "email": {
        if (emailValidator(value, label)) {
          updateFormDataWithHelperText(
            name,
            emailValidator(value, label),
            setInfoError
          );
        } else {
          updateFormDataWithHelperText(name, "", setInfoError);
        }
        break;
      }
      case "department": {
        const newValue = value?.map((item: any) => item?.name).join(", ");

        if (requiredValidator(newValue, label)) {
          updateFormDataWithHelperText(
            name,
            requiredValidator(newValue, label),
            setInfoError
          );
        } else {
          updateFormDataWithHelperText(name, "", setInfoError);
        }

        break;
      }
      default:
        break;
    }
  };

  const validateForm = () => {
    for (const fieldName in fieldData) {
      if ((fieldData as any)[fieldName].name) {
        handleValidation({ target: (fieldData as any)[fieldName] });
      }
    }
  };

  const updateInfoFieldData = () => {
    setInfoFieldData((prev: any) => {
      return Object?.keys(prev)?.map((field: any) => {
        return {
          ...field,
          value: infoData[field.name],
          isError: infoError[field.name] == "" ? false : true,
          helperText: infoError[field.name],
        };
      });
    });
  };

  useEffect(() => {
    updateInfoFieldData();
  }, [infoError, infoData]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    let inputValue = value;
    if (name === "mobile") {
      if (inputValue.length > 10) {
        inputValue = inputValue.slice(0, 10);
      }
    }
    setInfoData((prev: any) => ({
      ...prev,
      [name]: inputValue,
    }));

    if (name === "mobile") {
      handleValidation({
        target: {
          name: "mobile",
          value: inputValue,
        },
      });
    }
    // else if (name === "email") {
    //   handleValidation({
    //     target: {
    //       name: "email",
    //       value: inputValue,
    //     },
    //   });
    // }
    else {
      handleValidation(e);
    }
  };

  const handleAutoCompleteChange = (e: any, newValue: any, name: any) => {
    if (name === "habitation") {
      setInfoData((prevBookingData: any) => ({
        ...prevBookingData,
        [name]: newValue,
        panchayat: newValue?.panchayat?.name,
        taluk: newValue?.panchayat?.taluk?.name,
        district: newValue?.panchayat?.district?.name,
      }));
    }
  };

  const handleAutoCompleteInputChange = (
    e: any,
    newInputValue: string,
    name: string
  ) => {
    if (name === "habitation_input" && newInputValue === "" && id) {
      return false;
    }

    if (name === "habitation_input") {
      setInfoData((prevBookingData: any) => ({
        ...prevBookingData,
        [name]: newInputValue,
      }));
      handleValidation({
        target: {
          name: "habitation",
          value: newInputValue,
        },
      });

      getAllHabitation(newInputValue);
    }
  };

  const handleDateAndTimeChange = (newValue: any, name: string) => {
    const formattedDateTime = dayjs(newValue).format("DD/MM/YYYY hh:mm A");
    // const formattedDate = dayjs(newValue);
    setInfoData((prev: any) => ({
      ...prev,
      [name]: newValue,
    }));
    handleValidation({
      target: {
        name: "dateAndTime",
        value: newValue,
      },
    });
    // setIsEdit(true);
    let formattedDate = dayjs(newValue).format("YYYY-MM-DD");
    generatePetitionNo(formattedDate);
  };

  const handleRadioChange = (e: any) => {
    const key = e?.target?.name;
    const value = e?.target?.value;
    setInfoData((prevBookingData: any) => ({
      ...prevBookingData,
      [key]: value,
    }));
  };

  // useEffect(() => {
  //   setInfoData((prevBookingData: any) => ({
  //     ...prevBookingData,
  //     department:{ id: 3, name: "Water" }
  //   })
  // , []);
  // useEffect(() => {
  //   setInfoData((prevBookingData: any) => ({
  //     ...prevBookingData,
  //     department: [{ id: 3, name: "Water" }],
  //   }));
  // }, []);

  const getAllDepartments = () => {
    try {
      return departmentDetails().then((result: any) => {
        let data = result?.data;
        const departmentsList = data?.map((uniqueData: any) => {
          return {
            id: uniqueData.id,
            name: uniqueData.name,
          };
        });

        setDepartments(departmentsList);
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const getAllModeOfComplaints = () => {
    try {
      return modeOfComplaintDetails().then((result: any) => {
        let data = result?.data;
        const modeOfComplaintsList = data?.map((uniqueData: any) => {
          return {
            id: uniqueData.id,
            name: uniqueData.name,
          };
        });

        setModeOfComplaints(modeOfComplaintsList);
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  // const getAllReferredBy = () => {
  //   try {
  //     return referredByDetails().then((result: any) => {
  //       let data = result?.data;
  //       const referredByLists = data?.map((uniqueData: any) => {
  //         return {
  //           id: uniqueData.id,
  //           name: uniqueData.name,
  //         };
  //       });

  //       setReferredByList(referredByLists);
  //     });
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // };

  const getAllReceivedBy = () => {
    try {
      return receivedByDetails().then((result: any) => {
        let data = result?.data;
        const receivedByLists = data?.map((uniqueData: any) => {
          return {
            id: uniqueData.id,
            name: uniqueData.name,
          };
        });

        setReceivedByList(receivedByLists);
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const getAllStates = () => {
    try {
      return stateDetails().then((result: any) => {
        let data = result?.data;
        const stateLists = data?.map((uniqueData: any) => {
          return {
            id: uniqueData.id,
            name: uniqueData.name,
          };
        });

        setStateList(stateLists);
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const getAllHabitation = useCallback(
    debounce(async (search?: string | number) => {
      try {
        const data = {
          search: search,
          page: 1,
          size: "20",
        };
        return getAllHabitationLists(data).then((result: any) => {
          let data = result?.data;
          // console.log("data from getAllHabitationLists", data);

          setHabitationList(data);
        });
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }, 300),
    []
  );
  const generatePetitionNo = useCallback(async (date: any) => {
    // if (id !== undefined && isEdit) {
    //   console.log("generatePetitionNo");
    //   return false;
    // } else {
    try {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");

      setIsPageLoader(true);
      return await generatePetitionNumber(formattedDate).then((result: any) => {
        let data = result?.data;

        setInfoData((prev: any) => ({
          ...prev,
          petitionNo: data,
        }));
        handleValidation({
          target: {
            name: "petitionNo",
            value: data,
          },
        });
        setIsPageLoader(false);
      });
    } catch (error) {
      console.error("An error occurred:", error);
      setIsPageLoader(false);
    }
    // }
  }, []);

  // useEffect(() => {
  //   // if (infoData.dateAndTime && id !== undefined && !isEdit) {
  //   generatePetitionNo(infoData.dateAndTime);
  //   // }
  // }, [infoData.dateAndTime]);

  const getPetitionDataById = async () => {
    if (id !== undefined) {
      try {
        setIsPageLoader(true);
        return await getPetitionById(id).then((result: any) => {
          let data = result?.data;
          // console.log(
          //   "result?.petitionDepartment",
          //   data.petitionDepartment.map((item: any) => item.department)
          // );
          setInfoData(() => ({
            ...infoData,
            petitionNo: data?.petitionNo,
            dateAndTime: dayjs(data?.dateAndTime),
            complaintMode: Number(data?.modeOfCompliant),
            receivedBy: data.receivedBy,
            referredBy: data.referredBy,
            petitionerName: data.petitionerName,
            mobile: data.mobile,
            email: data.email,
            department: data?.petitionDepartment?.map(
              (item: any) => item?.department
            ),
            issueType: data.typeOfIssue,
            isFieldVisitRequired: data?.isFieldVisitRequired == 1 ? 1 : 2,
            address: data.address,
            panchayat: data?.habitation?.panchayat?.name,
            habitation: data?.habitation?.id,
            habitation_input: data?.habitation?.name,
            taluk: data?.habitation?.panchayat?.taluk?.name,
            district: data?.habitation?.panchayat?.district?.name,
            state: data.stateId,
          }));
          setIsPageLoader(false);
        });
      } catch (error) {
        console.error("An error occurred:", error);
        setIsPageLoader(false);
      }
    }
  };

  useEffect(() => {
    getAllDepartments();
    getAllModeOfComplaints();
    getAllReceivedBy();
    getAllStates();
    getAllHabitation();

    getPetitionDataById();
    if (!id) {
      generatePetitionNo(infoData.dateAndTime);
    }
  }, []);

  const {
    petitionNo,
    dateAndTime,
    complaintMode,
    petitionerName,
    department,
    address,
    panchayat,
    habitation,
    taluk,
    district,
    state,
  } = infoData;

  const createPetition = async () => {
    if (
      petitionNo == "" ||
      dateAndTime == null ||
      complaintMode == null ||
      petitionerName == "" ||
      // (Array.isArray(department) && department.length === 0) ||
      department.length < 1 ||
      address == "" ||
      panchayat == null ||
      habitation == null ||
      taluk == null ||
      district == null ||
      state == null
    ) {
      validateForm();
    } else {
      try {
        setIsLoading(true);

        let data: any = {
          petitionNo: infoData.petitionNo,
          dateAndTime: infoData.dateAndTime,
          modeOfCompliant: infoData.complaintMode,
          petitionerName: infoData.petitionerName,
          referredBy: infoData.referredBy,
          receivedBy: infoData.receivedBy,
          mobile: infoData.mobile,
          email: infoData.email,
          typeOfIssue: infoData.issueType,
          isFieldVisitRequired: infoData.isFieldVisitRequired == "1" ? 1 : 0,
          address: infoData.address,
          habitationId: infoData?.habitation?.id,
          panchayatId: infoData?.habitation?.PanchayatId,
          districtId: infoData?.habitation?.panchayat?.districtId,
          talukId: infoData?.habitation?.panchayat?.talukId,
          stateId: infoData.state,
          departmentId: infoData?.department?.map(
            (department: any) => department.id
          ),
        };
        // console.log("create data", data);
        await createPetitionDetail(data);
        setIsLoading(false);
        navigate(`${petitionListUrl}${listUrl}`);
        dispatch(
          setSnackBarSuccess({
            snackBarMessage: petitionPageConst.PETITION_CREATED,
          })
        );
      } catch (error: any) {
        console.log("Error occurred:", error);
        setIsLoading(false);
        dispatch(
          setSnackBarFailed({
            snackBarMessage: error?.response?.data?.message,
          })
        );
      }
    }
    // navigate(-1);
  };

  const editPetition = async () => {
    if (
      petitionNo == "" ||
      dateAndTime == null ||
      complaintMode == null ||
      petitionerName == "" ||
      // (Array.isArray(department) && department.length === 0) ||
      department.length < 1 ||
      address == "" ||
      panchayat == null ||
      habitation == null ||
      taluk == null ||
      district == null ||
      state == null
    ) {
      validateForm();
    } else {
      setIsLoading(true);
      try {
        let editData: any = {
          petitionNo: infoData.petitionNo,
          dateAndTime: infoData.dateAndTime,
          modeOfCompliant: infoData.complaintMode,
          petitionerName: infoData.petitionerName,
          referredBy: infoData.referredBy,
          receivedBy: infoData.receivedBy,
          mobile: infoData.mobile,
          email: infoData.email,
          typeOfIssue: infoData.issueType,
          isFieldVisitRequired: infoData.isFieldVisitRequired == "1" ? 1 : 0,
          address: infoData.address,
          habitationId: infoData?.habitation?.id,
          panchayatId: infoData?.habitation?.PanchayatId,
          districtId: infoData?.habitation?.districtId,
          talukId: infoData?.habitation?.talukId,
          stateId: infoData.state,
          departmentId: infoData?.department?.map(
            (department: any) => department.id
          ),
        };
        // console.log("update data", editData);
        await updatePetitionById(id, editData);
        setIsLoading(false);
        navigate(`${petitionListUrl}${listUrl}`);
        dispatch(
          setSnackBarSuccess({
            snackBarMessage: petitionPageConst.PETITION_UPDATED,
          })
        );
      } catch (error: any) {
        console.log("Error occurred:", error);
        setIsLoading(false);
        dispatch(
          setSnackBarFailed({
            snackBarMessage: error?.response?.data?.message,
          })
        );
      }
    }
    // navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleClick = () => {};

  const handleEdit = () => {
    setIsDisabled(!isDisabled);
  };

  const complaintModeOptions = [
    { id: 1, name: "yyy" },
    { id: 2, name: "zzz" },
  ];
  useEffect(() => {
    if (id !== undefined) {
      setIsDisabled(true);
    }
  }, []);

  return isPageLoader ? (
    <PageLoader />
  ) : (
    <Grid
      container
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        m: "0px 0px 30px 0px",
        minHeight: "100px",
        height: "auto",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: {
            xl: "75%",
            lg: "85%",
            md: "90%",
            sm: "100%",
          },
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        {id == undefined ? (
          <Typography variant="h2" color="textPrimary.main">
            Add Petition
          </Typography>
        ) : (
          <>
            <Typography variant="h2" color="textPrimary.main">
              View Petition
            </Typography>
            {isDisabled && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ":hover": {
                    backgroundColor: "#F9FAFB",
                  },
                  gap: 1,
                  p: 1,
                  cursor: "pointer",
                }}
                onClick={handleEdit}
              >
                <EditIcon />
                <Typography variant="h5" color="primary.main">
                  Edit
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
      <Typography
        variant="h4"
        color="primary.main"
        sx={{ width: "100%", mb: 3 }}
      >
        Petition Information
      </Typography>

      <TextField
        name={fieldData.petitionNo.name}
        value={fieldData.petitionNo.value}
        label={
          <span>
            Petition No
            <span style={{ color: "#F43F5E" }}> *</span>
          </span>
        }
        placeholder={"Enter Petition No"}
        onChange={handleInputChange}
        helperText={fieldData?.petitionNo?.helperText}
        error={Boolean(fieldData?.petitionNo?.isError)}
        sx={{ ...styles.textFieldStyle }}
        disabled={isDisabled}
      />

      <DateTimePicker
        name={fieldData.dateAndTime.name}
        // value={dayjs(fieldData.dateAndTime.value)}
        value={fieldData.dateAndTime.value}
        format="DD/MM/YYYY hh:mm:ss A"
        label={
          <span>
            Date And Time
            <span style={{ color: "#F43F5E" }}> *</span>
          </span>
        }
        placeholder={fieldData.dateAndTime.placeholder}
        onChange={(newValue: any) =>
          handleDateAndTimeChange(newValue, "dateAndTime")
        }
        helperText={fieldData?.dateAndTime?.helperText}
        error={Boolean(fieldData?.dateAndTime?.isError)}
        sx={{
          width: "431px",
          "& .MuiOutlinedInput-root": {
            height: "48px",
            borderRadius: "5px",
            paddingLeft: "8px",
            boxShadow: "none",
          },
          mr: "130px",
        }}
        disabled={isDisabled}
      />
      <Select
        name={fieldData.complaintMode.name}
        value={fieldData.complaintMode.value}
        label={
          <span>
            Mode of complaint
            <span style={{ color: "#F43F5E" }}> *</span>
          </span>
        }
        placeholder={fieldData.complaintMode.placeholder}
        options={modeOfComplaints}
        onChange={handleInputChange}
        width="431px"
        helperText={fieldData?.complaintMode?.helperText}
        error={Boolean(fieldData?.complaintMode?.isError)}
        sx={{
          ...styles.selectStyle,
        }}
        disabled={isDisabled}
      />
      <Box sx={{ width: "432px", display: "flex", mr: "130px" }}>
        <Select
          name={fieldData.receivedBy.name}
          value={fieldData.receivedBy.value}
          label={fieldData.receivedBy.label}
          placeholder={fieldData.receivedBy.placeholder}
          options={receivedByList}
          onChange={handleInputChange}
          helperText={fieldData?.receivedBy?.helperText}
          error={Boolean(fieldData?.receivedBy?.isError)}
          width="202px"
          sx={{
            ...styles.selectStyle,
            width: "202px",
            marginRight: "30px",
          }}
          disabled={isDisabled}
        />
        <TextField
          name={fieldData.referredBy.name}
          value={fieldData.referredBy.value}
          label={fieldData.referredBy.label}
          placeholder={fieldData.referredBy.placeholder}
          // options={referredByList}
          onChange={handleInputChange}
          helperText={fieldData?.referredBy?.helperText}
          error={Boolean(fieldData?.referredBy?.isError)}
          // width="202px"
          sx={{ ...styles.textFieldStyle, width: "202px" }}
          disabled={isDisabled}
        />
      </Box>
      <TextField
        name={fieldData.petitionerName.name}
        value={fieldData.petitionerName.value}
        label={
          <span>
            Petitioner Name
            <span style={{ color: "#F43F5E" }}> *</span>
          </span>
        }
        placeholder={fieldData.petitionerName.placeholder}
        onChange={handleInputChange}
        helperText={fieldData?.petitionerName?.helperText}
        error={Boolean(fieldData?.petitionerName?.isError)}
        sx={{ ...styles.textFieldStyle }}
        disabled={isDisabled}
      />
      <Box sx={{ width: "432px", display: "flex", mr: "130px" }}>
        <TextField
          name={fieldData.mobile.name}
          value={fieldData.mobile.value}
          label={fieldData.mobile.label}
          placeholder={fieldData.mobile.placeholder}
          helperText={fieldData?.mobile?.helperText}
          error={Boolean(fieldData?.mobile?.isError)}
          onChange={handleInputChange}
          sx={{ ...styles.textFieldStyle, width: "202px", marginRight: "30px" }}
          disabled={isDisabled}
        />
        <TextField
          name={fieldData.email.name}
          value={fieldData.email.value}
          label={fieldData.email.label}
          placeholder={fieldData.email.placeholder}
          onChange={handleInputChange}
          helperText={fieldData?.email?.helperText}
          error={Boolean(fieldData?.email?.isError)}
          sx={{ ...styles.textFieldStyle, width: "202px", marginRight: "0px" }}
          disabled={isDisabled}
        />
      </Box>
      <AutoCompleteWithCheckBoxes
        // name={fieldData.department.name}
        // value={fieldData.department.value}
        label={
          <span>
            Department
            <span style={{ color: "#F43F5E" }}> *</span>
          </span>
        }
        value={
          fieldData.department.value !== null
            ? fieldData.department.value
            : null
        }
        onChange={(event: any, newValue: any) => {
          setInfoData({
            ...infoData,
            department: newValue,
          });
          handleValidation({
            target: {
              name: "department",
              value: newValue,
            },
          });
        }}
        placeholder={fieldData.department.placeholder}
        options={departments}
        defaultValue={
          fieldData.department.value !== null
            ? fieldData.department.value
            : null
        }
        sx={{
          ...styles.selectStyle,
          "& .MuiOutlinedInput-root": {
            minHeight: "48px",
            borderRadius: "5px",
            paddingLeft: "8px",
            boxShadow: "none",
            p: "5px",
          },
          "& .MuiOutlinedInput-root .MuiAutocomplete-input": {
            p: "5px",
          },
          height: "auto",
        }}
        disabled={isDisabled}
        helperText={fieldData?.department?.helperText}
        error={Boolean(fieldData?.department?.isError)}
        tableFormat={false}
      />
      {/* <Textarea
        // size="md"
        // name="Size"
        // name={fieldData.issueType.name}
        // value={fieldData.issueType.value}
        // label={fieldData.issueType.label}
        // placeholder={fieldData.issueType.placeholder}
        // onChange={handleInputChange}
        // sx={{ ...styles.textFieldStyle, marginRight: "130px" }}
        // disabled={isDisabled}
      /> */}
      {/* <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          color="#6B7280"
          fontSize={"12px"}
          sx={{ mb: "5px", fontWeight: "400" }}
        >
         Type of Issue
        </Typography>
        <textarea
          name={fieldData.issueType.name}
          value={fieldData.issueType.value}
          // label={fieldData.issueType.label}
          placeholder={fieldData.issueType.placeholder}
          onChange={handleInputChange}
          style={{
            marginRight: "130px",
            width: "431px",
            height: "47px",
            padding: "15px 7px",
            boxSizing: "border-box", // Use camelCase instead of dashed
            border: "1px solid #E5E7EB",
            borderRadius: "5px",
            backgroundColor: "transparent",
            fontSize: "12px",
            resize: "none",
            fontFamily: "inter",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.border = "2px solid #F97D09")}
          // Revert to default border color on blur
          onBlur={(e) => (e.target.style.border = "1px solid #E5E7EB")}
          disabled={isDisabled}
        ></textarea>
      </Box> */}
      <TextField
        name={fieldData.issueType.name}
        value={fieldData.issueType.value}
        label={fieldData.issueType.label}
        placeholder={fieldData.issueType.placeholder}
        onChange={handleInputChange}
        helperText={fieldData?.issueType?.helperText}
        error={Boolean(fieldData?.issueType?.isError)}
        sx={{
          ...styles.textFieldStyle,
          "& .MuiInputBase-root": {
            fontSize: "12px",
          },
          marginRight: "130px",
        }}
        multiline={true}
        rows={1}
        maxRows={Infinity}
        disabled={isDisabled}
      />

      <Radio
        name={fieldData.isFieldVisitRequired.name}
        value={fieldData.isFieldVisitRequired.value}
        label={fieldData.isFieldVisitRequired.label}
        helperText={fieldData?.isFieldVisitRequired?.helperText}
        error={Boolean(fieldData?.isFieldVisitRequired?.isError)}
        onChange={(e: any) => {
          handleRadioChange(e);
        }}
        options={[
          {
            id: 1,
            value: "Yes",
          },
          {
            id: 2,
            value: "No",
          },
        ]}
        sx={{ width: "432px", mr: "130px" }}
        disabled={isDisabled}
      />
      <Typography variant="h4" color="primary.main" sx={{ width: "100%" }}>
        Address Information
      </Typography>
      <TextField
        name={fieldData.address.name}
        value={fieldData.address.value}
        label={
          <span>
            Address
            <span style={{ color: "#F43F5E" }}> *</span>
          </span>
        }
        placeholder={fieldData.address.placeholder}
        onChange={handleInputChange}
        helperText={fieldData?.address?.helperText}
        error={Boolean(fieldData?.address?.isError)}
        sx={{ ...styles.textFieldStyle }}
        disabled={isDisabled}
      />
      {/* <Box sx={{ width: "432px", }}> */}
      <AutoComplete
        key={isAutoCompleteClear}
        label={
          <span>
            Habitation
            <span style={{ color: "#F43F5E" }}> *</span>
          </span>
        }
        placeholder="Select Habitation"
        name={fieldData?.habitation?.name}
        value={fieldData?.habitation?.value}
        inputValue={fieldData?.habitation?.habitation_input}
        disabled={isDisabled}
        disableClearable={true}
        freeSolo={false}
        helperText={fieldData?.habitation?.helperText}
        error={Boolean(fieldData?.habitation?.isError)}
        onChange={(e: any, newValue: any) => {
          handleAutoCompleteChange(e, newValue, "habitation");
        }}
        onInputChange={(e: any, newInputValue: any) => {
          handleAutoCompleteInputChange(e, newInputValue, "habitation_input");
        }}
        renderOption={(props: any, option: any) => {
          return (
            <MenuItem
              key={option.id}
              sx={{
                "&:hover, &.Mui-focused:hover": {
                  color: "backgroundPrimary.main",
                  backgroundColor: "primary.main",
                },
                borderRadius: "5px",
                p: "15px",
                m: "0 5px",
                gap: 10,
              }}
              {...props}
            >
              <Box>{option?.panchayat?.name}</Box>
              <Box
                sx={{
                  width: "432px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                ( {option?.name})
              </Box>
            </MenuItem>
          );
        }}
        getOptionLabel={(option: any) => option?.name}
        filterOptions={(options: any, state: any) => {
          const inputValue = state?.inputValue?.toLowerCase();

          return options?.filter(
            (option: any) =>
              option?.name?.toLowerCase()?.includes(inputValue) ||
              option?.panchayat?.name?.toLowerCase()?.includes(inputValue)
          );
        }}
        options={habitationList}
        optionName="name"
        sx={{
          width: "432px",
          marginRight: "30px",
          borderRadius: "5px",
          height: "auto",
          display: "flex",
          mr: "130px",
        }}
      />

      {/* <TextField
          name={fieldData.habitation.name}
          value={fieldData.habitation.value}
          label={
            <span>
              Habitation
              <span style={{ color: "#F43F5E" }}> *</span>
            </span>
          }
          placeholder={fieldData.habitation.placeholder}
          onChange={handleInputChange}
          sx={{ ...styles.textFieldStyle, width: "202px", marginRight: "30px" }}
          disabled={isDisabled}
        /> */}
      {/* </Box> */}
      <Box sx={{ width: "432px", display: "flex", marginRight: "130px" }}>
        <TextField
          name={fieldData.panchayat.name}
          value={fieldData.panchayat.value}
          label={
            <span>
              Panchayat
              <span style={{ color: "#F43F5E" }}> *</span>
            </span>
          }
          placeholder={fieldData.panchayat.placeholder}
          helperText={fieldData?.panchayat?.helperText}
          error={Boolean(fieldData?.panchayat?.isError)}
          onChange={handleInputChange}
          sx={{
            ...styles.textFieldStyle,
            width: "202px",
            // marginRight: "130px",
            marginRight: "30px",
          }}
          disabled={isDisabled || isDefaultDisabled}
        />
        <TextField
          name={fieldData.taluk.name}
          value={fieldData.taluk.value}
          label={
            <span>
              Taluk
              <span style={{ color: "#F43F5E" }}> *</span>
            </span>
          }
          placeholder={fieldData.taluk.placeholder}
          onChange={handleInputChange}
          helperText={fieldData?.taluk?.helperText}
          error={Boolean(fieldData?.taluk?.isError)}
          sx={{ ...styles.textFieldStyle, width: "202px", marginRight: "30px" }}
          disabled={isDisabled || isDefaultDisabled}
        />
      </Box>
      <Box sx={{ width: "432px", display: "flex", marginRight: "130px" }}>
        <TextField
          name={fieldData.district.name}
          value={fieldData.district.value}
          label={
            <span>
              District
              <span style={{ color: "#F43F5E" }}> *</span>
            </span>
          }
          placeholder={fieldData.district.placeholder}
          onChange={handleInputChange}
          helperText={fieldData?.district?.helperText}
          error={Boolean(fieldData?.district?.isError)}
          sx={{
            ...styles.textFieldStyle,
            width: "202px",
            marginRight: "30px",
          }}
          disabled={isDisabled || isDefaultDisabled}
        />
        <Select
          name={fieldData.state.name}
          value={fieldData.state.value}
          label={
            <span>
              State
              <span style={{ color: "#F43F5E" }}> *</span>
            </span>
          }
          placeholder={fieldData.state.placeholder}
          onChange={handleInputChange}
          helperText={fieldData?.state?.helperText}
          error={Boolean(fieldData?.state?.isError)}
          options={stateList}
          width="202px"
          sx={{
            ...styles.selectStyle,
            width: "202px",
          }}
          disabled={isDisabled}
        />
      </Box>

      {/* <TextField
        name={fieldData.state.name}
        value={fieldData.state.value}
        label={
          <span>
            State
            <span style={{ color: "#F43F5E" }}> *</span>
          </span>
        }
        placeholder={fieldData.state.placeholder}
        onChange={handleInputChange}
        helperText={fieldData?.state?.helperText}
        error={Boolean(fieldData?.state?.isError)}
        sx={{ ...styles.textFieldStyle }}
        disabled={isDisabled}
      /> */}
      {!isDisabled && (
        <Box
          sx={{ width: "432px", display: "flex", marginRight: "130px", gap: 3 }}
        >
          <Button
            buttonText="Submit"
            loading={isLoading}
            sx={{
              width: "95px",
              height: "40px",
              mt: 3.5,
              mb: 2,
              fontSize: "13px",
              color: "white",
            }}
            onClick={id == undefined ? createPetition : editPetition}
          />
          <CancelButton
            buttonText="Cancel"
            sx={{
              width: "95px",
              height: "40px",
              mt: 3.5,
              mb: 2,
              fontSize: "13px",
            }}
            handleClick={handleCancel}
          />
        </Box>
      )}
    </Grid>
  );
};

export default PetitionsAddAndEdit;
