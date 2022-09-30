import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const localData = require('./subredds.json');

const defaultSubreddit = {
  data: {
    title: "Trending",
    display_name: "TrendingWithAVeryLongTitleToCheck",
    description: "Today's trending posts",
    url: "/r/Popular/",
    icon_img : ""
  }
}


const initialState = {
  data: [defaultSubreddit],
  selected: null,
  isLoading: false,
  hasError: false
};

const endPointURL = 'https://www.reddit.com/subreddits/popular.json';

export const getSubreddits = createAsyncThunk(
  'subreddits/getSubreddits',
  async () => {
    try {
      const response = await fetch(endPointURL);
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse.data.children;
      } else {
        throw new Error('Request failed!');
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const subredditsSlice = createSlice({
  name: 'subreddits',
  initialState,
  reducers: {
    getOfflineSubreddits: (state) => {
      state.data = [defaultSubreddit, ...localData.data.children];
    },
    setSelected: (state, action) => {
      state.selected =  action.payload;
    }
  },
  extraReducers: {
    [getSubreddits.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [getSubreddits.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.hasError = false;
      state.data = [defaultSubreddit, ...action.payload];
      state.selected = 0;
    },
    [getSubreddits.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    }
  }
});

//Export action reducers
export const { getOfflineSubreddits, setSelected } = subredditsSlice.actions;

export const selectSubreddits = state => state.subreddits.data;
export const selectSubredditsLoadingStatus = state => state.subreddits.isLoading;
export const selectSelectedSubreddit = state => state.subreddits.selected;
export const selectDefaultSubredditURL = state => state.subreddits.data[0].data.url;

export default subredditsSlice.reducer;
