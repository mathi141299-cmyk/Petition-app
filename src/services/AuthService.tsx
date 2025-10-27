import { jwtDecode } from "jwt-decode";
import { authEndPoints } from "../constants/apiEndPoints";
import ApiUtil from "../utils/ApiUtils";
import { AxiosError } from "axios";
import { getCookie, removeCookie, setCookie } from "../utils/GeneralUtils";
import {
  setIsLoggedIn,
  setAccessToken,
  setRefreshToken,
} from "../redux/slices/auth";
import { useDispatch } from "react-redux";
import store from "../redux/store";

interface Credentials {
  refresh_token: string;
  access_token: string;
}

interface Tokens {
  access_token: string | undefined;
  refresh_token: string | undefined;
}

interface VerifyOtpResponse {
  tokens?: Tokens;
  token?: string;
}

interface PasswordData {
  password: string;
  confirmPassword: string;
}

interface EmailCheckResponse {
  exist?: boolean;
}

const getAccessToken = () => {
  const accessToken = JSON.parse(localStorage.getItem("accessToken") || "null");
  if (accessToken) {
    return accessToken;
  }
  return null;
};

const getRefreshToken = () => {
  const refreshToken = JSON.parse(
    localStorage.getItem("refreshToken") || "null"
  );
  if (refreshToken) {
    return refreshToken;
  }
  return null;
};

const storeAccessToken = (token: any): Promise<boolean | AxiosError> => {
  return new Promise(async (resolve, reject) => {
    try {
      await removeAccessToken();
      const newAccessToken = token?.access_token;
      const newRefreshToken = token?.refresh_token;

      // console.log("mnmnmn token from storeAccessToken", token);

      await setCookie("accessToken", JSON.stringify(newAccessToken));
      await setCookie("refreshToken", JSON.stringify(newRefreshToken));

      setTimeout(() => {
        resolve(true);
      }, 1000);
    } catch (error) {
      reject(error);
    }
  });
};
const refreshTokenUpdate = (body: { refresh_token: string }): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log("mnmnmn body from refreshTokenUpdate", body);
      const response = (await ApiUtil.getWithoutToken(
        authEndPoints.refreshToken,
        body
      )) as any;

      // console.log("mnmnmn response from refreshTokenUpdate", response);

      if (response.refresh_token && response.access_token) {
        store.dispatch(setIsLoggedIn(true));

        // localStorage.removeItem("accessToken");
        localStorage.setItem(
          "accessToken",
          JSON.stringify(response.access_token)
        );

        // localStorage.removeItem("refreshToken");
        localStorage.setItem(
          "refreshToken",
          JSON.stringify(response.refresh_token)
        );

        // store.dispatch(setAccessToken(response.access_token));
        // store.dispatch(setRefreshToken(response.refresh_token));
      }
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
const loginCheck = (): boolean => {
  // const credentials: any = getCookie("accessToken");
  // if (credentials) {
  //   const { exp }: { exp: number } = jwtDecode(JSON.parse(credentials));
  //   if (Date.now() <= exp * 1000) {
  //     return true;
  //   } else {
  //     removeCookie("accessToken");
  //     removeCookie("refreshToken");
  //     return false;
  //   }
  // }
  // return false;

  const accessToken = JSON.parse(localStorage.getItem("accessToken") || "null");

  // console.log("accessToken from loginCheck", accessToken);
  if (accessToken) {
    const { exp }: any = jwtDecode(accessToken);
    if (Date.now() <= exp * 1000) {
      return true;
    }
  }
  return false;
};

const removeAccessToken = async (): Promise<void> => {
  await new Promise((resolve, reject) => {
    try {
      localStorage.clear();
      removeCookie("accessToken");
      removeCookie("refreshToken");
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

async function login(userName: string, password: string): Promise<any> {
  try {
    // const res = (await ApiUtil.postWithoutToken(authEndPoints.login, {
    //   userName: userName,
    //   password,
    // })) as any;
    // if (res.data) {
    //   const { access_token, refresh_token } = res.data;
    // await storeAccessToken({ access_token, refresh_token } as Credentials);
    // }
    await ApiUtil.postWithoutToken(authEndPoints.login, {
      userName: userName,
      password,
    }).then((res) => {
      return res;
    });
  } catch (error) {
    console.log("Error during login:", error);
    throw error;
  }
}

const sendOtp = async (value: string, type: string): Promise<unknown> =>
  await ApiUtil.postWithoutToken("admin/auth/sendOtp", { value, type });

const verifyOtp = async (
  value: string,
  type: string,
  otp: string
): Promise<string | undefined> => {
  const res = (await ApiUtil.postWithoutToken("admin/auth/verifyOtp", {
    value,
    type,
    otp,
  })) as VerifyOtpResponse; // Add a type assertion to cast the response to VerifyOtpResponse

  // access and refresh tokens
  if (res?.tokens) {
    await storeAccessToken(res.tokens as Credentials);
  }
  // email token for otp
  return res?.token;
};

const logout = (): void => {
  removeCookie("refreshToken");
  removeCookie("accessToken");
  localStorage.clear();
  window.location.reload();
};

const logoutTokenError = (): void => {
  void removeAccessToken();
  localStorage.clear();
  window.history.replaceState(null, "", authEndPoints.logout);
  window.location.reload();
};

const emailCheck = async (
  email: string
): Promise<EmailCheckResponse | unknown> => {
  try {
    return await ApiUtil.postWithoutToken("admin/auth/emailAlreadyExists", {
      email,
    });
  } catch (error) {
    throw new Error(`something went to wrong!. ${String(error)}`);
  }
};

const emailDetails = async (email: string): Promise<unknown> => {
  try {
    return await ApiUtil.postWithoutToken("admin/auth/emailDetails", {
      email,
    });
  } catch (error) {
    throw new Error(`something went to wrong!. ${String(error)}`);
  }
};

const forgotPassword = async (email: string): Promise<unknown> => {
  try {
    return await ApiUtil.postWithoutToken("admin/auth/forgotpassword", {
      email,
    });
  } catch (error) {
    throw new Error(`something went to wrong!. ${String(error)}`);
  }
};

const updatePassword = async (
  empId: string,
  token: string,
  data: PasswordData
): Promise<unknown> => {
  try {
    return await ApiUtil.postWithoutToken(
      `admin/auth/updatepassword/${empId}/${token}`,
      {
        password: data?.password,
        confirmPassword: data?.confirmPassword,
      }
    );
  } catch (error) {
    throw new Error(`something went to wrong!. ${String(error)}`);
  }
};
const getAuthUserDetails = () => {
  const user = JSON.parse(localStorage.getItem("userDetails") as string);
  return user ? user : {};
};

const logoutUser = async () => {
  // dispatch(setIsLoggedIn(loginCheck()));
};
export {
  getAccessToken,
  getRefreshToken,
  storeAccessToken,
  removeAccessToken,
  login,
  sendOtp,
  verifyOtp,
  logout,
  emailCheck,
  emailDetails,
  forgotPassword,
  updatePassword,
  logoutTokenError,
  loginCheck,
  refreshTokenUpdate,
  getAuthUserDetails,
  logoutUser,
};
