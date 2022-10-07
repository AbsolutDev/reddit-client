import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  fadeOut: false
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationMessage: (state, action) => {
      state.message = action.payload;
      state.fadeOut = false;
    },
    setNotificationFadeOut: (state) => {
      state.fadeOut = true;
    },
    clearNotificationMessage: (state) => {
      state.message = '';
      state.fadeOut = false;
    }
  }
})

//Export action reducers
export const { setNotificationMessage, clearNotificationMessage, setNotificationFadeOut } = notificationSlice.actions;

//Export selectors
export const selectNotificationMessage = state => state.notification.message;
export const selectNotificationFadeOut = state => state.notification.fadeOut;

//Export slice reducer
export default notificationSlice.reducer;