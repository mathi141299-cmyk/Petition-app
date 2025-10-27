import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PaginationValue {
  page: number;
  pageSize: number;
  sortBy?: string | null;
  sortOrder?: string | null;
}

export type PageType =
  | "petitionsList"
  | "FieldVisitList"
  | "LetterList"
  | "FinalResponseList"
  | "petitionReportList";

export type IPagination = Record<PageType, PaginationValue>;

interface PageActionPayloadType {
  key: PageType;
  value: number | string | undefined | null;
}

const initialState: IPagination = {
  petitionsList: { page: 0, pageSize: 10 },
  FieldVisitList: { page: 0, pageSize: 10 },
  LetterList: { page: 0, pageSize: 10 },
  FinalResponseList: { page: 0, pageSize: 10 },
  petitionReportList: { page: 0, pageSize: 10 },
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setCurrentPage: (
      state,
      { payload }: PayloadAction<PageActionPayloadType>
    ) => {
      state[payload.key].page = payload.value as number;
    },
    setRowsPerPage: (
      state,
      { payload }: PayloadAction<PageActionPayloadType>
    ) => {
      state[payload.key].pageSize = payload.value as number;
    },
    setSortBy: (state, { payload }: PayloadAction<PageActionPayloadType>) => {
      state[payload.key].sortBy = payload.value as string;
    },
    setSortOrder: (
      state,
      { payload }: PayloadAction<PageActionPayloadType>
    ) => {
      state[payload.key].sortOrder = payload.value as string;
    },
  },
});

export const { setCurrentPage, setRowsPerPage, setSortBy, setSortOrder } =
  paginationSlice.actions;

export default paginationSlice.reducer;
