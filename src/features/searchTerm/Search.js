import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSearchTerm, clearSearchTerm, selectSearchTerm } from "./searchTermSlice";

export function Search() {
  const searchTerm = useSelector(selectSearchTerm);
  const dispatch = useDispatch();

  const onSearchTermChangeHandler = (e) => {
    dispatch(updateSearchTerm(e.target.value));
  }

  const onClearSearchClickHandler = () => {
    dispatch(clearSearchTerm());
  }

  return (
    <div className="search-container">
      <div className="search-clear hidden"></div>
      <input
        className="search"
        type="text"
        value={searchTerm}
        onChange={onSearchTermChangeHandler}
      />
      <button
        type="button"
        className="search-button"
      >
        <img className="search-icon" src="./icons/search.svg" alt="Search in selected subreddit" />
      </button>
      <button
        type="button"
        className={searchTerm.length > 0 ? "search-clear" : "search-clear hidden"}
        onClick={onClearSearchClickHandler}
      >
        <img src="./icons/clear.svg" />
      </button>
    </div>
  )
}