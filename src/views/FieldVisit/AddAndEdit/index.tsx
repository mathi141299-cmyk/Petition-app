import { Box, Grid, Typography, debounce } from "@mui/material";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  DateTimePicker,
  PageLoader,
  Radio,
  Select,
  TextField,
} from "../../../components/basic";
import {
  BrowseIcon,
  EditIcon,
  LocationPic,
  PdfImg,
  PicDeleteIcon,
} from "../../../assets/icons";
import CancelButton from "../../../components/basic/button/cancelButton";
import { useNavigate, useParams } from "react-router-dom";
import AutoCompleteWithCheckBoxes from "../../../components/basic/autocompletewithcheckbox";
import {
  createFieldVisitDetail,
  getFieldVisitById,
  updateFieldVisitById,
  getPetitionsList,
} from "../../../services/fieldvisitService";
import { useDispatch } from "react-redux";
import {
  setSnackBarFailed,
  setSnackBarSuccess,
} from "../../../redux/slices/snackbar";
import {
  deleteConst,
  fieldVisitPageConst,
  letterPageConst,
  petitionPageConst,
} from "../../../constants/displayText";
import {
  requiredValidator,
  updateFormDataWithHelperText,
} from "../../../utils/ValidationUtils";
import { RouteUrls } from "../../../constants/routes";
import {
  deleteFile,
  getFileUploadDataById,
} from "../../../services/fileUploadService";
import ConfirmationDialog from "../../../components/shared/confirmationDialog";
import moment from "moment";

