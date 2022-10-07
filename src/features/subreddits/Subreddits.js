import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSubreddits, selectSelectedSubreddit, getSubreddits, getOfflineSubreddits, setSelected } from './subredditsSlice';
import { getPosts } from '../posts/postsSlice';
import { Subreddit } from '../../components/Subreddit.js';

export function Subreddits(props) {
  const allSubreddits = useSelector(selectSubreddits);
  const selectedSubreddit = useSelector(selectSelectedSubreddit);
  const dispatch = useDispatch();
  const { refresh } = props;

  function selectSubreddit(id, query) {
    dispatch(setSelected(id));
    dispatch(getPosts(query))
  }

  const onMount = () => {
    //dispatch(getOfflineSubreddits());
    dispatch(getSubreddits());
  }
  useEffect(onMount, [refresh]);

  if (allSubreddits.length === 0) {
    return <div> Wait... </div>
  }


  function trimIconURL(url) {
    return url.slice(0,url.indexOf('?'));
  }

  function createSubreddit(subR, ix) {
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
    <div className="main-subreddits">
      <div id="subreddits-title">
        Popular topics
      </div>
      <div id="subreddits-container">
        {allSubreddits.map(createSubreddit)}
      </div>
    </div>
  )
}