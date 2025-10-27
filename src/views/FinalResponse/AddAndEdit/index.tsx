import React, { useCallback, useEffect, useState } from "react";
import AutoCompleteWithCheckBoxes from "../../../components/basic/autocompletewithcheckbox";
import { Box, Checkbox, Grid, Typography, debounce } from "@mui/material";
import {
  Button,
  DatePicker,
  PageLoader,
  Select,
  TextField,
} from "../../../components/basic";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  BrowseIcon,
  DeleteIcon,
  EditIcon,
  PdfImg,
  PicDeleteIcon,
} from "../../../assets/icons";
import CancelButton from "../../../components/basic/button/cancelButton";
import {
  requiredValidator,
  updateFormDataWithHelperText,
} from "../../../utils/ValidationUtils";
import { getPetitionsList } from "../../../services/fieldvisitService";
import { RouteUrls } from "../../../constants/routes";
import { useDispatch } from "react-redux";
import {
  setSnackBarFailed,
  setSnackBarSuccess,
} from "../../../redux/slices/snackbar";
import {
  deleteConst,
  finalResponsePageConst,
  petitionPageConst,
} from "../../../constants/displayText";
import {
  createFinalResponseDetails,
  getFinalResponseById,
  updateFinalResponseById,
} from "../../../services/finalResponseService";
import { departmentDetails } from "../../../services/petitionService";
import ConfirmationDialog from "../../../components/shared/confirmationDialog";
import {
  deleteFile,
  getFileUploadDataById,
} from "../../../services/fileUploadService";

