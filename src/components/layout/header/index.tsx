import {
  IconButton,
  Typography,
  Toolbar,
  AppBar,
  Box,
  Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { setMobileOpen } from "../../../redux/slices/layout";
import { RootState, AppDispatch } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { LocationIcon } from "../../../assets/icons";
import { Avatar } from "../../basic";
import { DialogWrapper } from "../../shared";
import { useEffect, useRef, useState } from "react";
import PrintIcon from "@mui/icons-material/Print";
import { useLocation, useParams } from "react-router-dom";
import {
  numberToWords,
  requiredValidator,
  updateFormDataWithHelperText,
} from "../../../utils/ValidationUtils";
import { useSelector } from "react-redux";

const Header = () => {
  const mobileOpen = useSelector((state: RootState) => state.layout.mobileOpen);
  const [isBillingDialogOpen, setIsBillingDialogOpen] =
    useState<boolean>(false);
  const [billdetails, setBillDetails] = useState({});

  const dispatch = useDispatch<AppDispatch>();
  const { authUser } = useSelector((state: RootState) => state.auth) as any;
  const handleDrawerToggle = () => {
    dispatch(setMobileOpen(!mobileOpen));
  };
  const drawerWidth = 266;

  let location: any = useLocation();

  const initialFormError = {
    quantity: "",
    amount: "",
  };
  const [informationFormError, setInformationError] =
    useState<any>(initialFormError);
  const { id } = useParams();
  const initialData = {
    branchId: 1,
    quantity: "",
    price: 20,
    amount: null,
    amountInLetters: "",
    userId: "",
  };

  const [informationFormData, setInformationFormData] = useState<
    string | Date | any
  >(initialData);

  const fieldData: any = {
    quantity: {
      label: "Quantity",
      name: "quantity",
      value: informationFormData.quantity,
      isError: informationFormError.quantity === "" ? false : true,
      helperText: informationFormError.quantity,
    },
    price: {
      name: "price",
      value: informationFormData.price,
      isError: informationFormError.price === "" ? false : true,
      helperText: informationFormError.price,
    },
    amount: {
      name: "amount",
      amountInLetters: informationFormData.amountInLetters,
      value: informationFormData.amount,
      isError: informationFormError.amount === "" ? false : true,
      helperText: informationFormError.amount,
    },
  };
  const [informationFieldData, setInformationFieldData] = useState(fieldData);
  const [isSubmit, setIsSubmit] = useState(false);
  // const initialBillingInformationData = {
  //   branchId: 1,
  //   quantity: null,
  //   price: 20,
  //   amount: null,
  //   amountInLetters: "",
  //   userId: "",
  // };

  // const [billingInformationFormData, setBillingInformationFormData] = useState<
  //   string | Date | any
  // >(initialBillingInformationData);

  const handleValidation = (e: any) => {
    const { name, value, label } = e.target;

    switch (name) {
      case "quantity": {
        if (requiredValidator(value, label)) {
          updateFormDataWithHelperText(
            name,
            requiredValidator(value, label),
            setInformationError
          );
        } else {
          updateFormDataWithHelperText(name, "", setInformationError);
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
    setInformationFieldData((prevFieldData: any) => {
      return Object.keys(prevFieldData).map((field: any) => {
        return {
          ...field,
          value: informationFormData[field.name],
          helperText: informationFormError[field.name],
          isError: informationFormError[field.name] === "" ? false : true,
        };
      });
    });
  };
  useEffect(() => {
    updateLogInFormData();
  }, [informationFormError, informationFormData]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    setInformationFormData((prev: any) => ({
      ...prev,
      quantity: value.replace(/[^\d.]/g, ""),
    }));
    handleValidation(e);
  };

  useEffect(() => {
    const total = informationFormData.quantity * informationFormData.price;

    if (informationFormData.amount !== total) {
      setInformationFormData((prev: any) => ({
        ...prev,
        amount: total,
        amountInLetters: numberToWords(total),
      }));
    }
  }, [informationFormData]);

  const { quantity, amount } = informationFormData;

  const printRef = useRef(null);
  const modelQuantityInput: any = useRef();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: "backgroundPrimary.main",
        color: "textPrimary.main",
        boxShadow: "none",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* {location.pathname === "/restaurant/create" ||
            location.pathname === `/restaurant/${id}` ? (
              <Box>
                <Box
                  sx={{
                    width: "45px",
                    height: "38px",
                    cursor: "pointer",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    backgroundColor: "rgba(199, 221, 199, 0.19)",
                  }}
                  onClick={() => {
                    setIsBillingDialogOpen(true);
                    // modelQuantityInput.current.focus();
                  }}
                >
                  <PrintIcon />
                </Box>
              </Box>
            ) : null} */}
          {/* <Box
            sx={{
              backgroundColor: "greyScale.light",
              borderRadius: "8px",
              width: "146px",
              height: "38px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <LocationIcon />
            <Typography variant="h6" color="#6B7280">
              {authUser?.branch?.name}
            </Typography>
          </Box> */}
          <Box>
            <Avatar />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
