import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPosts, selectPostsErrorStatus, selectPostsLoadingStatus, getPosts, setSelectedInGallery, selectPostShowingComments, setPostShowingComments, clearPostShowingComments, selectPostShowingShareMenu, clearPostShowingShareMenu, setPostShowingShareMenu } from './postsSlice';
import { clearComments } from '../comments/commentsSlice';
import { selectDefaultSubredditURL } from '../subreddits/subredditsSlice';
import { Post } from '../../components/Post.js';
import getAge from '../../utils/getAge';
import shortenNum from '../../utils/shortenNum';

export function Posts({ refresh, display }) {
  const dispatch = useDispatch();
  const allPosts = useSelector(selectPosts);
  const defaultSubredditURL = useSelector(selectDefaultSubredditURL);
  const postShowingComments = useSelector(selectPostShowingComments);
  const postShowingShareMenu = useSelector(selectPostShowingShareMenu);
  const hasError = useSelector(selectPostsErrorStatus);
  const isLoading = useSelector(selectPostsLoadingStatus);

  useEffect (() => { dispatch(getPosts(defaultSubredditURL)) }, [refresh]);

  if (allPosts.length === 0) {
    if (isLoading) {
      return (
        <div className="main-feed">
        <div id="no-content">
          Please wait...
        </div>
      </div>
      )
    }
    return (
      <div className="main-feed">
        <div id="no-content">
          No results...
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="main-feed">
        <div id="no-content">
          Oops, something went wrong :( <br/>
          Try again? Or... something else?
        </div>
      </div>
    )
  }

  const showComments = (postId) => {
    if (postShowingComments === postId) {
      dispatch(clearComments());
      dispatch(clearPostShowingComments(postId));
    } else {
      dispatch(clearComments());
      dispatch(setPostShowingComments(postId));
      
    } 
  }

  const showShareMenu = (postId) => {
    if (postShowingShareMenu === postId) {
      dispatch(clearPostShowingShareMenu(postId));
    } else {
      dispatch(setPostShowingShareMenu(postId));
    }
  }
  
  return (
    <div className={display ? "main-feed" : "main-feed no-scroll"} >
      {allPosts.map(createPost)}
    </div>
  )
  
  function gallerySelect(index,dir) {
    if (dir==='next') {
      dispatch(setSelectedInGallery({postId: index, mediaId: allPosts[index].data.gallery_data.selected+1}));
    } else {
      dispatch(setSelectedInGallery({postId: index, mediaId: allPosts[index].data.gallery_data.selected-1}));
    }
  }


  function createPost(post, ix) {
    let postData = {
      id: post.data.post_id,
      title: cleanText(post.data.title),
      url: post.data.permalink,
      category: post.data.subreddit_name_prefixed,
      author: post.data.author,
      age: getAge(post.data.created_utc),
      score: shortenNum(post.data.score),
      commentsCount: shortenNum(post.data.num_comments),
      content: {}
    };

    if (!post.data.is_self) {
      switch (post.data.post_hint) {
        case "link":
          postData.type = "link";
          const postURL = post.data.url_overridden_by_dest;
          postData.content.link = postURL.charAt(0) === '/' ? 'https://www.reddit.com' + postURL : postURL;
          if(post.data.media_embed.content) {
            postData.content.thumbnail = post.data.media.oembed.thumbnail_url;
          }
          break;
        case "image":
          if (post.data.preview.reddit_video_preview) {
            postData.type = "video";
            postData.content.video = clearVideoURL(post.data.preview.reddit_video_preview.fallback_url);
          } else {
            postData.type = "image";
            postData.content.img = post.data.url;
            postData.content.mediaCount = 0;
          }
          
          break;
        case "hosted:video":
          postData.type = "video";
          postData.content.video = clearVideoURL(post.data.media.reddit_video.fallback_url);
          break;
        case "rich:video":
          if (post.data.preview.reddit_video_preview) {
            postData.type = "video";
            postData.content.video = clearVideoURL(post.data.preview.reddit_video_preview.fallback_url);
          } else {
            postData.type = "link";
            const postURL = post.data.url_overridden_by_dest;
            postData.content.link = postURL.charAt(0) === '/' ? 'https://www.reddit.com' + postURL : postURL;
            postData.content.thumbnail = post.data.media.oembed.thumbnail_url;
          }
          
          break;
        case "self":
          break;
        default:
          if (post.data.is_gallery === true) {
            postData.type = "image";
            postData.content.img = post.data.media_metadata[post.data.gallery_data.items[post.data.gallery_data.selected].media_id].p[post.data.media_metadata[post.data.gallery_data.items[post.data.gallery_data.selected].media_id].p.length-1].u;
            postData.content.mediaCount = post.data.gallery_data.items.length-1;
            postData.content.mediaSelected = post.data.gallery_data.selected;
          } else {
            if (post.data.crosspost_parent) {
              postData.type = "link";
              postData.content.link = post.data.url_overridden_by_dest;
            } else {
              if (post.data.tournament_data || post.data.url_overridden_by_dest) {
                postData.type = "link";
                postData.content.link = post.data.url_overridden_by_dest;
              } else {
                postData.type='unknown';
                alert("Unknown. Post " + ix);
              }
            }
          }
      }
    } else {
      if (post.data.selftext) {
        if (post.data.post_hint === 'self') {
          postData.type = 'link';
          postData.content.link = postData.url;
        } else {
          postData.type = 'text';
          postData.content.text = post.data.selftext;
        }
      } else {
        postData.type = 'self';
      }
    }
    
    return (
      <Post
        postData={postData}
        key={ix}
        gallerySelect={gallerySelect}
        showComments={postData.id === postShowingComments}
        setShowComments={showComments}
        showShareMenu={postData.id === postShowingShareMenu}
        setShowShareMenu={showShareMenu}
      />
    )
  }

  function clearVideoURL(url) {
    return url.indexOf('?') > 0 ? url.slice(0,url.indexOf('?')) : url;
  }

  function cleanText(txt) {
    if(txt.indexOf('&amp') > 0) {
      txt = txt.slice(0,txt.indexOf('&amp')) + '&' + txt.slice(txt.indexOf('&amp')+5);
    }
    return txt;
  }
}