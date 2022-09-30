import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import searchTermReducer from '../features/searchTerm/searchTermSlice';
import subredditsReducer from '../features/subreddits/subredditsSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    searchTerm: searchTermReducer,
    subreddits: subredditsReducer
  },
});
