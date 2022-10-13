import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const displayModeSlice = createSlice({
  name: 'displayMode',
  initialState,
  reducers: {
    switchDisplayMode: (state) => {
      return !state;
    }
  }
})

export const { switchDisplayMode } = displayModeSlice.actions;

export const selectDisplayMode = state => state.displayMode;

export default displayModeSlice.reducer;

