import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { refreshTokenUpdate, logoutUser } from "../services/AuthService";
import { getCookie } from "./GeneralUtils";
import { WindowSharp } from "@mui/icons-material";
import store from "../redux/store";

interface Credentials {
  access_token: string | null;
  token_type: "Bearer";
  refresh_token: string | null;
}
interface FailedQueueItem {
  resolve?: (value?: string | PromiseLike<string> | null) => void;
  reject?: (reason?: any) => void;
}
interface InternalAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  headers?: any;
}

const getToken = () => {
  // const localStorageAccessToken: any = getCookie("accessToken");
  // const localStorageRefreshToken: any = getCookie("refreshToken");
  // const accessToken = localStorageAccessToken ?? null;
  // const refreshToken = localStorageRefreshToken ?? null;

  const accessToken: any = JSON.parse(
    localStorage.getItem("accessToken") || "null"
  );
  const refreshToken: any = JSON.parse(
    localStorage.getItem("refreshToken") || "null"
  );

  if (accessToken != null && refreshToken != null) {
    return {
      access_token: accessToken,
      token_type: "Bearer",
      refresh_token: refreshToken,
    };
  } else {
    return {
      access_token: null,
      token_type: "Bearer",
      refresh_token: null,
    };
  }
};

// Function to refresh the token
const getRefreshToken = async (): Promise<string | null> => {
  try {
    // const storedRefreshToken: any = getCookie("refreshToken");
    // if (!storedRefreshToken) {
    //   return null;
    // }

    const refreshToken: any = JSON.parse(
      localStorage.getItem("refreshToken") || "null"
    );

    if (!refreshToken) {
      return null;
    }
    // console.log("mnmnmn refreshToken from getRefreshToken", refreshToken);
    // const response = await refreshTokenUpdate({
    //   refresh_token: JSON.parse(storedRefreshToken),
    // });

    const response = await refreshTokenUpdate({
      refresh_token: refreshToken,
    });

    // console.log("mnmnmn response from getRefreshToken", response);
    if (!response.access_token) {
      return null;
    }
    return response.access_token;
  } catch (error) {
    return null;
  }
};

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config as InternalAxiosRequestConfig;
    // console.log(
    //   "mnmnmn error, originalRequest?._retry from axios.interceptors",
    //   error,
    //   originalRequest?._retry
    // );
    if (error?.response?.status === 401 && !originalRequest?._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await getRefreshToken();

          // console.log(
          //   "mnmnmn newAccessToken from axios.interceptors",
          //   newAccessToken
          // );
          if (newAccessToken) {
            processQueue(null, newAccessToken);
            return await retryOriginalRequest(originalRequest, newAccessToken);
          }
          return Promise.reject(new Error("Error refreshing token"));
        } catch (refreshError) {
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        return retryFailedRequest(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

const retryOriginalRequest = async (
  requestConfig: InternalAxiosRequestConfig,
  token: string
): Promise<any> => {
  requestConfig.headers.Authorization = `Bearer ${token}`;
  requestConfig._retry = true;
  return axios(requestConfig);
};

const retryFailedRequest = (
  originalRequest: InternalAxiosRequestConfig
): Promise<any> => {
  return new Promise((resolve, reject) => {
    failedQueue.push({
      resolve: (token: string | null | any) => {
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axios(originalRequest));
        } else {
          reject(new Error("Token refresh failed"));
        }
      },
      reject: (error: any) => {
        reject(error);
      },
    });
  });
};

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
): void => {
  failedQueue.forEach((prom: any) => {
    if (error !== null && error !== undefined) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// {
//   headers: {
//     authorization: `Bearer ${credentials.RefreshToken}`,
//     zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//   },
// }

// {
//   headers: {
//     "Content-Type": "application/json",
//     authorization: `Bearer ${credentials.AccessToken}`,
//   },
// }

function sessionTimeout() {
  alert("Session timeout, please login again");
}

const apiUtils = {
  getWithoutToken: async (url: string, body?: any) =>
    await new Promise((resolve, reject) => {
      // console.log("mnmnmn url, body from getWithoutToken", url, body);
      axios
        .get(url, {
          headers: {
            authorization: `Bearer ${body.refresh_token}`,
            zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        })
        .then((response: AxiosResponse) => {
          // console.log("mnmnmn response from getWithoutToken", response);
          resolve(response.data);
        })
        .catch((error: AxiosError) => {
          // console.log("mnmnmn error response from getWithoutToken", error);
          // logoutUser();
          localStorage.clear();
          sessionTimeout();
          window.location.reload();
          reject(error);
        });
    }),
  getWithToken: async (url: string) =>
    await new Promise((resolve, reject) => {
      const credentials = getToken() as any;

      // console.log("mnmnmn credentials from getWithToken", credentials);

      if (
        credentials?.access_token != null &&
        credentials.token_type.length > 0 &&
        credentials.token_type.length > 0
      ) {
        axios
          .get(url, {
            headers: {
              authorization: `Bearer ${credentials.access_token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response: AxiosResponse) => {
            resolve(response.data);
          })
          .catch((error: AxiosError) => {
            reject(error);
          });
      } else {
        reject(new Error("token is not valid"));
      }
    }),

  getExcelFile: async (url: string) =>
    await new Promise((resolve, reject) => {
      const credentials = getToken() as any;
      if (
        credentials?.access_token != null &&
        credentials.token_type.length > 0 &&
        credentials.token_type.length > 0
      )
        axios
          .get(url, {
            headers: {
              authorization: `Bearer ${credentials.access_token}`,
              "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
          })
          .then((response: AxiosResponse) => {
            resolve(response);
          })
          .catch((error: AxiosError) => {
            reject(error);
          });
    }),

  postWithoutToken: async (url: string, body?: unknown) =>
    await new Promise((resolve, reject) => {
      axios
        .post(url, body, {
          headers: {
            zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        })
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch((error: AxiosError) => {
          reject(error);
        });
    }),

  postWithToken: async (url: string, body?: unknown, isMultipart?: boolean) =>
    await new Promise((resolve, reject) => {
      const credentials = getToken() as any;

      if (
        credentials?.access_token != null &&
        credentials.token_type.length > 0 &&
        credentials.token_type.length > 0
      ) {
        axios
          .post(url, body, {
            headers: {
              authorization: `Bearer ${credentials.access_token}`,
              // "Content-Type": "application/json",
              "Content-Type": isMultipart
                ? "multipart/form-data"
                : "application/json",
            },
          })
          .then((response: AxiosResponse) => {
            resolve(response.data);
          })
          .catch((error: AxiosError) => {
            reject(error);
          });
      } else {
        reject(new Error("token is not valid"));
      }
    }),

  putWithToken: async (url: string, body: unknown, isMultipart?: boolean) =>
    await new Promise((resolve, reject) => {
      const credentials = getToken() as any;

      if (
        credentials?.access_token != null &&
        credentials.token_type.length > 0 &&
        credentials.token_type.length > 0
      ) {
        axios
          .put(url, body, {
            headers: {
              authorization: `Bearer ${credentials.access_token}`,
              "Content-Type": isMultipart
                ? "multipart/form-data"
                : "application/json",
            },
          })
          .then((response: AxiosResponse) => {
            resolve(response.data);
          })
          .catch((error: AxiosError) => {
            reject(error);
          });
      } else {
        reject(new Error("token is not valid"));
      }
    }),

  putWithoutToken: async (url: string, body?: unknown) =>
    await new Promise((resolve, reject) => {
      axios
        .put(url, body, {
          headers: {
            zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        })
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch((error: AxiosError) => {
          reject(error);
        });
    }),

  deleteWithToken: async (url: string) =>
    await new Promise((resolve, reject) => {
      const credentials = getToken() as any;

      if (
        credentials?.access_token != null &&
        credentials.token_type.length > 0 &&
        credentials.token_type.length > 0
      ) {
        axios
          .delete(url, {
            headers: {
              authorization: `Bearer ${credentials.access_token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response: AxiosResponse) => {
            resolve(response.data);
          })
          .catch((error: AxiosError) => {
            reject(error);
          });
      } else {
        reject(new Error("token is not valid"));
      }
    }),
};

export default apiUtils;
