import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import walletsApi from "../api/wallets";
import { ExportFileResponse, ExportWalletTransactionsThunkPayload } from "../types";

interface FileState {
  data: ExportFileResponse | null;
  error: string | null;
}

const initialState: FileState = {
  data: null,
  error: null,
};

export const exportTransactions = createAsyncThunk<ExportFileResponse, ExportWalletTransactionsThunkPayload>(
  "transactionList/export",
  async ({ walletId, type }, { rejectWithValue }) => {
    try {
      return await walletsApi.exportTransactions(walletId, { type });
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  },
);

export const transactionListExportSlice = createSlice({
  name: "transactionListExport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(exportTransactions.fulfilled, (state, action: PayloadAction<ExportFileResponse>) => {
        state.data = action.payload;
        state.error = null;
      })
      .addCase(exportTransactions.rejected, (state) => {
        state.data = null;
        state.error = "Error downloading file";
      });
  },
});

export default transactionListExportSlice.reducer;
