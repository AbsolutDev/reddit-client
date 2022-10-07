import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { queryByTestId } from '@testing-library/react';

const initialState = {
  data: [],
  displayComments: 20,
  isLoading: false,
  hasError: false
};

export const getComments = createAsyncThunk(
  'comments/getComments',
  async (query) => {
    if (query.indexOf('.json') < 0) {
      query += '.json';
    }
    try {
      const response = await fetch(query);
      if (response.ok) {
        const jsonResponse = await response.json();
        jsonResponse[1].data.children.forEach((comment, index) => {
          comment.data.show_replies = 0;
          comment.data.comment_id = index;
        });
        return jsonResponse[1].data.children;
      } else {
        throw new Error('Request failed!');
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.data = [];
    },
    setDisplayedComments: (state, action) => {
      state.displayComments = action.payload;
    },
    setDisplayedReplies: (state, action) => {
      state.data[action.payload.id].data.show_replies = action.payload.replies;
    }
  },
  extraReducers: {
    [getComments.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [getComments.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.hasError = false;
      state.data = action.payload;
      state.displayComments =  10;
    },
    [getComments.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    }
  }
});

//Export action reducers
export const { clearComments, setDisplayedComments, setDisplayedReplies } = commentsSlice.actions;

//Export selectors
export const selectComments = (state) => state.comments.data;
export const selectCommentsLoadingStatus = (state) => state.comments.isLoading;
export const selectDisplayComments = (state) => state.comments.displayComments;

//Export slice reducer
export default commentsSlice.reducer;