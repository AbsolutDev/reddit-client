import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const defaultSubreddit = {
  data: {
    title: "Trending",
    display_name: "Trending",
    description: "Today's trending posts",
    url: "/r/Popular/",
    icon_img : ""
  }
}

const extraSubreddit = {
  title: "",
  display_name: "",
  description: "",
  url: "",
  icon_img: "",
  src: ""
};

const initialState = {
  data: [extraSubreddit, defaultSubreddit],
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
    setSelected: (state, action) => {
      state.selected =  action.payload;
    },
    setExtraSubreddit: (state, action) => {
      state.data[0] = action.payload;
    },
    clearExtraSubreddit: (state) => {
      state.data[0] = extraSubreddit
    }
  },
  extraReducers: {
    [getSubreddits.pending]: (state) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [getSubreddits.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.hasError = false;
      state.data = [extraSubreddit, defaultSubreddit, ...action.payload];
      state.selected = 1;
    },
    [getSubreddits.rejected]: (state) => {
      state.isLoading = false;
      state.hasError = true;
    }
  }
});

//Export action reducers
export const { setSelected, setExtraSubreddit, clearExtraSubreddit } = subredditsSlice.actions;

export const selectSubreddits = state => state.subreddits.data;
export const selectSubredditsLoadingStatus = state => state.subreddits.isLoading;
export const selectSelectedSubreddit = state => state.subreddits.selected;
export const selectExtraSubreddit = state => state.subreddits.data[0];
export const selectSubredditNames = state => {
  const subNames = [];
  state.subreddits.data.slice(2).forEach(sub => {
    subNames.push(sub.data.display_name_prefixed)
  });
  return subNames;
}
export const selectExtraSubredditSource = state => state.subreddits.data[0].src;

export default subredditsSlice.reducer;
