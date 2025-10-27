import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

type LayoutState = {
  mobileOpen: boolean;
};

const initialState: LayoutState = {
  mobileOpen: false,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setMobileOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileOpen = action.payload;
    },
  },
});

export const { setMobileOpen } = layoutSlice.actions;

export default layoutSlice.reducer;
