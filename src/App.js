import React, { useState } from 'react';
import { Posts } from './features/posts/Posts';
import { Search } from './features/searchTerm/Search'
import { Subreddits } from './features/subreddits/Subreddits';
import './App.css';

function App() {
  const [ showSearchNotch, setShowSearchNotch ] = useState(true);

  const searchButtonClick = () => {
    setShowSearchNotch(prevState => !prevState);
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
        <Posts />
        <div id="loading-curtain">
          <img src="./icons/loading.svg" />
        </div>
        <Subreddits />
        <div id="refresh-button">
          <img src="./icons/refresh.svg" />
        </div>
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
