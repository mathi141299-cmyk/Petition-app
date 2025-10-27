import { configureStore } from "@reduxjs/toolkit";
import { reducer } from "../slices";

const store = configureStore({
  reducer: reducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
