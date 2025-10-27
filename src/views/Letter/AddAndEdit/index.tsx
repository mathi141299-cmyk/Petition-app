import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  MenuItem,
  debounce,
  List,
  Popper,
  Checkbox,
} from "@mui/material";
import {
  AutoComplete,
  AutocompleteWithTable,
  Button,
  PageLoader,
  Select,
} from "../../../components/basic";
import AutoCompleteWithCheckBoxes from "../../../components/basic/autocompletewithcheckbox";
import {
  BrowseIcon,
  DeleteIcon,
  EditIcon,
  PdfImg,
  PicDeleteIcon,
  PrintIcon,
  SmallDeleteIcon,
} from "../../../assets/icons";
import CancelButton from "../../../components/basic/button/cancelButton";
import { useNavigate, useParams } from "react-router-dom";
import { RouteUrls } from "../../../constants/routes";
import {
  requiredValidator,
  updateFormDataWithHelperText,
} from "../../../utils/ValidationUtils";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import MuiAutocompleteWithTable from "../../../components/basic/autocompleteWithTable";
import {
  getFieldVisitById,
  getPetitionsList,
} from "../../../services/fieldvisitService";
import {
  deleteLetterFormat,
  getAllLetterFormatsByLetterId,
  getLetterById,
  getLetterFormatById,
  updateLetterById,
} from "../../../services/letterService";
import { useDispatch } from "react-redux";
import {
  setSnackBarFailed,
  setSnackBarSuccess,
} from "../../../redux/slices/snackbar";
import {
  deleteConst,
  letterPageConst,
  petitionPageConst,
} from "../../../constants/displayText";
import PrintForm from "../Print";
import { useReactToPrint } from "@kvnyu/react-to-print";
import ConfirmationDialog from "../../../components/shared/confirmationDialog";
import {
  deleteFile,
  getFileUploadDataById,
} from "../../../services/fileUploadService";
import { DataTable } from "../../../components/shared";
import { Link } from "react-router-dom";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const LetterAddAndEdit = () => {
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
    // petitionNo_input: "",
    letterStatus: "",
  };

  const [infoError, setInfoError] = useState<any>(initialInfoError);

  const initialInfoData = {
    petitionNo: [],
    // petitionNo_input: "",
    letterStatus: "",
  };

  const [infoData, setInfoData] = useState<any>(initialInfoData);
  // console.log("infoData", infoData);
  const fieldData = {
    petitionNo: {
      label: "Petition No",
      name: "petitionNo",
      value: infoData.petitionNo,
      petitionNo_input: infoData.petitionNo_input,
      placeholder: "Select Petition No",
      isError: infoError.petitionNo === "" ? false : true,
      helperText: infoError.petitionNo,
      isDisabled: false,
      isRequiredField: true,
    },
    letterStatus: {
      label: "Letter Status",
      name: "letterStatus",
      value: infoData.letterStatus,
      placeholder: "Select Letter Status",
      isError: infoError.letterStatus === "" ? false : true,
      helperText: infoError.letterStatus,
      isDisabled: false,
      isRequiredField: true,
    },
  };
  const [infoFieldData, setInfoFieldData] = useState<any>(fieldData);

  const { letterEditorUrl, letterUrl, listUrl } = RouteUrls;
  const { id, letterFormatId } = useParams();
  // console.log("id, letterFormatId", id, letterFormatId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [existingFiles, setExistingFiles] = useState<any>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [petitionNoList, setPetitionNoList] = useState<any>([]);
  const petitionNoRef: any = useRef();
  const [petitionsList, setPetitionsList] = useState<any>([]);
  const [isPageLoader, setIsPageLoader] = useState(false);
  const [formatsList, setFormatsList] = useState<any>([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [letterFormatInfo, setLetterFormatInfo] = useState<any>([]);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState<any>(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isLetterFormatDelete, setIsLetterFormatDelete] = useState<any>(false);

  const [fieldVisitFiles, setFieldVisitFiles] = useState<any>([]);
  const [fieldVisitId, setFieldVisitId] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [isAutoCompleteLoading, setIsAutoCompleteLoading] = useState(false);

  const TableActions = ({ row }: any) => {
    return (
      <Grid
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          textAlign: "center",
        }}
      >
        <Link
          to={`${letterUrl}${letterEditorUrl}/${id}/${row.id}`}
          style={{
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          <IconButton>
            <EditIcon style={{ height: "15px", width: "15px" }} />
          </IconButton>
        </Link>
        <IconButton
          aria-label="Print"
          disabled={isDisabled}
          onClick={(e) => printLetterFormats(e, row.id)}
          sx={{
            "&:focus": {
              outline: "none",
            },
          }}
        >
          <PrintIcon style={{ height: "15px", width: "15px" }} />
        </IconButton>
        <IconButton
          aria-label="Delete"
          disabled={isDisabled}
          onClick={() => {
            setIsConfirmationDialogOpen(true);
            setIdToBeDeleted(row?.id);
            setIsLetterFormatDelete(true);
          }}
        >
          <DeleteIcon style={{ height: "15px", width: "15px" }} />
        </IconButton>
      </Grid>
    );
  };

  const columns: any[] = [
    {
      field: "sNo",
      // flex: 1,
      renderHeader: () => (
        <Typography variant="h5" fontSize={14}>
          S.No
        </Typography>
      ),
      renderCell: ({ row }: any) => (
        <Typography variant="h5">{row?.sNo}</Typography>
      ),
      minWidth: 70,
      sortable: false,
    },
    {
      field: "letterName",
      flex: 1,
      renderHeader: () => (
        <Typography variant="h5" fontSize={14}>
          Letter Name
        </Typography>
      ),
      renderCell: ({ row }: any) => (
        <Typography variant="h5">{row?.name}</Typography>
      ),
      minWidth: 130,
      sortable: false,
    },
    {
      field: "department",
      flex: 1,
      renderHeader: () => (
        <Typography variant="h5" fontSize={14}>
          Department
        </Typography>
      ),
      renderCell: ({ row }: any) => (
        <Typography variant="h5">{row?.department?.name}</Typography>
      ),
      minWidth: 130,
      sortable: false,
    },
    {
      field: "modeOfDelivery",
      flex: 1,
      renderHeader: () => (
        <Typography variant="h5" fontSize={14}>
          Mode Of Delivery
        </Typography>
      ),
      renderCell: ({ row }: any) => (
        <Typography variant="h5">{row?.modeOfDelivery}</Typography>
      ),
      minWidth: 130,
      sortable: false,
    },
    {
      field: "Person",
      flex: 1,
      renderHeader: () => (
        <Typography variant="h5" fontSize={14}>
          Person
        </Typography>
      ),
      renderCell: ({ row }: any) => (
        <Typography variant="h5">{row?.deliveredBy}</Typography>
      ),
      minWidth: 130,
      sortable: false,
    },
    {
      field: "actions",
      flex: 1,
      renderHeader: () => (
        <Grid
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            height: "51px",
            cursor: "pointer",
          }}
        >
          <Typography variant="h5" fontSize={14}>
            Actions
          </Typography>
        </Grid>
      ),
      renderCell: ({ row }: any) => {
        return <TableActions row={row} />;
      },
      minWidth: 130,
      sortable: false,
    },
  ];

  const handleValidation = (e: any) => {
    const { name, value, label } = e.target;
    switch (name) {
      case "name": {
        if (requiredValidator(value, label)) {
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
      if ((fieldData as any)[fieldName]?.name) {
        handleValidation({ target: (fieldData as any)[fieldName] });
      }
    }
  };

  const updateLogInFormData = () => {
    setInfoFieldData((prevFieldData: any) => {
      return Object?.keys(prevFieldData)?.map((field: any) => {
        return {
          ...field,
          value: infoData[field.name],
          helperText: infoError[field.name],
          isError: infoError[field.name] === "" ? false : true,
        };
      });
    });
  };

  useEffect(() => {
    updateLogInFormData();
  }, [infoError, infoData]);

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

    const files = e?.dataTransfer?.files;
    if (files) {
      setSelectedFiles((prevSelectedFiles: any) => [
        ...prevSelectedFiles,
        ...Array.from(files),
      ]);
    }
    setIsDragOver(false);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    let inputValue = value;
    setInfoData((prev: any) => ({
      ...prev,
      [name]: inputValue,
    }));

    handleValidation(e);
  };

  const handleAutoCompleteInputChange = (
    e: any,
    newInputValue: string,
    name: string
  ) => {
    if (
      name === "petitionNo_input" &&
      newInputValue === "" &&
      infoData.petitionNo !== null &&
      infoData.petitionNo_input !== ""
    ) {
      return false;
    }

    setInfoData((prevBookingData: any) => ({
      ...prevBookingData,
      [name]: newInputValue,
    }));

    if (name === "petitionNo_input") {
      setInfoData((prevBookingData: any) => ({
        ...prevBookingData,
        [name]: newInputValue,
      }));
      handleValidation({
        target: {
          name: "petitionNo",
          value: newInputValue,
        },
      });
    }
  };

  const handleAutoCompleteChange = (e: any, newValue: any, name: any) => {
    // setIsPrintIconDisabled(false);

    if (newValue === null) {
      return false;
    }

    if (name === "petitionNo") {
      setInfoData((prevBookingData: any) => ({
        ...prevBookingData,
        [name]: newValue.id,
        petitionNo_input: newValue.name,
        // mobile_input: Number(newValue.mobileNumber),
      }));
    }
  };

  const handleClick = () => {
    navigate(`${letterUrl}${letterEditorUrl}/${id}`);
  };

  const handleCancel = () => {
    navigate(-1);
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

  const handleDeleteFile = async (id: number) => {
    try {
      setIsButtonLoading(true);

      await deleteFile(id).then((result: any) => {
        dispatch(
          setSnackBarSuccess({
            snackBarMessage: deleteConst.FILE_DELETED as string,
          })
        );
        getFileUploadDataByLetterId();
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

  const getLetterDataById = async () => {
    if (id !== undefined) {
      try {
        setIsPageLoader(true);
        await getLetterById(id).then((result: any) => {
          let data = result?.data;

          setFieldVisitId(data?.field_visit_id);
          // console.log("result?.petitionDepartment", data);
          const petitionLetterDetail = data?.petitionLetter?.map(
            (data: any) => data.petition
          );
          // const petition = petitionFieldVisitDetail?.petition;
          // console.log("petitionLetterDetail", petitionLetterDetail);
          setInfoData(() => ({
            ...infoData,
            petitionNo: petitionLetterDetail,
            letterStatus: data.letterStatus,
            // visitDate: data.visitDate,
            // visitBy: data.visitBy,
            // visitReport: data.visitReport,
            // letterRequired: data.isLetterRequired == 1 ? 1 : 2,
            // fieldVisitStatus: data.fieldVisitStatus,
          }));
          setIsPageLoader(false);
          getFileUploadDataByFieldVisitId(data?.field_visit_id);
        });
      } catch (error) {
        console.error("An error occurred:", error);
        setIsPageLoader(false);
      }
    }
  };

  const editLetter = async () => {
    if (infoData?.petitionNo?.length < 1) {
      validateForm();
    } else {
      setIsLoading(true);
      try {
        const formData: any = new FormData();

        // Append petitionNo items
        // infoData.petitionNo.forEach((petitionNo: any, index: any) => {
        //   formData.append(`petitionNo`, petitionNo.id);
        // });
        formData.append("letterId", id); // Ensure id is a string

        formData.append(
          "petitionNo",
          JSON?.stringify(
            infoData?.petitionNo?.map((petitionNo: any) => petitionNo.id)
          )
        ); //
        // Append letterStatus
        formData.append("letterStatus", infoData.letterStatus);

        // Append each file in selectedFiles
        selectedFiles.forEach((file: any) => {
          formData.append("file", file);
        });

        // let editData: any = {
        //   petitionNo: infoData.petitionNo.map(
        //     (petitionNo: any) => petitionNo.id
        //   ),
        //   letterStatus: infoData.letterStatus,
        //   fileUpload: selectedFiles,
        // };
        // console.log("update data", editData);
        await updateLetterById(id, formData);
        setIsLoading(false);
        navigate(`${letterUrl}${listUrl}`);
        dispatch(
          setSnackBarSuccess({
            snackBarMessage: letterPageConst.LETTER_UPDATED,
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
  };

  const handleConfirmLetterFormatDelete = async () => {
    if (idToBeDeleted === null) {
      return false;
    } else {
      deleteLetterFormats(idToBeDeleted);
    }
  };

  const deleteLetterFormats = async (id: any) => {
    try {
      setIsPageLoader(true);

      await deleteLetterFormat(id).then((result: any) => {
        dispatch(
          setSnackBarSuccess({
            snackBarMessage: letterPageConst.LETTER_FORMAT_DELETED as string,
          })
        );
        getLetterFormatsByLetterId();
        setIsPageLoader(false);
        setIsConfirmationDialogOpen(false);
        setIsButtonLoading(false);
        setIdToBeDeleted(null);
        setIsLetterFormatDelete(false);
      });
    } catch (error: any) {
      console.log("Error occurred:", error);
      setIsPageLoader(false);
      setIsConfirmationDialogOpen(false);
      setIsButtonLoading(false);
      setIdToBeDeleted(null);
      setIsLetterFormatDelete(false);
      dispatch(
        setSnackBarFailed({
          snackBarMessage: error?.response?.data?.message,
        })
      );
    }
  };

  const printLetterFormats = async (e: any, id: any) => {
    e.preventDefault();
    // e.stopPropagation();
    try {
      // setIsDisabled(true);
      setIsPageLoader(true);
      await getLetterFormatById(id).then((result: any) => {
        let data = result?.data;
        // console.log("getLetterFormatById", result?.data?.content);
        const tempElement = document.createElement("div");
        tempElement.innerHTML = result?.data?.content;

        // Find the content within div id="letterContent"
        const letterContentDiv = tempElement.querySelector("#letterContent");

        // If found, get its inner HTML; otherwise, use initialHtml
        const content = letterContentDiv ? letterContentDiv.innerHTML : "";
        // console.log("content", content);
        setLetterFormatInfo(result?.data);
        setIsSubmit(true);

        setIsPageLoader(false);
      });
    } catch (error) {
      console.error("An error occurred:", error);
      setIsPageLoader(false);
    }
  };

  const getLetterFormatsByLetterId = async () => {
    if (id !== undefined) {
      try {
        setIsPageLoader(true);
        await getAllLetterFormatsByLetterId(id).then((result: any) => {
          let data = result?.data;
          const modifiedData = data?.map((row: any, index: number) => {
            return { ...row, sNo: index + 1 };
          });
          setFormatsList(modifiedData);
          setIsPageLoader(false);
        });
      } catch (error) {
        console.error("An error occurred:", error);
        setIsPageLoader(false);
      }
    }
  };

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

  const getFileUploadDataByLetterId = async () => {
    if (id !== undefined) {
      try {
        setIsPageLoader(true);
        await getFileUploadDataById(id, "letterId").then((result: any) => {
          let data = result?.data;
          // console.log("getFileUploadDataById", data);
          // const petitionFieldVisitDetail = data.petitionFieldVisitDetails?.map(
          //   (data: any) => data.petition
          // );
          setExistingFiles(data);

          setIsPageLoader(false);
        });
      } catch (error) {
        console.error("An error occurred:", error);
        setIsPageLoader(false);
      }
    }
  };

  // console.log("fieldVisitId from main", fieldVisitId);

  const getFileUploadDataByFieldVisitId = async (fieldVisitId: any) => {
    if (fieldVisitId) {
      try {
        setIsPageLoader(true);
        await getFileUploadDataById(fieldVisitId, "fieldVisitId").then(
          (result: any) => {
            let data = result?.data;

            setFieldVisitFiles(data);

            setIsPageLoader(false);
          }
        );
      } catch (error) {
        console.error("An error occurred:", error);
        setIsPageLoader(false);
      }
    }
  };

  useEffect(() => {
    getLetterDataById();
    getLetterFormatsByLetterId();
    getFileUploadDataByLetterId();
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      setIsDisabled(false);
    }
  }, []);
  const printRef = useRef(null);

  const handleCancelPrint = async () => {
    navigate(`${RouteUrls.letterUrl}/${id}`);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => handleCancelPrint(),
  });

  const handleSubmit = () => {
    handlePrint();
    setIsSubmit(false);
  };

  useEffect(() => {
    if (isSubmit) {
      handleSubmit();
    }
  }, [isSubmit]);
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
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        m: "0px 0px 30px 0px",
        minHeight: "100px",
        height: "auto",
        // gap: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mb: 3,
        }}
      >
        {id == undefined ? (
          <>
            <Typography variant="h2" color="textPrimary.main">
              Letter
            </Typography>

            <Button
              buttonText="+ New Letter"
              sx={{
                width: "130px",
                height: "40px",
                // mt: 3.5,
                mb: 2,
                fontSize: "13px",
                color: "white",
                mr: 5,
              }}
              onClick={handleClick}
            />
          </>
        ) : (
          <>
            <Typography variant="h2" color="textPrimary.main">
              View Letter
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
                  // mt: 3.5,
                  mr: 4,
                  cursor: "pointer",
                }}
                onClick={handleEdit}
              >
                <EditIcon />
                <Typography variant="h5" color="primary.main">
                  Edit
                </Typography>
              </Box>
            )}{" "}
            {!isDisabled && (
              <Button
                buttonText="+ New Letter"
                sx={{
                  width: "130px",
                  height: "40px",
                  mt: 3.5,
                  mb: 2,
                  fontSize: "13px",
                  color: "white",
                  mr: 5,
                }}
                onClick={handleClick}
              />
            )}
          </>
        )}
      </Box>
      <Grid sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h4"
          color="primary.main"
          sx={{ width: "100%", mb: 3 }}
        >
          Letter Information
        </Typography>

        <Grid sx={{ width: "100%", display: "flex", flexDirection: "row" }}>
          <AutoCompleteWithCheckBoxes
            label={
              <span>
                Petition No
                <span style={{ color: "#F43F5E" }}> *</span>
              </span>
            }
            value={
              Array.isArray(fieldData?.petitionNo?.value)
                ? fieldData.petitionNo.value
                : []
            }
            onChange={(event: any, newValue: any) => {
              handleAutoCompleteWithCheckBoxChange(event, newValue);
            }}
            inputValue={inputValue}
            onInputChange={(e: any, newInputValue: any) => {
              handleAutoCompleteWithCheckBoxInputChange(e, newInputValue);
            }}
            placeholder={fieldData.petitionNo.placeholder}
            options={petitionsList}
            loading={isAutoCompleteLoading}
            defaultValue={
              Array.isArray(fieldData.petitionNo.value)
                ? fieldData.petitionNo.value
                : []
            }
            sx={{
              ...styles.selectStyle,
              width: "432px",
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
            name={fieldData.letterStatus.name}
            value={fieldData.letterStatus.value}
            label={fieldData.letterStatus.label}
            placeholder={fieldData.letterStatus.placeholder}
            options={[
              { id: "Pending", value: "Pending" },
              { id: "Completed", value: "Completed" },
            ]}
            onChange={handleInputChange}
            helperText={fieldData?.letterStatus?.helperText}
            error={Boolean(fieldData?.letterStatus?.isError)}
            width="432px"
            sx={{
              ...styles.selectStyle,
              width: "432px",
              marginRight: "130px",
            }}
            disabled={isDisabled}
          />
        </Grid>
      </Grid>
      {formatsList?.length > 0 && (
        <Grid
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            mb: "50px",
          }}
        >
          <Typography
            variant="h4"
            color="primary.main"
            sx={{ width: "100%", mb: 3, mt: 4 }}
          >
            Letter Formats
          </Typography>

          <DataTable
            columns={columns}
            getRowId={(row: any) => `${String(row.id)}`}
            rows={formatsList}
            // pageCount={list?.count}
            currentPage={"LetterList"}
            tableOnly={true}
            // customization={true}
          />
        </Grid>
      )}
      <Typography
        variant="h2"
        color="textPrimary.main"
        sx={{ width: "100%", mb: "20px" }}
      >
        Upload Information
      </Typography>
      <Box>
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
      </Box>
      <Box
        sx={{
          mt: 4,
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {existingFiles?.length > 0 || selectedFiles?.length > 0 ? (
          <Box
            sx={{
              width: "50%",
              height: "auto",
              display: "flex",
              flexDirection: "column",
              // alignItems: "flex-start",
              // flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h4"
              color="primary.main"
              sx={{ width: "100%", height: "20px", mb: 3 }}
            >
              Uploaded Files
            </Typography>
            <Grid
              sx={{
                width: "100%",
                height: "auto",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {existingFiles?.map((file: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    position: "relative",
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
                      }}
                    >
                      <img
                        src={PdfImg}
                        alt=""
                        style={{ width: "150px", height: "150px" }}
                      />
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
                  )}
                  <Box
                    sx={{ width: "155px", minHeight: "30px", height: "auto" }}
                  >
                    <Typography>{file.fileName}</Typography>
                  </Box>
                  <Typography
                    sx={{
                      color: "#8E8E8E",
                    }}
                  ></Typography>
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
                      }}
                    >
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
                    }}
                  ></Typography>
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
            </Grid>
          </Box>
        ) : (
          ""
        )}
        {fieldVisitFiles?.length > 0 && (
          <Grid
            sx={{
              width: "50%",
              height: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h4"
              color="primary.main"
              sx={{ width: "100%", height: "20px", mb: 3 }}
            >
              Field Visit Uploaded Files
            </Typography>
            <Grid
              sx={{
                width: "100%",
                height: "auto",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {fieldVisitFiles?.map((file: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    position: "relative",
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
                        // alignItems: "center",
                        // justifyContent: "center",
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      <img
                        src={PdfImg}
                        alt=""
                        style={{ width: "150px", height: "150px" }}
                      />
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
                  )}
                  <Box
                    sx={{ width: "155px", minHeight: "30px", height: "auto" }}
                  >
                    <Typography>{file.fileName}</Typography>
                  </Box>
                </Box>
              ))}
            </Grid>
          </Grid>
        )}
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
            onClick={editLetter}
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
        handleClick={
          isLetterFormatDelete
            ? handleConfirmLetterFormatDelete
            : handleConfirmDelete
        }
        onClose={onConfirmationDialogClose}
        loading={isButtonLoading}
      />

      <div style={{ display: "none" }}>
        <PrintForm letterInfo={letterFormatInfo} printRef={printRef} />
      </div>
    </Grid>
  );
};

export default LetterAddAndEdit;
