import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSubreddits, selectSelectedSubreddit, selectExtraSubreddit, getSubreddits, setSelected, clearExtraSubreddit } from './subredditsSlice';
import { getPosts } from '../posts/postsSlice';
import { Subreddit } from '../../components/Subreddit.js';
import { clearSearchTerm } from '../searchTerm/searchTermSlice';

export function Subreddits({ refresh, display, hideSubreddits }) {
  const allSubreddits = useSelector(selectSubreddits);
  const selectedSubreddit = useSelector(selectSelectedSubreddit);
  const extraSubreddit = useSelector(selectExtraSubreddit);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(getSubreddits()) }, [dispatch, refresh]);

  if (allSubreddits.length === 0) {
    return <div> Wait... </div>
  }

  function trimIconURL(url) {
    return url.slice(0,url.indexOf('?'));
  }

  function selectSubreddit(id, query) {
    hideSubreddits();
    dispatch(setSelected(id));
    dispatch(clearExtraSubreddit());
    dispatch(getPosts(query));
    dispatch(clearSearchTerm());
    document.getElementById("app-top").scrollIntoView({behaviour: "smooth", block: "start"});
  }

  function createSubreddit(subR, ix) {
    ix++;
    let iconURL = './icons/subr.svg';
    if (subR.data.icon_img) {
      iconURL = subR.data.icon_img;
    } else {
      if (subR.data.community_icon) {
        iconURL = trimIconURL(subR.data.community_icon);
      }
    }

    return (
      <Subreddit
        subTitle = {subR.data.display_name}
        subURL = {subR.data.url}
        subDescription = {subR.data.description}
        subId = {ix}
        iconURL = {iconURL}
        isSelected = {selectedSubreddit === ix ? 'true' : 'false'}
        key = {ix}
        onClick = {selectSubreddit}
      />
    )
  }

  return (
    <div className={ display ? "main-subreddits show" : "main-subreddits"} >
      {extraSubreddit.title && <Subreddit
        subTitle={allSubreddits[0].display_name}
        iconURL={allSubreddits[0].icon_img}
        isSelected = 'true'
      />}
      <div id="subreddits-title">
        Popular topics
      </div>
      <div id="subreddits-container">
        {allSubreddits.slice(1).map(createSubreddit)}
      </div>
    </div>
  )
}