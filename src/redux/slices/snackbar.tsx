import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  ErrorIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from "../../assets/icons";

interface SnackBarState {
  snackBar: {
    snackBarOpen: boolean;
    snackBarMessage: string;
    color: string;
    borderColor: string;
    Icon: any;
  };
}

const initialState: SnackBarState = {
  snackBar: {
    snackBarOpen: false,
    snackBarMessage: "",
    color: "",
    borderColor: "",
    Icon: null,
  },
};
interface SnackBarPayload {
  snackBarMessage: string;
}

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    setSnackBarSuccess: (
      state,
      { payload }: PayloadAction<SnackBarPayload>
    ) => {
      const { snackBarMessage } = payload;

      return {
        ...state,
        snackBar: {
          ...state.snackBar,
          snackBarMessage,
          snackBarOpen: true,
          color: "black",
          borderColor: "#13C163",
          Icon: <SuccessIcon />,
        },
      };
    },
    setSnackBarFailed: (state, { payload }: PayloadAction<SnackBarPayload>) => {
      const { snackBarMessage } = payload;
      return {
        ...state,
        snackBar: {
          ...state.snackBar,
          snackBarMessage,
          snackBarOpen: true,
          color: "#FF1E00",
          borderColor: "#FF1E00",
          Icon: <ErrorIcon />,
        },
      };
    },
    setSnackBarWarning: (
      state,
      { payload }: PayloadAction<SnackBarPayload>
    ) => {
      const { snackBarMessage } = payload;
      return {
        ...state,
        snackBar: {
          ...state.snackBar,
          snackBarMessage,
          snackBarOpen: true,
          color: "#EB8600",
          borderColor: "#EB8600",
          Icon: <WarningIcon />,
        },
      };
    },
    setSnackBarInfo: (state, { payload }: PayloadAction<SnackBarPayload>) => {
      const { snackBarMessage } = payload;
      return {
        ...state,
        snackBar: {
          ...state.snackBar,
          snackBarMessage,
          snackBarOpen: true,
          color: "#207DFF",
          borderColor: "#207DFF",
          Icon: <InfoIcon />,
        },
      };
    },

    setClearSnackBar: (state) => ({
      ...state,
      snackBar: {
        ...state.snackBar,
        snackBarMessage: "",
        snackBarOpen: false,
        severity: "",
        color: "",
        borderColor: "",
        Icon: null,
      },
    }),
  },
});

export const {
  setSnackBarSuccess,
  setClearSnackBar,
  setSnackBarFailed,
  setSnackBarWarning,
  setSnackBarInfo,
} = snackbarSlice.actions;

export default snackbarSlice.reducer;
