import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { queryByTestId } from '@testing-library/react';

const localData = require('./posts.json');
const endPointURL = 'https://www.reddit.com';

const initialState = {
  data: [],
  postShowingComments: -1,
  postShowingShareMenu: -1,
  isLoading: false,
  hasError: false
};

export const getPosts = createAsyncThunk(
  'posts/getPosts',
  async (query) => {
    if (query.indexOf('.json') < 0) {
      query += '.json';
    }
    try {
      const response = await fetch(endPointURL + query);
      if (response.ok) {
        const jsonResponse = await response.json();
        jsonResponse.data.children.forEach((post, index) => {
          post.data.post_id = index;
          if (post.data.is_gallery) { post.data.gallery_data.selected = 0; }
        });
        return jsonResponse.data.children;
      } else {
        throw new Error('Request failed!');
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    getOfflinePosts: (state) => {
      state.data = localData.data.children;
      state.isLoading = false;
      state.hasError = false;
      state.postShowingComments = -1;
      state.data.forEach((post, index) => {
        post.data.post_id = index;
        if (post.data.is_gallery) { post.data.gallery_data.selected = 0; }
      });
    },
    setSelectedInGallery: (state, action) => {
      state.data[action.payload.postId].data.gallery_data.selected = action.payload.mediaId;
    },
    setPostShowingComments: (state, action) => {
      state.postShowingComments = action.payload;
    },
    clearPostShowingComments: (state) => {
      state.postShowingComments = -1;
    },
    setPostShowingShareMenu: (state, action) => {
      state.postShowingShareMenu = action.payload;
    },
    clearPostShowingShareMenu: (state) => {
      state.postShowingShareMenu = -1;
    }
  },
  extraReducers: {
    [getPosts.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
      state.postShowingComments = -1;
    },
    [getPosts.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.hasError = false;
      state.postShowingComments = -1;
      state.data = action.payload;
    },
    [getPosts.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
      state.postShowingComments = -1;
    }
  }
});

//Export action reducers
export const {
  getOfflinePosts,
  setSelectedInGallery,
  setPostShowingComments,
  clearPostShowingComments,
  setPostShowingShareMenu,
  clearPostShowingShareMenu
 } = postsSlice.actions;

//Export selectors
export const selectPosts = state => state.posts.data;
export const selectPostsLoadingStatus = state => state.posts.isLoading;
export const selectPostShowingComments = state => state.posts.postShowingComments;
export const selectPostShowingShareMenu = state => state.posts.postShowingShareMenu;

//Export slice reducer
export default postsSlice.reducer;
