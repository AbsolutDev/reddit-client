import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Posts } from './features/posts/Posts';
import { selectPostsLoadingStatus, getPosts } from './features/posts/postsSlice';
import { selectSubredditsLoadingStatus } from './features/subreddits/subredditsSlice';
import { clearNotificationMessage, setNotificationFadeOut, selectNotificationMessage, selectNotificationFadeOut } from './features/notification/notificationSlice';
import { Search } from './features/searchTerm/Search'
import { Subreddits } from './features/subreddits/Subreddits';
import { Notification } from './features/notification/Notification';
import './App.css';

function App() {
  const [ showSearchNotch, setShowSearchNotch ] = useState(true);
  const [ refreshPosts, setRefreshPosts ] = useState(false);
  const [ refreshSubreddits, setRefreshSubreddits ] = useState(false);
  const postsLoading = useSelector(selectPostsLoadingStatus);
  const subredditsLoading = useSelector(selectSubredditsLoadingStatus);
  const notificationMessage = useSelector(selectNotificationMessage);
  const notificationFadeOut = useSelector(selectNotificationFadeOut);

  const dispatch = useDispatch();

  const searchButtonClick = () => {
    setShowSearchNotch(prevState => !prevState);
  }

  const refreshButtonClick = () => {
    setRefreshPosts(prevState => !prevState);
    setRefreshSubreddits(prevState => !prevState);
  }

  const initiateFadeOut = () => {
    dispatch(setNotificationFadeOut());
    setTimeout(() => dispatch(clearNotificationMessage()), 1500);
  }

  return (
    <div className="App">
      <header>
        <div className="header-container">
          <div className="header-content">
            <div id="search-left">
              <img className="subreddits-icon" src="./icons/categories.svg" />
              <img className="search-icon" src="./icons/search.svg" onClick={searchButtonClick} />
            </div>
            <div id="header-title-container">
              <span id="header-title-left">quick</span><span id="header-title-right">R</span>
            </div>
            <div id="search-center">
              <Search />
            </div>
            <div id="mode-switch-container">
              <div id="mode-switch">
              </div>
            </div>
          </div>
          <div className="header-shadow"></div>
          <div id="search-notch" className={showSearchNotch ? "hidden" : undefined}>
            <Search />
          </div>
        </div>
      </header>

      <main className="main-container">
        <Posts refresh={refreshPosts} />
        <Subreddits refresh={refreshSubreddits} />
        <div id="loading-curtain" className={(postsLoading || subredditsLoading) ? "" : "hidden"}>
          <img src="./icons/loading.svg" />
        </div>
        <div id="refresh-button" className={(postsLoading || subredditsLoading) ? "hidden" : ""} onClick={refreshButtonClick}>
          <img src="./icons/refresh.svg" />
        </div>
        {notificationMessage && <Notification msg={notificationMessage} setFadeOut={initiateFadeOut} fadeOut={notificationFadeOut} />}
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
