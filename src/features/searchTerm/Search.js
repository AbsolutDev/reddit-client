import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSearchTerm, clearSearchTerm, selectSearchTerm } from "./searchTermSlice";
import { setExtraSubreddit, setSelected } from '../subreddits/subredditsSlice';
import { getPosts } from '../posts/postsSlice';

export function Search({ hideNotch, hideSubreddits }) {
  const searchTerm = useSelector(selectSearchTerm);
  const dispatch = useDispatch();

  const onSearchTermChangeHandler = (e) => {
    dispatch(updateSearchTerm(e.target.value));
  }

  const onClearSearchClickHandler = () => {
    dispatch(clearSearchTerm());
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