const AddAndEditFinalResponse = () => {
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
    status: "",
    department: "",
    date: "",
    replyReceived: "",
    remarks: "",
  };

  const [infoError, setInfoError] = useState<any>(initialInfoError);

  const initialInfoData = {
    petitionNo: [],
    status: "",
    departmentData: [
      {
        id: Date.now(),
        departmentId: null,
        date: null,
        replyReceived: "",
        remarks: "",
      },
      // {
      //   id: Date.now() + 1,
      //   date: dayjs("2022-04-17T15:30"),
      //   replyReceived: "",
      //   remarks: "",
      // },
    ],
  };

  const [infoData, setInfoData] = useState<any>(initialInfoData);
  // console.log("infoData", infoData);
  const fieldData = {
    petitionNo: {
      label: "Petition No",
      name: "petitionNo",
      value: infoData.petitionNo,
      placeholder: "Select Petition No",
      isError: infoError.petitionNo === "" ? false : true,
      helperText: infoError.petitionNo,
      isDisabled: false,
      isRequiredField: true,
    },
    status: {
      label: "Status",
      name: "status",
      value: infoData.status,
      placeholder: "Select Status",
      isError: infoError.status === "" ? false : true,
      helperText: infoError.status,
      isDisabled: false,
      isRequired: true,
    },
    department: {
      label: "Department",
      name: "department",
      value: infoData.department,
      placeholder: "Enter Department",
      isError: infoError.department === "" ? false : true,
      helperText: infoError.department,
      isDisabled: false,
      isRequired: true,
    },
    date: {
      label: "Date",
      name: "date",
      value: infoData.date,
      placeholder: "Select Date",
      isError: infoError.date === "" ? false : true,
      helperText: infoError.date,
      isDisabled: false,
      isRequired: true,
    },

    replyReceived: {
      label: "Reply Received",
      name: "replyReceived",
      value: infoData.replyReceived,
      placeholder: "Enter Reply Received",
      isError: infoError.replyReceived === "" ? false : true,
      helperText: infoError.replyReceived,
      isDisabled: false,
      isRequired: false,
    },
    remarks: {
      label: "Remarks",
      name: "remarks",
      value: infoData.remarks,
      placeholder: "Enter Remarks",
      isError: infoError.replyReceived === "" ? false : true,
      helperText: infoError.replyReceived,
      isDisabled: false,
      isRequired: false,
    },
  };
  const [infoFieldData, setInfoFieldData] = useState<any>(fieldData);
  const { signInUrl, finalResponseUrl, createUrl, editUrl, listUrl } =
    RouteUrls;

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [existingFiles, setExistingFiles] = useState<any>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [petitionsList, setPetitionsList] = useState<any>([]);
  const statusOptions = [
    { id: "Pending", name: "Pending" },
    { id: "Completed", name: "Completed" },
    { id: "Rejected", name: "Rejected" },
  ];
  const [departments, setDepartments] = useState<any>([]);
  const [isPageLoader, setIsPageLoader] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState<any>(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isAutoCompleteLoading, setIsAutoCompleteLoading] = useState(false);

  // console.log("setInputValue", inputValue);
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

  const handleInputChange = (e: any, id: number) => {
    const { name, value } = e.target;
    setInfoData((prev: any) => ({
      ...prev,
      departmentData: prev?.departmentData?.map((item: any) => {
        if (item.id === id) {
          return {
            ...item,
            [name]: value,
          };
        }
        return item;
      }),
    }));
  };
  const handleDateChange = (newValue: any, id: any) => {
    // const { name, value } = e.target;
    const formattedDate = dayjs(newValue).format("MM/DD/YYYY");
    setInfoData((prev: any) => ({
      ...prev,
      departmentData: prev?.departmentData?.map((item: any) => {
        if (item.id === id) {
          return {
            ...item,
            date: formattedDate,
          };
        }
        return item;
      }),
    }));
  };

  const handleSelectChange = (e: any, id: number) => {
    const { name, value } = e.target;

    if (name !== "status") {
      setInfoData((prev: any) => ({
        ...prev,
        departmentData: prev?.departmentData?.map((item: any) => {
          if (item.id === id) {
            // Match the entry by unique id
            return {
              ...item,
              [name]: value, // Update the relevant field (in this case, departmentId)
            };
          }
          return item;
        }),
      }));
    } else {
      setInfoData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddDepartment = async () => {
    setInfoData((prev: any) => ({
      ...prev,
      departmentData: [
        ...prev.departmentData,
        {
          id: Date.now() + prev?.departmentData?.length + 2,
          date: null,
          replyReceived: "",
          remarks: "",
        },
      ],
    }));
  };
  const handleDeleteDepartment = async (id: number) => {
    setInfoData((prev: any) => ({
      ...prev,
      departmentData: prev?.departmentData?.filter(
        (item: any) => item.id !== id
      ),
    }));
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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event?.target?.files;
    if (files) {
      setSelectedFiles((prevSelectedFiles: any) => [
        ...prevSelectedFiles,
        ...Array.from(files),
      ]);
    }
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
  const handleDelete = (index: number) => {
    setSelectedFiles((prevSelectedFiles: any) =>
      prevSelectedFiles.filter((_: any, i: number) => i !== index)
    );
  };
  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files) {
      setSelectedFiles((prevSelectedFiles: any) => [
        ...prevSelectedFiles,
        ...Array.from(files),
      ]);
    }
    setIsDragOver(false);
  };
  const handleClick = () => {};
  const handleSubmit = () => {
    if (infoData.petitionNo == null) {
      validateForm();
    } else {
      navigate(-1);
    }
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
  const handleDeleteFile = async (id: number) => {
    try {
      setIsButtonLoading(true);

      await deleteFile(id).then((result: any) => {
        dispatch(
          setSnackBarSuccess({
            snackBarMessage: deleteConst.FILE_DELETED as string,
          })
        );
        getFileUploadDataByFinalResponseId();
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

  const getFileUploadDataByFinalResponseId = async () => {
    if (id !== undefined) {
      try {
        setIsPageLoader(true);
        await getFileUploadDataById(id, "finalResponseId").then(
          (result: any) => {
            let data = result?.data;
            // console.log("getFileUploadDataById", data);
            // const petitionFieldVisitDetail = data.petitionFieldVisitDetails?.map(
            //   (data: any) => data.petition
            // );
            setExistingFiles(data);

            setIsPageLoader(false);
          }
        );
      } catch (error) {
        console.error("An error occurred:", error);
        setIsPageLoader(false);
      }
    }
  };
  const handleCancel = () => {
    navigate(-1);
  };
  const handleEdit = () => {
    setIsDisabled(!isDisabled);
  };

  useEffect(() => {
    if (id !== undefined) {
      setIsDisabled(true);
    }
  }, []);

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

  const getFinalResponseDataById = async () => {
    if (id !== undefined) {
      try {
        setIsPageLoader(true);
        return await getFinalResponseById(id).then((result: any) => {
          let data = result?.data;
          // console.log(
          //   "result?.petitionDepartment",
          //   data.petitionDepartment.map((item: any) => item.department)
          // );
          const petitionFinalResponseDetail = data.finalResponsePetition?.map(
            (data: any) => data.petition
          );
          const departmentData = data.finalDepartmentResponse.map(
            (response: any) => ({
              id: response.id,
              departmentId: response.departmentId,
              date: response.date,
              replyReceived: response.replyReceived,
              remarks: response.remarks,
            })
          );
          setInfoData(() => ({
            ...infoData,
            petitionNo: petitionFinalResponseDetail,
            status: data.status,
            departmentData:
              departmentData.length <= 0
                ? infoData.departmentData
                : departmentData,
          }));
          setIsPageLoader(false);
        });
      } catch (error) {
        console.error("An error occurred:", error);
        setIsPageLoader(false);
      }
    }
  };
  const createFinalResponse = async () => {
    if (infoData?.petitionNo?.length < 1) {
      validateForm();
    } else {
      try {
        setIsLoading(true);

        // let data: any = {
        //   petitionNo: infoData.petitionNo.map(
        //     (petitionNo: any) => petitionNo.id
        //   ),
        //   status: infoData.status,
        //   departmentData: infoData.departmentData,
        //   file: selectedFiles,
        // };

        // await createFinalResponseDetails(data);

        const formData = new FormData();

        // Append petitionNo as a JSON string
        // formData.append(
        //   "petitionNo",
        //   JSON.stringify(
        //     infoData.petitionNo.map((petitionNo: any) => petitionNo.id)
        //   )
        // );
        // infoData.petitionNo.forEach((petitionNo: any, index: any) => {
        //   formData.append(`petitionNo[${index}]`, petitionNo.id);
        // });
        // formData.append("finalResponseId", id);
        formData.append(
          "petitionNo",
          JSON?.stringify(
            infoData?.petitionNo?.map((petitionNo: any) => petitionNo.id)
          )
        ); //
        // Append status directly
        formData.append("status", infoData?.status);

        // Append departmentData as a JSON string
        formData.append(
          "departmentData",
          JSON.stringify(infoData?.departmentData)
        );

        // Append each selected file
        selectedFiles.forEach((file: any) => {
          formData?.append("file", file);
        });
        // Send the FormData
        await createFinalResponseDetails(formData);

        setIsLoading(false);
        navigate(`${finalResponseUrl}${listUrl}`);
        dispatch(
          setSnackBarSuccess({
            snackBarMessage: finalResponsePageConst?.FINAL_RESPONSE_CREATED,
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
  const editFinalResponse = async () => {
    if (infoData?.petitionNo?.length < 1) {
      validateForm();
    } else {
      setIsLoading(true);
      try {
        // let editData: any = {
        //   petitionNo: infoData.petitionNo.map(
        //     (petitionNo: any) => petitionNo.id
        //   ),
        //   status: infoData.status,
        //   departmentData: infoData.departmentData,
        // };

        const formData: any = new FormData();
        formData?.append("finalResponseId", id);
        formData?.append(
          "petitionNo",
          JSON?.stringify(
            infoData?.petitionNo?.map((petitionNo: any) => petitionNo?.id)
          )
        ); //
        // Append status directly
        formData?.append("status", infoData?.status);

        // Append departmentData as a JSON string
        formData?.append(
          "departmentData",
          JSON?.stringify(infoData?.departmentData)
        );

        // Append each selected file
        selectedFiles?.forEach((file: any) => {
          formData?.append("file", file);
        });
        // console?.log("update data", editData);
        await updateFinalResponseById(id, formData);
        setIsLoading(false);
        navigate(`${finalResponseUrl}${listUrl}`);
        dispatch(
          setSnackBarSuccess({
            snackBarMessage: finalResponsePageConst.FINAL_RESPONSE_UPDATED,
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
  const getAllDepartments = () => {
    try {
      return departmentDetails()?.then((result: any) => {
        let data = result?.data;
        const departmentsList = data?.map((uniqueData: any) => {
          return {
            id: uniqueData?.id,
            name: uniqueData?.name,
          };
        });

        setDepartments(departmentsList);
      });
    } catch (error) {
      console?.error("An error occurred:", error);
    }
  };
  useEffect(() => {
    getAllDepartments();
    getFinalResponseDataById();
    getFileUploadDataByFinalResponseId();
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
            Final Response
          </Typography>
        ) : (
          <>
            <Typography variant="h2" color="textPrimary.main">
              View Final Response
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
          Array?.isArray(fieldData?.petitionNo?.value)
            ? fieldData?.petitionNo?.value
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
        placeholder={fieldData?.petitionNo?.placeholder}
        options={petitionsList}
        // defaultValue={fieldData.petitionNo.value || []}
        defaultValue={
          Array?.isArray(fieldData?.petitionNo?.value)
            ? fieldData?.petitionNo?.value
            : []
        }
        loading={isAutoCompleteLoading}
        sx={{
          ...styles.selectStyle,

          height: "auto",
          minHeight: "48px",
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

      <Select
        name={fieldData?.status?.name}
        value={fieldData?.status?.value}
        label={fieldData?.status?.label}
        placeholder={fieldData?.status?.placeholder}
        options={statusOptions}
        onChange={(e) => handleSelectChange(e, 0)}
        width="431px"
        sx={{
          ...styles.selectStyle,
        }}
        disabled={isDisabled}
        helperText={fieldData?.status?.helperText}
        error={Boolean(fieldData?.status?.isError)}
      />
      <Typography variant="h4" color="primary.main" sx={{ width: "100%" }}>
        Final Petition Response
      </Typography>
      {infoData.departmentData?.map((data: any, index: any) => {
        return (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {index === 0 && (
              <Grid
                key={index}
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "375px",
                    gap: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ width: { xs: "50%", md: "375px", mr: 3 } }}
                    color="#6B7280"
                  >
                    Department
                  </Typography>
                </Grid>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "615px",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      width: { sm: "70px", md: "141px" },
                      textAlign: "left",
                    }}
                    color="#6B7280"
                  >
                    Date
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      width: { sm: "70px", md: "181px" },
                      textAlign: "left",
                    }}
                    color="#6B7280"
                  >
                    Reply Received
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      width: { sm: "70px", md: "221px", mr: 3 },
                      textAlign: "left",
                    }}
                    color="#6B7280"
                  >
                    Remarks
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      width: { sx: "15px" },
                      textAlign: "left",
                    }}
                  ></Typography>
                </Grid>
              </Grid>
            )}
            <Grid
              key={index}
              sx={{
                width: "100%",
                display: "flex",
                height: "auto",
                flexDirection: { xs: "row" },
                alignItems: { xs: "center" },
                justifyContent: "space-between",
              }}
            >
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "350px",
                  // mb: "10px",
                  mr: 3,
                }}
              >
                <Select
                  value={
                    infoData?.departmentData?.find(
                      (d: any) => d?.id === data?.id
                    )?.departmentId || ""
                  }
                  onChange={(e) => handleSelectChange(e, data.id)}
                  name="departmentId"
                  placeholder="Select Department"
                  options={departments}
                  width="350px"
                  sx={{
                    width: {
                      xs: "180px",
                      sm: "250px",
                      md: "350px",
                    },
                  }}
                  disabled={isDisabled}
                />
              </Grid>
              <Grid
                sx={{
                  ...styles.textFieldStyle,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "auto",
                  // mb: "10px",
                  gap: 3,
                }}
              >
                <DatePicker
                  value={data.date ? dayjs(data.date) : null}
                  name="date"
                  onChange={(newValue: any) =>
                    handleDateChange(newValue, data.id)
                  }
                  sx={{
                    width: {
                      sm: "70px",
                      md: "141px",
                    },
                  }}
                  disabled={isDisabled}
                />
                <TextField
                  value={data.replyReceived}
                  name="replyReceived"
                  onChange={(e) => handleInputChange(e, data.id)}
                  placeholder={"Enter Reply Received"}
                  sx={{
                    ...styles.textFieldStyle,
                    marginRight: "0px",
                    width: {
                      sm: "70px",
                      md: "181px",
                    },
                  }}
                  disabled={isDisabled}
                />
                <TextField
                  value={data.remarks}
                  name="remarks"
                  onChange={(e) => handleInputChange(e, data.id)}
                  placeholder={"Enter Remarks"}
                  sx={{
                    ...styles.textFieldStyle,
                    marginRight: "0px",
                    width: {
                      sm: "70px",
                      md: "225px",
                    },
                  }}
                  disabled={isDisabled}
                />
                <Grid
                  sx={{
                    width: {
                      sx: "15px",
                    },
                    p: "5px",
                    display: "flex",
                    border: 1,
                    borderColor: "backgroundPrimary.main",
                    transition: "all 0.2s linear",
                    "&:hover": {
                      borderColor: "primary.main",
                      backgroundColor: "#FFFCF9",
                    },
                    cursor: "pointer",
                    visibility:
                      infoData?.departmentData.length === 1
                        ? "hidden"
                        : "visible",
                  }}
                  onClick={() => handleDeleteDepartment(data.id)}
                >
                  {!isDisabled && <DeleteIcon width="15px" />}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );
      })}
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          borderTop: 0,
          width: "100%",
        }}
      >
        {!isDisabled && (
          <Button
            variant="text"
            buttonText="+ Add"
            onClick={handleAddDepartment}
            sx={{
              borderRadius: "0px",
              width: "auto",
              height: "auto",
              fontWeight: 400,
              fontSize: "13px",
              border: 0,
              color: "primary.main",
              "&:hover": {
                backgroundColor: "initial",
                color: "primary.main",
                borderColor: "initial",
              },
              "&.Mui-focusVisible": {
                border: 1,
                borderColor: "primary.main",
              },
            }}
          />
        )}
      </Grid>
      <Typography variant="h2" color="textPrimary.main" sx={{ width: "100%" }}>
        Upload Information
      </Typography>
      <Box sx={{}}>
        <Box
          component="label"
          htmlFor="file-upload"
          sx={{
            width: "700px",
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
        <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", width: "1000px" }}>
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
            {existingFiles.map((file: any, index: number) => (
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
                <Box sx={{ width: "155px", minHeight: "30px", height: "auto" }}>
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
            {selectedFiles.map((file: any, index: number) => (
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
                {file?.type === "application/pdf" ? (
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
                    src={URL?.createObjectURL(file)}
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
                <Box sx={{ width: "155px", minHeight: "30px", height: "auto" }}>
                  <Typography>{file?.name}</Typography>
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
          </Box>
        </Box>
      </Box>
      {!isDisabled && (
        <Box sx={{ width: "100%", display: "flex", gap: 3 }}>
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
            onClick={id == undefined ? createFinalResponse : editFinalResponse}
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
    </Grid>
  );
};

export default AddAndEditFinalResponse;
