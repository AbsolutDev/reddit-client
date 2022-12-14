import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

export const searchTermSlice = createSlice ({
  name: 'searchTerm',
  initialState,
  reducers: {
    updateSearchTerm: (state, action) => {
      //alert(action.payload);
      return action.payload;
    },
    clearSearchTerm: () => {
      return '';
    }
  }
});

export const { updateSearchTerm, clearSearchTerm } = searchTermSlice.actions;
export default searchTermSlice.reducer;

export const selectSearchTerm = state => state.searchTerm;