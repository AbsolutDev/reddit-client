import React from 'react';
import { useDispatch } from 'react-redux';
import { setExtraSubreddit, setSelected } from '../subreddits/subredditsSlice';
import { getPosts } from '../posts/postsSlice';

export function Search({ hideNotch, hideSubreddits, updateSearchTerm, searchTerm, clearSearchTerm }) {
  const dispatch = useDispatch();

  const onSearchTermChangeHandler = (e) => {
    updateSearchTerm(e.target.value);
  }

  const onClearSearchClickHandler = () => {
    clearSearchTerm();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(searchTerm) {
      dispatch(setExtraSubreddit({
        title: searchTerm,
        display_name: searchTerm,
        description: "",
        url: `https://www.reddit.com/r/popular/search.json?q=${searchTerm}`,
        icon_img: "search",
        src: "search"
      }));
      dispatch(setSelected(0));
      dispatch(getPosts(`/r/popular/search.json?q=${searchTerm}`));
      hideNotch();
      hideSubreddits();
      document.getElementById("app-top").scrollIntoView({behaviour: "smooth", block: "start"});
    }
  }

  return (
      <form className="search-container" onSubmit={handleSubmit}>
        <img className="search-icon" src="./icons/search.svg" alt="" />
        <input
          className="search"
          type="text"
          value={searchTerm}
          onChange={onSearchTermChangeHandler}
        />
        <button
          type="button"
          className={searchTerm.length > 0 ? "search-clear" : "search-clear hidden"}
          onClick={onClearSearchClickHandler}
        >
          <img src="./icons/clear.svg" alt="Clear search" />
        </button>
      </form>
  )
}