const FieldVisitAddAndEdit = () => {
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
    visitDate: "",
    visitBy: "",
    visitReport: "",
    letterRequired: "",
    fieldVisitStatus: "",
  };

  const [infoError, setInfoError] = useState<any>(initialInfoError);

  const initialInfoData = {
    petitionNo: [],
    visitDate: null,
    visitBy: "",
    visitReport: "",
    letterRequired: 2,
    fieldVisitStatus: null,
  };

  const [infoData, setInfoData] = useState<any>(initialInfoData);
  // console.log("infoData", infoData);
  const fieldData = {
    petitionNo: {
      label: "Petition No",
      name: "petitionNo",
      value: infoData.petitionNo,
      placeholder: "Select petition Number",
      isError: infoError.petitionNo === "" ? false : true,
      helperText: infoError.petitionNo,
      isDisabled: false,
      isRequiredField: true,
    },
    visitDate: {
      label: "Visit Date",
      name: "visitDate",
      value: infoData.visitDate,
      placeholder: "Select Visit Date",
      isError: infoError.visitDate === "" ? false : true,
      helperText: infoError.visitDate,
      isDisabled: false,
      isRequired: true,
    },
    visitBy: {
      label: "Visit By",
      name: "visitBy",
      value: infoData.visitBy,
      placeholder: "Enter Visit By",
      isError: infoError.visitBy === "" ? false : true,
      helperText: infoError.visitBy,
      isDisabled: false,
      isRequired: true,
    },
    visitReport: {
      label: "Visit Report",
      name: "visitReport",
      value: infoData.visitReport,
      placeholder: "Select Visit Report",
      isError: infoError.visitReport === "" ? false : true,
      helperText: infoError.visitReport,
      isDisabled: false,
      isRequired: true,
    },

    letterRequired: {
      label: "Letter Required",
      name: "letterRequired",
      value: infoData.letterRequired,
      placeholder: "",
      isError: infoError.letterRequired === "" ? false : true,
      helperText: infoError.letterRequired,
      isDisabled: false,
      isRequired: false,
    },
    fieldVisitStatus: {
      label: "Field Visit Status",
      name: "fieldVisitStatus",
      value: infoData.fieldVisitStatus,
      placeholder: "Select Field Visit Status",
      isError: infoError.fieldVisitStatus === "" ? false : true,
      helperText: infoError.fieldVisitStatus,
      isDisabled: false,
      isRequired: false,
    },
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [infoFieldData, setInfoFieldData] = useState<any>(fieldData);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [existingFiles, setExistingFiles] = useState<any>([]);
  const [shouldTriggerClick, setShouldTriggerClick] = useState<any>(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isPageLoader, setIsPageLoader] = useState(false);
  const [isDefaultDisabled, setIsDefaultDisabled] = useState(true);
  const { fieldVisitUrl, createUrl, editUrl, listUrl } = RouteUrls;
  const [petitionsList, setPetitionsList] = useState<any>([]);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState<any>(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isAutoCompleteLoading, setIsAutoCompleteLoading] = useState(false);
  // console.log("selectedFiles", selectedFiles);

  const handleValidation = (e: any) => {
    const { name, value, label } = e.target;

    switch (name) {
      case "petitionNo": {
        const newValue = value?.map((item: any) => item?.petitionNo).join(", ");

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
    setInfoData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (newValue: any, name: any) => {
    // console.log("handleDateChange", newValue);
    const formattedDate =
      newValue !== null ? dayjs(newValue)?.format("MM/DD/YYYY") : null;
    setInfoData((prevBookingData: any) => ({
      ...prevBookingData,
      [name]: formattedDate,
    }));

    handleValidation({
      target: {
        name: "visitDate",
        value: newValue,
      },
    });
  };
  const handleRadioChange = (e: any) => {
    const key = e?.target?.name;
    const value = e?.target?.value;
    setInfoData((prevBookingData: any) => ({
      ...prevBookingData,
      [key]: value,
    }));
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event?.target?.files;
    if (files) {
      setSelectedFiles((prevSelectedFiles: any) => [
        ...prevSelectedFiles,
        ...Array.from(files),
      ]);
    }
  };
  const handleDelete = (index: number) => {
    setSelectedFiles((prevSelectedFiles: any) =>
      prevSelectedFiles.filter((_: any, i: number) => i !== index)
    );
  };
  const handleDeleteFile = async (id: number) => {
    try {
      setIsButtonLoading(true);

      await deleteFile(id).then((result: any) => {
        dispatch(
          setSnackBarSuccess({
            snackBarMessage: deleteConst.FILE_DELETED as string,
          })
        );
        // getLetterFormatsByLetterId();
        // setIsPageLoader(false);
        getFileUploadDataByFieldVisitId();
        setIsConfirmationDialogOpen(false);
        setIsButtonLoading(false);
        setIdToBeDeleted(null);
      });
    } catch {
      setIsConfirmationDialogOpen(false);
      setIsButtonLoading(false);
      setIdToBeDeleted(null);
      dispatch(
        setSnackBarFailed({
          snackBarMessage: "something went wrong",
        })
      );
    }
  };

  const formatFileSize = (size: any) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
  };
  const handleSubmit = () => {
    navigate(-1);
  };
  const handleCancel = () => {
    navigate(-1);
  };
  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e?.dataTransfer?.files;
    if (files) {
      setSelectedFiles((prevSelectedFiles: any) => [
        ...prevSelectedFiles,
        ...Array.from(files),
      ]);
    }
    setIsDragOver(false);
  };
  const handleEdit = () => {
    setIsDisabled(!isDisabled);
  };
  const onConfirmationDialogClose = () => {
    setIsConfirmationDialogOpen(false);
  };
  const handleConfirmDelete = async () => {
    if (idToBeDeleted === null) {
      return false;
    } else {
      handleDeleteFile(idToBeDeleted);
    }
  };
  useEffect(() => {
    if (id !== undefined) {
      setIsDisabled(true);
    }
  }, []);

  const getFieldVisitDataById = async () => {
    if (id !== undefined) {
      try {
        setIsPageLoader(true);
        await getFieldVisitById(id).then((result: any) => {
          let data = result?.data;
          // console.log("result?.petitionDepartment", data);
          const petitionFieldVisitDetail = data?.petitionFieldVisitDetails?.map(
            (data: any) => data.petition
          );
          // const petition = petitionFieldVisitDetail?.petition;
          // console.log("petitionFieldVisitDetail", petitionFieldVisitDetail);
          setInfoData(() => ({
            ...infoData,
            petitionNo: petitionFieldVisitDetail,
            visitDate: data.visitDate,
            visitBy: data.visitBy,
            visitReport: data.visitReport,
            letterRequired:
              data.isLetterRequired == null
                ? 2
                : data.isLetterRequired == 1
                ? 1
                : 2,
            fieldVisitStatus: data.fieldVisitStatus,
          }));
          setIsPageLoader(false);
        });
      } catch (error) {
        console.error("An error occurred:", error);
        setIsPageLoader(false);
      }
    }
  };

  const createPetition = async () => {
    if (infoData.petitionNo == null) {
      validateForm();
    } else {
      try {
        setIsLoading(true);

        let data: any = {
          petition_no: infoData?.petitionNo?.map(
            (petition: any) => petition?.id
          ),
          visitDate: infoData.visitDate,
          visitBy: infoData.visitBy,
          visitReport: infoData.visitReport,
          letterRequired: infoData.isLetterRequired == 1 ? 1 : 0,
        };
        // console.log("create data", data);
        await createFieldVisitDetail(data);
        setIsLoading(false);
        navigate(`${fieldVisitUrl}${listUrl}`);
        dispatch(
          setSnackBarSuccess({
            snackBarMessage: fieldVisitPageConst.FIELDVISIT_CREATED,
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

  const editFieldVisit = async () => {
    if (infoData?.petitionNo?.length < 1) {
      validateForm();
    } else {
      setIsLoading(true);

      try {
        const formData: any = new FormData();
        formData.append("fieldVisitId", id); // Ensure id is a string
        // selectedFiles.forEach((file: any) => {
        //   formData.append("file", selectedFiles);
        // });

        // infoData.petitionNo.forE((petitionNo: any, index: any) => {
        //   formData.append(`petitionNo`, petitionNo.id);
        // });
        // for (let i = 0; i < selectedFiles.length; i++) {
        //   formData.append("file", selectedFiles[i]);
        // }
        // for (const file of selectedFiles) {
        //   formData.append("file", file);
        // }
        selectedFiles?.forEach((file: any) => {
          formData.append("file", file);
        });
        formData.append(
          "petitionNo",
          JSON?.stringify(
            infoData?.petitionNo?.map((petitionNo: any) => petitionNo?.id)
          )
        ); //

        // infoData.petitionNo.forEach((petition: any) => {
        //   formData.append("petitionNo", petition.id);
        // });

        // Append other fields to FormData
        const formattedDate = moment(infoData.visitDate).format("MM/DD/YYYY");
        // if (infoData.visitDate) {
        formData.append("visitDate", infoData.visitDate);
        // or you can omit this line as FormData will handle null/undefined as empty
        // }

        // infoData.visitBy !== "" &&
        // if (infoData.visitBy) {
        formData.append("visitBy", infoData.visitBy);
        // }
        // if (infoData.visitReport) {
        formData.append("visitReport", infoData.visitReport);
        // }
        formData.append(
          "isLetterRequired",
          infoData.letterRequired == "1" ? 1 : 0
        );
        formData.append("fieldVisitStatus", infoData.fieldVisitStatus);

        // // Append files to FormData
        // selectedFiles.forEach((file: any, index: any) => {
        //   formData.append(`files[${index}]`, file);
        // });

        // let editData: any = {
        //   petitionNo: infoData.petitionNo.map(
        //     (petitionNo: any) => petitionNo.id
        //   ),
        //   visitDate: infoData.visitDate,
        //   visitBy: infoData.visitBy,
        //   visitReport: infoData.visitReport,
        //   isLetterRequired: infoData.letterRequired == "1" ? 1 : 0,
        //   fieldVisitStatus: infoData.fieldVisitStatus,
        //   files: selectedFiles,
        //   // fieldVisitId: id,
        //   // formData,
        // };
        // console.log("update data", editData);
        await updateFieldVisitById(id, formData);
        // console.log("update data two", editData);

        setIsLoading(false);
        navigate(`${fieldVisitUrl}${listUrl}`);
        dispatch(
          setSnackBarSuccess({
            snackBarMessage: fieldVisitPageConst.FIELD_VISIT_UPDATED,
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
  // const editFieldVisit = async () => {
  //   if (infoData.petitionNo == null) {
  //     validateForm();
  //     return; // Ensure function exits if validation fails
  //   }

  //   setIsLoading(true);
  //   const formData = new FormData();

  //   try {
  //     // Append non-file fields to FormData
  //     formData.append("fieldVisitId", String(id));
  //     formData.append(
  //       "petitionNo",
  //       JSON.stringify(
  //         infoData.petitionNo.map((petitionNo: any) => petitionNo.id)
  //       )
  //     ); // Sending array as JSON string
  //     formData.append("visitDate", infoData.visitDate);
  //     formData.append("visitBy", infoData.visitBy);
  //     formData.append("visitReport", infoData.visitReport);
  //     formData.append(
  //       "isLetterRequired",
  //       String(infoData.letterRequired == "1" ? 1 : 0)
  //     );
  //     formData.append("fieldVisitStatus", infoData.fieldVisitStatus);

  //     // Append files
  //     for (let i = 0; i < selectedFiles.length; i++) {
  //       formData.append("file", selectedFiles[i]);
  //     }

  //     // Send the form data
  //     await updateFieldVisitById(id, formData);

  //     setIsLoading(false);
  //     navigate(`${fieldVisitUrl}${listUrl}`);
  //     dispatch(
  //       setSnackBarSuccess({
  //         snackBarMessage: petitionPageConst.PETITION_UPDATED,
  //       })
  //     );
  //   } catch (error: any) {
  //     console.log("Error occurred:", error);
  //     setIsLoading(false);
  //     dispatch(
  //       setSnackBarFailed({
  //         snackBarMessage: error.response.data.message,
  //       })
  //     );
  //   }
  // };

  const getAllPetitions = useCallback(
    debounce(async (search?: string | number) => {
      try {
        setIsAutoCompleteLoading(true);
        const data = {
          search: search,
          page: 1,
          size: "20",
        };
        return getPetitionsList(data).then((result: any) => {
          let data = result?.data?.rows;
          // console.log("result?.rows", result?.data.rows);

          setPetitionsList(data);
          setIsAutoCompleteLoading(false);
        });
      } catch (error) {
        console.error("An error occurred:", error);
        setIsAutoCompleteLoading(false);
      }
    }, 300),
    []
  );

  const getFileUploadDataByFieldVisitId = async () => {
    if (id !== undefined) {
      try {
        setIsPageLoader(true);
        await getFileUploadDataById(id, "fieldVisitId").then((result: any) => {
          let data = result?.data;

          setExistingFiles(data);

          setIsPageLoader(false);
        });
      } catch (error) {
        console.error("An error occurred:", error);
        setIsPageLoader(false);
      }
    }
  };

  useEffect(() => {
    getFieldVisitDataById();
    getAllPetitions();
    getFileUploadDataByFieldVisitId();
  }, []);

  const handleAutoCompleteWithCheckBoxChange = useCallback(
    (e: any, newValue: any) => {
      setInfoData({
        ...infoData,
        petitionNo: newValue,
      });
      handleValidation({
        target: {
          name: "petitionNo",
          value: newValue,
        },
      });
    },

    [handleValidation]
  );
  const handleAutoCompleteWithCheckBoxInputChange = (e: any, newValue: any) => {
    if (newValue === "") {
      return false;
    }
    setInputValue(newValue);
  };
  useEffect(() => {
    const handleBackspace = (event: any) => {
      if (event?.key === "Backspace" && inputValue?.length === 1) {
        setInputValue("");
      }
    };

    window?.addEventListener("keydown", handleBackspace);

    return () => {
      window?.removeEventListener("keydown", handleBackspace);
    };
  }, [inputValue]);
  useEffect(() => {
    getAllPetitions(inputValue);
  }, [inputValue]);
  return isPageLoader ? (
    <PageLoader />
  ) : (
    <>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          m: "0px 0px 30px 0px",
          minHeight: "100px",
          height: "auto",
          gap: 4,
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
          }}
        >
          {id == undefined ? (
            <Typography variant="h2" color="textPrimary.main">
              Field Visit
            </Typography>
          ) : (
            <>
              <Typography variant="h2" color="textPrimary.main">
                View Field Visit
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
        <Typography variant="h4" color="primary.main" sx={{ width: "100%" }}>
          Petition Information
        </Typography>
        {/* <TextField
          name={fieldData.petitionNo.name}
          value={fieldData.petitionNo.value}
          label={fieldData.petitionNo.label}
          placeholder={"Enter Petition No"}
          onChange={handleInputChange}
          sx={{ ...styles.textFieldStyle }}
          disabled={isDisabled}
        /> */}
        <AutoCompleteWithCheckBoxes
          // name={fieldData.department.name}
          // value={fieldData.department.value}
          label={
            <span>
              Petition No
              <span style={{ color: "#F43F5E" }}> *</span>
            </span>
          }
          value={
            Array.isArray(fieldData.petitionNo.value)
              ? fieldData.petitionNo.value
              : []
          }
          // value={fieldData.petitionNo.value || []}

          onChange={(event: any, newValue: any) => {
            handleAutoCompleteWithCheckBoxChange(event, newValue);
          }}
          inputValue={inputValue}
          onInputChange={(e: any, newInputValue: any) => {
            handleAutoCompleteWithCheckBoxInputChange(e, newInputValue);
          }}
          placeholder={fieldData.petitionNo.placeholder}
          options={petitionsList}
          // defaultValue={fieldData.petitionNo.value || []}
          defaultValue={
            Array.isArray(fieldData.petitionNo.value)
              ? fieldData.petitionNo.value
              : []
          }
          loading={isAutoCompleteLoading}
          sx={{
            ...styles.selectStyle,

            height: "auto",
            minHeight: "48px",
            // overflow: "hidden",
            "& .MuiOutlinedInput-root": {
              width: "auto",
              height: "auto",
              minHeight: "48px",
              borderRadius: "5px",
              paddingLeft: "8px",
              boxShadow: "none",
              p: "5px",
            },
            "& .MuiOutlinedInput-root .MuiAutocomplete-input": {
              p: "5px",
            },
          }}
          helperText={fieldData?.petitionNo?.helperText}
          error={Boolean(fieldData?.petitionNo?.isError)}
          tableFormat={true}
          disabled={isDisabled}
          PopperWidth={"432px"}
          disableCloseOnSelect={false}
        />
        {/* <TextField
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
          disabled={isDisabled || isDefaultDisabled}
        /> */}
        <DatePicker
          name={fieldData.visitDate.name}
          // value={dayjs(fieldData.visitDate.value)}
          value={
            fieldData.visitDate.value ? dayjs(fieldData.visitDate.value) : null
          }
          label={
            <span>
              Visit Date
              {/* <span style={{ color: "#F43F5E" }}> *</span> */}
            </span>
          }
          // placeholder={fieldData.dateAndTime.placeholder}
          onChange={(newValue: any) => handleDateChange(newValue, "visitDate")}
          sx={{
            width: "431px",
            "& .MuiOutlinedInput-root": {
              height: "48px",
              borderRadius: "5px",
              paddingLeft: "8px",
              boxShadow: "none",
            },
            mr: "130px",
            // mb:"25px"
          }}
          disabled={isDisabled}
          helperText={fieldData?.visitDate?.helperText}
          error={Boolean(fieldData?.visitDate?.isError)}
        />
        <TextField
          name={fieldData.visitBy.name}
          value={fieldData.visitBy.value}
          label={fieldData.visitBy.label}
          placeholder={"Enter Visit By"}
          onChange={handleInputChange}
          sx={{ ...styles.textFieldStyle }}
          disabled={isDisabled}
          helperText={fieldData?.visitBy?.helperText}
          error={Boolean(fieldData?.visitBy?.isError)}
        />{" "}
        <TextField
          name={fieldData.visitReport.name}
          value={fieldData.visitReport.value}
          label={fieldData.visitReport.label}
          placeholder={"Enter Visit Report"}
          onChange={handleInputChange}
          sx={{
            ...styles.textFieldStyle,
            "& .MuiInputBase-root": {
              fontSize: "12px",
            },
          }}
          disabled={isDisabled}
          helperText={fieldData?.visitReport?.helperText}
          error={Boolean(fieldData?.visitReport?.isError)}
          multiline={true}
          rows={1}
          maxRows={Infinity}
        />
        <Select
          name={fieldData.fieldVisitStatus.name}
          value={fieldData.fieldVisitStatus.value}
          label={fieldData.fieldVisitStatus.label}
          placeholder={fieldData.fieldVisitStatus.placeholder}
          options={[
            { id: "Pending", value: "Pending" },
            { id: "Completed", value: "Completed" },
          ]}
          onChange={handleInputChange}
          helperText={fieldData?.fieldVisitStatus?.helperText}
          error={Boolean(fieldData?.fieldVisitStatus?.isError)}
          width="432px"
          sx={{
            ...styles.selectStyle,
            width: "432px",
            marginRight: "130px",
          }}
          disabled={isDisabled}
        />
        <Radio
          name={fieldData.letterRequired.name}
          value={fieldData.letterRequired.value}
          label={fieldData.letterRequired.label}
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
          sx={{ width: "432px" }}
          disabled={isDisabled}
          helperText={fieldData?.letterRequired?.helperText}
          error={Boolean(fieldData?.letterRequired?.isError)}
        />
      </Grid>
      <Grid
        container
        sx={{
          display: "flex",
          // alignItems: "center",
          flexWrap: "wrap",
          m: "0px 0px 30px 0px",
          minHeight: "100px",
          height: "auto",
          gap: 4,
        }}
      >
        {/* <Box sx={{ width: "432px", mr: "130px" }}>
          <Typography
            variant="h4"
            color="primary.main"
            sx={{ width: "100%", mb: 3 }}
          >
            Location
          </Typography>
          <LocationPic />
        </Box> */}
        <Box sx={{ width: "432px", mr: "130px" }}>
          <Box
            component="label"
            htmlFor="file-upload"
            sx={{
              width: "432px",
              height: "50px",
              borderColor: isDisabled ? "#E0E0E0" : "#F97D09", // Change color when isDisabled
              borderStyle: "dashed",
              borderWidth: "1px",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
              color: isDisabled ? "#E0E0E0" : "#F97D09", // Change text color when isDisabled
              cursor: isDisabled ? "not-allowed" : "pointer", // Change cursor when isDisabled
              backgroundColor: isDisabled
                ? "#F5F5F5"
                : isDragOver
                ? "rgba(255, 252, 249, 0.8)"
                : "#FFFCF9", // Apply isDisabled style
              transition: "background-color 0.3s ease-in-out",
              pointerEvents: isDisabled ? "none" : "auto", // Prevent interaction when isDisabled
            }}
            onDragOver={!isDisabled ? handleDragOver : undefined}
            onDragLeave={!isDisabled ? handleDragLeave : undefined}
            onDrop={!isDisabled ? handleDrop : undefined}
          >
            <BrowseIcon />
            <Typography variant="h6" color="initial" sx={{ ml: 1, mr: 0.5 }}>
              Drag & drop files or{" "}
            </Typography>
            <Typography
              variant="h6"
              color={isDisabled ? "#E0E0E0" : "#F97D09"} // Change color when isDisabled
              sx={{ textDecoration: "underline" }}
            >
              Browse
            </Typography>
            <input
              id="file-upload"
              multiple
              type="file"
              accept=".jpg, .jpeg, .png, .pdf"
              onChange={!isDisabled ? handleFileChange : undefined}
              name="files"
              style={{ display: "none" }}
              disabled={isDisabled} // Also disable the input
            />
          </Box>
          <Typography fontSize={"10px"} color="#676767">
            Supported formats: JPEG,PNG,PDF
          </Typography>
          <Box
            sx={{ mt: 4, display: "flex", flexWrap: "wrap", width: "600px" }}
          >
            {/* {selectedFiles.length > 0 && ( */}
            <Typography
              variant="h4"
              color="primary.main"
              sx={{ width: "100%", mb: 3 }}
            >
              Uploaded Files
            </Typography>
            {/* )} */}
            <Box
              sx={{
                width: "700px",
                height: "auto",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <>
                {existingFiles?.map((file: any, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      position: "relative",
                      // justifyContent: "center",
                    }}
                  >
                    {file?.fileType === "application/pdf" ? (
                      <Box
                        sx={{
                          width: "135px",
                          height: "135px",
                          marginTop: "10px",
                          marginRight: "25px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #E5E7EB",
                          // backgroundColor: "#f9f9f9",
                        }}
                      >
                        {/* <PdfIcon/> */}
                        <img
                          src={PdfImg}
                          alt=""
                          style={{ width: "150px", height: "150px" }}
                        />
                        {/* <Typography>PDF File</Typography> */}
                      </Box>
                    ) : (
                      <img
                        src={file.path}
                        style={{
                          width: "135px",
                          height: "135px",
                          marginTop: "10px",
                          marginRight: "25px",
                          objectFit: "cover",
                          border: "1px solid #E5E7EB",
                        }}
                        alt={`Preview ${index + 1}`}
                      />
                      // <img
                      //   src="http://localhost:3001/uploads/1718704400036.jpeg"
                      //   alt="Sample Image"
                      // ></img>
                      // <img src={`data:${file.fileType};base64,${file.fileData}`} alt="File" />
                    )}
                    <Box
                      sx={{ width: "155px", minHeight: "30px", height: "auto" }}
                    >
                      <Typography>{file.fileName}</Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: "#8E8E8E",
                        // display: "flex",
                        // alignItems: "center",
                        // width: "130px",
                        // justifyContent:"center"
                      }}
                    >
                      {/* {formatFileSize(file?.size)} */}
                    </Typography>
                    {!isDisabled && (
                      <Box
                        sx={{
                          position: "absolute",
                          cursor: "pointer",
                          right: "30px",
                          top: "65px",
                        }}
                        onClick={() => {
                          setIsConfirmationDialogOpen(true);
                          setIdToBeDeleted(file?.id);
                          // handleDeleteFile(file.id);
                        }}
                      >
                        <PicDeleteIcon />
                      </Box>
                    )}
                  </Box>
                ))}
                {selectedFiles?.map((file: any, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      position: "relative",
                      // justifyContent: "center",
                    }}
                  >
                    {file.type === "application/pdf" ? (
                      <Box
                        sx={{
                          width: "135px",
                          height: "135px",
                          marginTop: "10px",
                          marginRight: "25px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #E5E7EB",
                          // backgroundColor: "#f9f9f9",
                        }}
                      >
                        {/* <PdfIcon/> */}
                        <img
                          src={PdfImg}
                          alt=""
                          style={{ width: "150px", height: "150px" }}
                        />
                      </Box>
                    ) : (
                      <img
                        src={URL.createObjectURL(file)}
                        style={{
                          width: "135px",
                          height: "135px",
                          marginTop: "10px",
                          marginRight: "25px",
                          objectFit: "cover",
                          border: "1px solid #E5E7EB",
                        }}
                        alt={`Preview ${index + 1}`}
                      />
                    )}
                    <Box
                      sx={{ width: "155px", minHeight: "30px", height: "auto" }}
                    >
                      <Typography>{file.name}</Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: "#8E8E8E",
                        // display: "flex",
                        // alignItems: "center",
                        // width: "130px",
                        // justifyContent:"center"
                      }}
                    >
                      {/* {formatFileSize(file.size)} */}
                    </Typography>
                    {!isDisabled && (
                      <Box
                        sx={{
                          position: "absolute",
                          cursor: "pointer",
                          right: "30px",
                          top: "65px",
                        }}
                        onClick={() => handleDelete(index)}
                      >
                        <PicDeleteIcon />
                      </Box>
                    )}
                  </Box>
                ))}
              </>
            </Box>
          </Box>
        </Box>
      </Grid>
      {!isDisabled && (
        <Box
          sx={{ width: "100%", display: "flex", marginRight: "130px", mt: 3 }}
        >
          <Button
            buttonText="Submit"
            loading={isLoading}
            sx={{
              width: "95px",
              height: "40px",
              mt: 3.5,
              mb: 2,
              mr: 3,
              fontSize: "13px",
              color: "white",
            }}
            onClick={editFieldVisit}
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

      <ConfirmationDialog
        open={isConfirmationDialogOpen}
        title="Are you surely want to delete?"
        handleClick={handleConfirmDelete}
        onClose={onConfirmationDialogClose}
        loading={isButtonLoading}
      />
    </>
  );
};

export default FieldVisitAddAndEdit;
