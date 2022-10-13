import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import searchTermReducer from '../features/searchTerm/searchTermSlice';
import subredditsReducer from '../features/subreddits/subredditsSlice';
import commentsReducer from '../features/comments/commentsSlice';
import notificationReducer from '../features/notification/notificationSlice'
import displayModeReducer from '../features/displayMode/displayModeSlice'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    searchTerm: searchTermReducer,
    subreddits: subredditsReducer,
    comments: commentsReducer,
    notification: notificationReducer,
    displayMode: displayModeReducer
  },
});
