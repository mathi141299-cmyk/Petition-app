import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

import // getAuthUserDetails,
// loginCheck,
// getAccessToken,
// getRefreshToken,
"../../services/AuthService";

interface AuthState {
  isLoggedIn: any;
  authUser: unknown;
}

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

  if (accessToken) {
    const { exp }: any = jwtDecode(accessToken);
    if (Date.now() <= exp * 1000) {
      return true;
    }
  }
  return false;
};

const getAuthUserDetails = () => {
  const user = JSON.parse(localStorage.getItem("userDetails") as any);
  return user ? user : {};
};

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

const initialState: any = {
  isLoggedIn: Boolean(loginCheck()),
  // isLoggedIn: false,
  authUser: Object(getAuthUserDetails()),
  userPermission: [],
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, { payload }: PayloadAction<string | null | any>) => ({
      ...state,
      authUser: payload,
    }),
    setUserPermission: (state, { payload }: PayloadAction<string | null>) => ({
      ...state,
      userPermission: payload,
    }),
    setIsLoggedIn: (state, { payload }: PayloadAction<boolean>) => ({
      ...state,
      isLoggedIn: payload,
    }),
    setAccessToken: (state, { payload }) => {
      state.accessToken = payload;
    },
    setRefreshToken: (state, { payload }) => {
      state.refreshToken = payload;
    },
  },
});

export const {
  setAuthUser,
  setUserPermission,
  setIsLoggedIn,
  setAccessToken,
  setRefreshToken,
} = authSlice.actions;

export default authSlice.reducer;
