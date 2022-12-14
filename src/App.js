import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Posts } from './features/posts/Posts';
import { selectPostsLoadingStatus, selectPostsCount, getPosts } from './features/posts/postsSlice';
import { selectSubredditsLoadingStatus, selectSelectedSubreddit, setSelected, clearExtraSubreddit, selectExtraSubredditSource } from './features/subreddits/subredditsSlice';
import { clearNotificationMessage, setNotificationFadeOut, selectNotificationMessage, selectNotificationFadeOut } from './features/notification/notificationSlice';
import { selectDisplayMode, switchDisplayMode } from './features/displayMode/displayModeSlice';
import { clearSearchTerm, updateSearchTerm, selectSearchTerm } from './features/searchTerm/searchTermSlice';
import { Search } from './features/searchTerm/Search'
import { Subreddits } from './features/subreddits/Subreddits';
import { Notification } from './features/notification/Notification';
import './App.css';

function App() {
  const [ showSearchNotch, setShowSearchNotch ] = useState(false);
  const [ refreshSubreddits, setRefreshSubreddits ] = useState(false);
  const [ showSubredditsList, setShowSubredditsList ] = useState(false);
  const postsLoading = useSelector(selectPostsLoadingStatus);
  const subredditsLoading = useSelector(selectSubredditsLoadingStatus);
  const notificationMessage = useSelector(selectNotificationMessage);
  const notificationFadeOut = useSelector(selectNotificationFadeOut);
  const darkMode = useSelector(selectDisplayMode);
  const postsCount = useSelector(selectPostsCount);
  const selectedSubreddit = useSelector(selectSelectedSubreddit);
  const extraSubredditSource = useSelector(selectExtraSubredditSource);
  const searchTerm = useSelector(selectSearchTerm);

  const dispatch = useDispatch();

  const searchButtonClick = () => {
    setShowSearchNotch(prevState => !prevState);
  }

  const setSearchTermHandler = (term) => {
    dispatch(updateSearchTerm(term));
  }

  const clearSearchTermHandler = () => {
    dispatch(clearSearchTerm());
  }

  const subredditsButtonClick = () => {
    setShowSubredditsList(prevState => !prevState);
    hideNotch();
  }

  const hideSubredditsList = () => {
    setShowSubredditsList(false);
  }

  const hideNotch = () => {
    setShowSearchNotch(false);
  }

  const refreshButtonClick = () => {
    hideNotch();
    hideSubredditsList();
    document.getElementById("app-top").scrollIntoView({behaviour: "smooth", block: "start"});
    setRefreshSubreddits(prevState => !prevState);
    dispatch(clearSearchTerm());
  }

  const switchDisplayModeClick = () => {
    dispatch(switchDisplayMode());
  }

  const initiateFadeOut = () => {
    dispatch(setNotificationFadeOut());
    setTimeout(() => dispatch(clearNotificationMessage()), 1500);
  }

  function cancelSearchHandler () {
    dispatch(setSelected(1));
    dispatch(clearExtraSubreddit());
    dispatch(clearSearchTerm());
    dispatch(getPosts())
    document.getElementById("app-top").scrollIntoView({behaviour: "smooth", block: "start"});
  }

  return (
    <div className={"App" + (darkMode ? " dark" : "")} >
      <header>
        <div className="header-container">
          <div className="header-content">
            <div id="left-buttons-container">
              <img className="subreddits-button" src="./icons/categories.svg" onClick={subredditsButtonClick} alt="Display subreddits" />
              <img className="search-button" src="./icons/search.svg" onClick={searchButtonClick} alt="Display search box" />
            </div>
            <div id="header-title-container" >
              <span id="header-title-left" onClick={refreshButtonClick}>quick</span><span id="header-title-right" onClick={refreshButtonClick}>R</span>
            </div>
            <div id="search-center">
              <Search hideNotch={hideNotch} searchTerm={searchTerm} updateSearchTerm={setSearchTermHandler} clearSearchTerm={clearSearchTermHandler} />
            </div>
            <div id="mode-switch-container">
              <div id="mode-switch" onClick={switchDisplayModeClick}>
              </div>
            </div>
          </div>
          <div className="header-shadow"></div>
          <div id="search-notch" className={showSearchNotch ? undefined : "hidden"}>
            <Search hideNotch={hideNotch} hideSubreddits={hideSubredditsList} searchTerm={searchTerm} updateSearchTerm={setSearchTermHandler} clearSearchTerm={clearSearchTermHandler} />
          </div>
        </div>
      </header>
      <main className="main-container" id="app-top">
        <Posts display={!showSubredditsList} />
        <Subreddits refresh={refreshSubreddits} display={showSubredditsList} hideSubreddits={hideSubredditsList} />
        <div id="loading-curtain" className={(postsLoading || subredditsLoading) ? "" : "hidden"}>
          <img src="./icons/loading.svg" alt="" />
        </div>
        <div id="refresh-button" className={extraSubredditSource === 'search' ? "hidden":undefined} onClick={refreshButtonClick}>
          <img src="./icons/refresh.svg" alt="Refresh button" />
        </div>
        {notificationMessage && <Notification msg={notificationMessage} setFadeOut={initiateFadeOut} fadeOut={notificationFadeOut} />}
        <div id="cancel-search" className={ (selectedSubreddit === 0 && extraSubredditSource === 'search') ? undefined : "hidden"} >
          <div id="cancel-search-container">
            <div id="cancel-search-button" onClick={cancelSearchHandler}>
              x
            </div>
            <div id="cancel-search-text">
              {postsCount} search results
            </div>
          </div>
          
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
