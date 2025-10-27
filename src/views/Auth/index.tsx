import { Box, Grid, IconButton, Typography } from "@mui/material";
import {
  HidePasswordIcon,
  LogInIcon,
  LogInLogo,
  LogInLogoTwo,
  LogoIcon,
  NavLogoIcon,
  ShowPasswordIcon,
} from "../../assets/icons";
import { Button, TextField } from "../../components/basic";
import { useEffect, useState } from "react";
// import { login, loginCheck } from "../../services/authService";
import {
  setAuthUser,
  setUserPermission,
  setIsLoggedIn,
  setAccessToken,
  setRefreshToken,
} from "../../redux/slices/auth";
import { getUserDetails } from "../../services/UserService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RouteUrls } from "../../constants/routes";
import { loginPageConst } from "../../constants/displayText";
import {
  requiredValidator,
  updateFormDataWithHelperText,
} from "../../utils/ValidationUtils";
import {
  setSnackBarFailed,
  setSnackBarSuccess,
} from "../../redux/slices/snackbar";
import { authEndPoints } from "../../constants/apiEndPoints";
import ApiUtil from "../../utils/ApiUtils";
import store from "../../redux/store";
import { loginCheck } from "../../services/AuthService";

const SignIn = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialLogInFormError = {
    userName: "",
    password: "",
  };
  const [logInFormError, setLogInFormError] = useState<any>(
    initialLogInFormError
  );

  const initialData = {
    userName: "",
    password: "",
  };

  const [logInFormData, setLogInFormData] = useState<string | Date | any>(
    initialData
  );

  const fieldData: any = {
    userName: {
      label: " Username/Mobile",
      name: "userName",
      value: logInFormData.userName,
      isError: logInFormError.userName === "" ? false : true,
      helperText: logInFormError.userName,
    },
    password: {
      label: "Password",
      name: "password",
      value: logInFormData.password,
      isError: logInFormError.password === "" ? false : true,
      helperText: logInFormError.password,
    },
  };

  const [printNoteFieldData, setPrintNoteFieldData] = useState(fieldData);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setLogInFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
    handleValidation(e);
  };
  const handleValidation = (e: any) => {
    const { name, value, label } = e.target;

    switch (name) {
      case "userName":
      case "password": {
        if (requiredValidator(value, label)) {
          updateFormDataWithHelperText(
            name,
            requiredValidator(value, label),
            setLogInFormError
          );
        } else {
          updateFormDataWithHelperText(name, "", setLogInFormError);
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
  const updateLogInFormData = () => {
    setPrintNoteFieldData((prevFieldData: any) => {
      return Object.keys(prevFieldData).map((field: any) => {
        return {
          ...field,
          value: logInFormData[field.name],
          helperText: logInFormError[field.name],
          isError: logInFormError[field.name] === "" ? false : true,
        };
      });
    });
  };
  useEffect(() => {
    updateLogInFormData();
  }, [logInFormError, logInFormData]);

  const { userName, password } = logInFormData;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (userName === "" || password === "") {
      validateForm();
    } else {
      setLoader(!loader);
      // await login(userName, password)
      await ApiUtil.postWithoutToken(authEndPoints.login, {
        userName: userName,
        password,
      })
        .then(async (res: any) => {
          // console.log("res.data", res.data);
          localStorage.setItem(
            "accessToken",
            JSON.stringify(res.data.access_token)
          );
          localStorage.setItem(
            "refreshToken",
            JSON.stringify(res.data.refresh_token)
          );
          dispatch(setIsLoggedIn(true));
          await getUserDetails().then((res: any) => {
            // console.log("mnmnmn res from getUserDetails", res?.data);

            dispatch(setAuthUser(res?.data));
            localStorage.setItem("userDetails", JSON.stringify(res?.data));
          });
          navigate(`${RouteUrls.petitionListUrl}${RouteUrls.listUrl}`);
          dispatch(
            setSnackBarSuccess({
              snackBarMessage: loginPageConst.SUCCESSFULLY_LOGIN as string,
            })
          );
        })
        .catch((err: any) => {
          setLoader(false);

          dispatch(
            setSnackBarFailed({
              snackBarMessage: loginPageConst.INVALID_USER_PASSWORD,
            })
          );
          console.log(err.response);
        });
    }
  };
  const currentYear = new Date()?.getFullYear();

  return (
    <Grid container sx={{ width: "100%" }}>
      <Grid
        item
        sx={{
          width: {
            xs: "0%",
            lg: "40%",
          },
          height: "100vh",
          display: {
            xs: "none",
            lg: "flex",
          },
        }}
      >
        <Grid
          sx={{
            width: "100%",
            height: "100vh",
            backgroundColor: "",
            position: "relative",
          }}
        >
          <Grid sx={{ position: "absolute", left: 0, bottom: 0 }}>
            <LogInLogo />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        sx={{
          width: { xs: "100%", lg: "57%" },
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: "-50px",
        }}
      >
        <LogInLogoTwo />
        <Typography variant="h2" sx={{ mt: 3, mb: 3 }}>
          Login to your Account!
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <Grid>
              <TextField
                label={
                  <span>
                    Username/Mobile
                    <span style={{ color: "#F43F5E" }}> *</span>
                  </span>
                }
                placeholder="Enter Username/Email address/Mobile"
                height="51px"
                sx={{
                  width: {
                    xl: "431px",
                    xs: "340px",
                  },
                }}
                name={fieldData.userName.name}
                value={fieldData.userName.value}
                error={fieldData.userName.isError}
                helperText={fieldData.userName.helperText}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid>
              <TextField
                label={
                  <span>
                    Password
                    <span style={{ color: "#F43F5E" }}> *</span>
                  </span>
                }
                placeholder="Enter Password"
                type={!isPasswordVisible ? "password" : "text"}
                endPlaceholderIcon={
                  !isPasswordVisible ? (
                    <IconButton
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      <ShowPasswordIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      <HidePasswordIcon />
                    </IconButton>
                  )
                }
                required
                height="51px"
                sx={{
                  width: {
                    xl: "431px",
                    xs: "340px",
                  },
                }}
                name={fieldData.password.name}
                value={fieldData.password.value}
                error={fieldData.password.isError}
                helperText={fieldData.password.helperText}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          <Button
            buttonText="Log In"
            loading={loader}
            sx={{
              width: {
                xl: "431px",
                xs: "340px",
              },
              height: "51px",
              mt: 3.5,
              mb: 2,
              fontSize: "20px",
              color: "white",
            }}
          />
          {/* <Button 
            buttonText="Log In"
            sx={{
              width: {
                xl: "431px",
                // xs: "340px",
              },
              height: "51px",
              mt: 1.5,
            }}
            loading={loader}
          /> */}
        </Box>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          padding: 2,
          // marginTop: "auto",
          position: "absolute",
          bottom: 0,
          // backgroundColor:"red",
          width: "97vW",
        }}
      >
        <Typography variant="h3" color="#8A8A8A" fontWeight={400}>
          {" "}
          &copy; {currentYear}{" "}
          <a
            href="https://www.techbumbles.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#F97D09" }}
          >
            Techbumbles
          </a>
        </Typography>
      </Box>
    </Grid>
  );
};

export default SignIn;
