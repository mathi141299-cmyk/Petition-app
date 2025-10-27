import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { Box, Grid, Typography } from "@mui/material";
import {
  Button,
  Select,
  TextAreaEditor,
  TextField,
  AutoComplete,
} from "../../../components/basic";
import {
  requiredValidator,
  updateFormDataWithHelperText,
} from "../../../utils/ValidationUtils";
import {
  GovernmentLetterHeader,
  LetterFooter,
  LetterHeader,
} from "../../../assets/icons";
import CancelButton from "../../../components/basic/button/cancelButton";
import { useNavigate, useParams } from "react-router-dom";
import {
  setSnackBarFailed,
  setSnackBarSuccess,
} from "../../../redux/slices/snackbar";
import { useDispatch } from "react-redux";
import {
  letterFormatPageConst,
  petitionPageConst,
} from "../../../constants/displayText";
import {
  createLetterFormatDetail,
  getAllLetterFormatsMasterData,
  getLetterFormatById,
  updateLetterFormatById,
} from "../../../services/letterService";
import { departmentDetails } from "../../../services/petitionService";

const LetterEditor = () => {
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

  const initialContentPartyLetter = `
  <div style="padding:2%">
 
  <div style="display: flex; justify-content: space-between; align-items: center;">

      <img src="${LetterHeader}" alt="Party Logo" style="height: 100%; width:100%">
   
  </div>
  <div style="padding:2%;" >
  <div style="min-height:500px" >

  <p>To:</p>
  <p>
    முதன்மைச் செயலாளர் அவர்களுக்கு,<br>
    பள்ளிக்கல்வித்துறை,<br>
    தலைமைச் செயலகம்,<br>
    சென்னை - 09.
  </p>
  <p><strong>Subject:</strong></p>
  <p>
    Modakurichi Boys Higher Secondary School requires an upgrade to its educational infrastructure to provide quality education to its students. The introduction of smart class education, equipped with modern teaching aids and resources, will enhance the learning experience for all students. It will enable teachers to deliver lessons more effectively, engage students in interactive learning activities, and facilitate better comprehension and retention of subject matter.
  </p>
  <p>
    We believe that the introduction of smart class education will greatly benefit the students of Modakurichi Boys Higher Secondary School, helping them acquire the necessary skills and knowledge to excel in their academic pursuits and future endeavors.
  </p>
  </div>
  <div style="text-align: right; margin-top: 40px;">
    <p>Dr. C. Saraswathi, M.B.B.S, D.C.H.</p>

  </div>


  <div style="margin-top: 40px;">
  <img src="${LetterFooter}" alt="Party Logo" style="height: 100%; width:100%">
   
  </div>
  
  </div>
  </div>
  `;
  const initialContentGovernmentLetter = useMemo(
    () =>
      `
    <div style="padding:2%">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <img src="${GovernmentLetterHeader}" alt="Party Logo" style="height: 100px;">
      </div>
      <div style="padding:2%;">
        <div style="min-height:500px">
          <p>To:</p>
          <p>
            முதன்மைச் செயலாளர் அவர்களுக்கு,<br>
            பள்ளிக்கல்வித்துறை,<br>
            தலைமைச் செயலகம்,<br>
            சென்னை - 09.
          </p>
          <p><strong>Subject:</strong></p>
          <p>
            Modakurichi Boys Higher Secondary School requires an upgrade to its educational infrastructure to provide quality education to its students. The introduction of smart class education, equipped with modern teaching aids and resources, will enhance the learning experience for all students. It will enable teachers to deliver lessons more effectively, engage students in interactive learning activities, and facilitate better comprehension and retention of subject matter.
          </p>
          <p>
            We believe that the introduction of smart class education will greatly benefit the students of Modakurichi Boys Higher Secondary School, helping them acquire the necessary skills and knowledge to excel in their academic pursuits and future endeavors.
          </p>
        </div>
        <div style="text-align: right; margin-top: 40px;">
          <p>Dr. C. Saraswathi, M.B.B.S, D.C.H.</p>
        </div>
      </div>
    </div>
    `,
    [GovernmentLetterHeader]
  ); // Include all depen

  const modeOfDeliveryOptions = [
    { id: 1, name: "Post" },
    { id: 2, name: "Person" },
  ];

  const initialInfoError = {
    letterName: "",
    letterType: "",
    department: "",
    modeOfDelivery: "",
    deliveredBy: "",
  };

  const [infoError, setInfoError] = useState<any>(initialInfoError);

  const initialInfoData = {
    letterName: "",
    letterType: null,
    department: null,
    departmentInput: "",
    modeOfDelivery: null,
    deliveredBy: "",
  };

  const [letterFormData, setLetterFormData] = useState<any>(initialInfoData);

  const fieldData = {
    letterName: {
      label: "Letter Name",
      name: "letterName",
      value: letterFormData.letterName,
      placeholder: "Enter Letter Name",
      isError: infoError.letterName === "" ? false : true,
      helperText: infoError.letterName,
      isDisabled: false,
      isRequiredField: true,
    },
    letterType: {
      label: "Letter Type",
      name: "letterType",
      value: letterFormData.letterType,
      placeholder: "Select Letter Type",
      isError: infoError.letterType === "" ? false : true,
      helperText: infoError.letterType,
      isDisabled: false,
      isRequired: true,
    },
    department: {
      label: "Department",
      name: "department",
      value: letterFormData.department,
      inputValue: letterFormData.departmentInput,
      placeholder: "Select Department",
      isError: infoError.department === "" ? false : true,
      helperText: infoError.department,
      isDisabled: false,
      isRequired: true,
    },
    modeOfDelivery: {
      label: "Mode Of Delivery",
      name: "modeOfDelivery",
      value: letterFormData.modeOfDelivery,
      placeholder: "Select",
      isError: infoError.modeOfDelivery === "" ? false : true,
      helperText: infoError.modeOfDelivery,
      isDisabled: false,
      isRequired: true,
    },
    deliveredBy: {
      label: "Delivered By",
      name: "deliveredBy",
      value: letterFormData.deliveredBy,
      placeholder: "Enter Person Name",
      isError: infoError.deliveredBy === "" ? false : true,
      helperText: infoError.deliveredBy,
      isDisabled: false,
      isRequired: true,
    },
  };

  const [letterFormFieldData, setLetterFormFieldData] =
    useState<any>(fieldData);
  const navigate = useNavigate();
  const { id, letterFormatId } = useParams();

  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [letterType, setLetterType] = useState([]);

  const [initialHtml, setInitialHtml] = useState<any>("");
  const [partyLetterInitialHtml, setPartyLetterInitialHtml] = useState<
    string | number | any
  >("");
  const [governmentLetterInitialHtml, setGovernmentLetterInitialHtml] =
    useState<string | number | any>("");

  const [isPageLoader, setIsPageLoader] = useState(false);

  const [departments, setDepartments] = useState<any>([]);

  const handleValidation = (e: any) => {
    const { name, value, label } = e.target;

    switch (name) {
      case "letterName":
      case "letterType":
      case "department":
      case "modeOfDelivery": {
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
    setLetterFormFieldData((prev: any) => {
      return Object?.keys(prev)?.map((field: any) => {
        return {
          ...field,
          value: letterFormData[field.name],
          isError: infoError[field.name] == "" ? false : true,
          helperText: infoError[field.name],
        };
      });
    });
  };

  useEffect(() => {
    updateInfoFieldData();
  }, [infoError, letterFormData]);

  const handleInputChange = useCallback(
    (e: any) => {
      const { name, value } = e.target;
      setLetterFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));

      if (value == "Post") {
        setLetterFormData((prev: any) => ({
          ...prev,
          deliveredBy: "",
        }));
      }

      if (value == "Government Letter") {
        setInitialHtml(governmentLetterInitialHtml);
      }

      if (value == "Party Letter") {
        setInitialHtml(partyLetterInitialHtml);
      }
      handleValidation(e);
    },
    [handleValidation]
  );

  const handleAutoCompleteChange = (e: any, newValue: any, name: any) => {
    setLetterFormData((prev: any) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleAutoCompleteInputChange = (
    e: any,
    newInputValue: string,
    name: string
  ) => {
    if (name === "departmentInput" && newInputValue === "" && id) {
      return false;
    }

    if (name === "departmentInput") {
      setLetterFormData((prev: any) => ({
        ...prev,
        [name]: newInputValue,
      }));
      handleValidation({
        target: {
          name: "department",
          value: newInputValue,
        },
      });
    }
  };

  const handleTextAreaChange = useCallback((value: any) => {
    setInitialHtml(value);
  }, []);

  const handleCancel = () => {
    navigate(-1);
  };

  const createLetterFormat = async () => {
    if (
      letterFormData.letterName == "" ||
      letterFormData.letterType == null ||
      letterFormData.department == null ||
      letterFormData.modeOfDelivery === null
    ) {
      validateForm();
    } else {
      try {
        setIsLoading(true);
        const tempElement = document.createElement("div");
        tempElement.innerHTML = initialHtml;

        let data: any = {
          name: letterFormData?.letterName,
          type: letterFormData?.letterType,
          departmentId: letterFormData?.department.id,
          modeOfDelivery: letterFormData?.modeOfDelivery,
          deliveredBy: letterFormData?.deliveredBy
            ? letterFormData?.deliveredBy
            : null,
          content: editor?.current?.value,
          letterId: id,
        };
        await createLetterFormatDetail(data);
        setIsLoading(false);
        navigate(-1);
        dispatch(
          setSnackBarSuccess({
            snackBarMessage: letterFormatPageConst.LETTER_FORMAT_CREATED,
          })
        );
      } catch (error: any) {
        console.log("Error occurred:", error);
        setIsLoading(false);
        dispatch(
          setSnackBarFailed({
            snackBarMessage: error.response.data.message,
          })
        );
      }
    }
  };

  const editLetterFormat = async () => {
    if (
      letterFormData.letterName == "" ||
      letterFormData.letterType == null ||
      letterFormData.department == null ||
      letterFormData.modeOfDelivery === null
    ) {
      validateForm();
    } else {
      try {
        setIsLoading(true);

        let updateData: any = {
          name: letterFormData.letterName,
          typeId: letterFormData.letterType,
          departmentId: letterFormData.department.id,
          modeOfDelivery: letterFormData?.modeOfDelivery,
          deliveredBy: letterFormData?.deliveredBy
          ? letterFormData?.deliveredBy
          : null,
          content: editor?.current?.value,
        };
        await updateLetterFormatById(letterFormatId, updateData);
        setIsLoading(false);
        navigate(-1);
        dispatch(
          setSnackBarSuccess({
            snackBarMessage: letterFormatPageConst.LETTER_FORMAT_UPDATED,
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

  const getLetterFormatDataById = useCallback(async () => {
    if (letterFormatId !== undefined) {
      try {
        setIsDisabled(true);
        setIsPageLoader(true);
        await getLetterFormatById(letterFormatId).then((result: any) => {
          let data = result?.data;
          setInitialHtml(data.content);

          if (editor?.current) {
            editor.current.value = data?.content;
          }

          setLetterFormData(() => ({
            ...letterFormData,
            letterName: data.name,
            letterType: data.type,
            department: data.department,
            departmentInput: data.department.name,
            modeOfDelivery: data.modeOfDelivery,
            deliveredBy: data.deliveredBy,
          }));

          setIsPageLoader(false);
        });
      } catch (error) {
        console.error("An error occurred:", error);
        setIsPageLoader(false);
      }
    }
  }, []); //initialHtml

  const getLetterFormatMasterData = async () => {
    if (id !== undefined) {
      try {
        setIsPageLoader(true);
        await getAllLetterFormatsMasterData().then((result: any) => {
          let data = result?.data;
          const letterTypes = data?.map((uniqueData: any) => {
            return {
              id: uniqueData.type,
              name: uniqueData.type,
            };
          });
          setGovernmentLetterInitialHtml(data[0].content);
          setPartyLetterInitialHtml(data[1].content);
          setLetterType(letterTypes);
          setIsPageLoader(false);
        });
      } catch (error) {
        console.error("An error occurred:", error);
        setIsPageLoader(false);
      }
    }
  };

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

  useEffect(() => {
    getLetterFormatDataById();
    getLetterFormatMasterData();
    getAllDepartments();
  }, []);

  const editor: any = useRef(null);

  return (
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
      <Typography variant="h2" color="textPrimary.main" sx={{ width: "100%" }}>
        New Letter
      </Typography>
      <TextField
        label={
          <span>
            {fieldData?.letterName?.label}
            <span style={{ color: "#F43F5E" }}> *</span>
          </span>
        }
        name={fieldData.letterName.name}
        value={fieldData.letterName.value}
        placeholder={fieldData.letterName.placeholder}
        onChange={handleInputChange}
        helperText={fieldData?.letterName?.helperText}
        error={Boolean(fieldData?.letterName?.isError)}
        sx={{ ...styles.textFieldStyle }}
      />
      <Select
        label={
          <span>
            {fieldData?.letterType?.label}
            <span style={{ color: "#F43F5E" }}> *</span>
          </span>
        }
        name={fieldData.letterType.name}
        value={fieldData.letterType.value}
        placeholder={fieldData.letterType.placeholder}
        options={letterType}
        onChange={handleInputChange}
        width="431px"
        helperText={fieldData?.letterType?.helperText}
        error={Boolean(fieldData?.letterType?.isError)}
        sx={{
          ...styles.selectStyle,
        }}
        disabled={isDisabled}
      />
      <AutoComplete
        label={
          <span>
            {fieldData?.department?.label}
            <span style={{ color: "#F43F5E" }}> *</span>
          </span>
        }
        placeholder={fieldData?.department?.placeholder}
        name={fieldData?.department?.name}
        value={fieldData?.department?.value}
        inputValue={fieldData?.department?.inputValue}
        // disabled={isDisabled}
        disableClearable={true}
        freeSolo={false}
        helperText={fieldData?.department?.helperText}
        options={departments}
        error={Boolean(fieldData?.department?.isError)}
        onChange={(e: any, newValue: any) => {
          handleAutoCompleteChange(e, newValue, "department");
        }}
        onInputChange={(e: any, newInputValue: any) => {
          handleAutoCompleteInputChange(e, newInputValue, "departmentInput");
        }}
        getOptionLabel={(option: any) => option?.name}
        optionName="name"
        sx={{
          width: "431px",
          height: "48px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "5px",
            padding: "6.5px 3px",
            boxShadow: "none",
          },
          marginRight: "130px",
        }}
      />
      <Select
        label={
          <span>
            {fieldData?.modeOfDelivery?.label}
            <span style={{ color: "#F43F5E" }}> *</span>
          </span>
        }
        name={fieldData.modeOfDelivery.name}
        value={fieldData.modeOfDelivery.value}
        placeholder={fieldData.modeOfDelivery.placeholder}
        options={modeOfDeliveryOptions}
        onChange={handleInputChange}
        selectedType="string"
        width="431px"
        helperText={fieldData?.modeOfDelivery?.helperText}
        error={Boolean(fieldData?.modeOfDelivery?.isError)}
        sx={{
          ...styles.selectStyle,
        }}
      />
      <TextField
        label={
          <span>
            {fieldData?.deliveredBy?.label}
            <span style={{ color: "#F43F5E" }}> *</span>
          </span>
        }
        name={fieldData.deliveredBy.name}
        value={fieldData.deliveredBy.value}
        placeholder={fieldData.deliveredBy.placeholder}
        onChange={handleInputChange}
        disabled={letterFormData?.modeOfDelivery === "Person" ? false : true}
        helperText={fieldData?.deliveredBy?.helperText}
        error={Boolean(fieldData?.deliveredBy?.isError)}
        sx={{ ...styles.textFieldStyle }}
      />
      {letterFormData.letterType !== null && editor && (
        <Box sx={{ width: "1300px" }}>
          <TextAreaEditor
            value={initialHtml}
            setValue={setInitialHtml}
            inputRef={editor}
          />
        </Box>
      )}
      {letterFormData.letterType !== null ? (
        <Box
          sx={{ width: "100%", display: "flex", marginRight: "130px", gap: 3 }}
        >
          <Button
            buttonText="Save"
            loading={isLoading}
            sx={{
              width: "95px",
              height: "40px",
              mt: 3.5,
              mb: 2,
              fontSize: "13px",
              color: "white",
            }}
            onClick={
              letterFormatId == undefined
                ? createLetterFormat
                : editLetterFormat
            }
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
      ) : (
        ""
      )}
    </Grid>
  );
};

export default LetterEditor;
