import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPosts, selectPostsLoadingStatus, getPosts, getOfflinePosts, setSelectedInGallery } from './postsSlice';
import { selectSearchTerm } from '../searchTerm/searchTermSlice';
import { selectDefaultSubredditURL } from '../subreddits/subredditsSlice';
import { Post } from '../../components/Post.js';

export function Posts() {
  const allPosts = useSelector(selectPosts);
  const isLoading = useSelector(selectPostsLoadingStatus);
  const searchTerm = useSelector(selectSearchTerm);
  const dispatch = useDispatch();
  const defaultSubredditURL = useSelector(selectDefaultSubredditURL);

  let filteredPosts = allPosts.filter((post, index) => post.data.title.toLowerCase().includes(searchTerm.toLowerCase()));
  
  useEffect (() => { dispatch(getOfflinePosts()) }, []);
  //useEffect (() => { dispatch(getPosts(defaultSubredditURL)) }, []);

  if (allPosts.length === 0) {
    return <div> Wait... </div>
  }
  
  if (isLoading) {
    return <div> Loading... </div>
  }
  
  return (
    <div className="main-feed">
      {filteredPosts.map(createPost)}
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
      url: "https://www.reddit.com" + post.data.permalink,
      category: post.data.subreddit_name_prefixed,
      author: post.data.author,
      age: getPostAge(post.data.created_utc),
      score: shortenNum(post.data.score),
      commentsCount: shortenNum(post.data.num_comments),
      content: {}
    };
    if (!post.data.locked) {
      //alert(ix);
    }
    if (ix===2) {
      //alert(post.data.title);
      //alert(post.data.is_self);
      //alert(post.data.post_hint);
      //alert(post.data.url);
      //alert(post.data.preview.reddit_video_preview.fallback_url);
      //alert(post.data.url_overridden_by_dest);
      //preview.reddit_video_preview.fallback_url: https://v.redd.it/ighvy6881qq91/DASH_360.mp4
      //alert(post.data.preview.reddit_video_preview.fallback_url);

      //secure_media.type: youtube.com
      //secure_media.oembed.title/thumbnail_url
      //domain: youtube.com
      //url_overriden_by_dest: https://www.youtube.com/watch?v=hvMKgMZsfDM
      //url: https://www.youtube.com/watch?v=hvMKgMZsfDM
      //media.oembed.provider_url/title/thumbnail_width/thumbnail_url/
      //media.type: youtube.com
    }
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
          postData.type = "image";
          postData.content.img = post.data.url;
          postData.content.mediaCount = 0;
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
          alert("Self indeed. Post " + ix);
          break;
        default:
          if (post.data.is_gallery === true) {
            postData.type = "image";
            postData.content.img = post.data.media_metadata[post.data.gallery_data.items[post.data.gallery_data.selected].media_id].p[post.data.media_metadata[post.data.gallery_data.items[post.data.gallery_data.selected].media_id].p.length-1].u;
            postData.content.mediaCount = post.data.gallery_data.items.length-1;
            postData.content.mediaSelected = post.data.gallery_data.selected;
          } else {
            if (post.data.crosspost_parent) {
              alert("Crosspost. Post " + ix);
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
        //postContent = formatSelfText(post.data.selftext);
      } else {
        postData.type = 'self';
      }
    }
    
    return (
      <Post
        postData={postData}
        key={ix}
        gallerySelect={gallerySelect}
      />
    )
  }

  function formatSelfText (text) {
    /*
    What is the best way to repair the cracks in the joints between my steps and also below my side door entrance? I was thinking of using fast set concrete patcher.
    [https://imgur.com/a/uCHfDJL](https://imgur.com/a/uCHfDJL)
    https://preview.redd.it/iyo1ajd5vip91.jpg?width=640&amp;format=pjpg&amp;auto=webp&amp;s=bf12e48b20a6d389d5cc2e4ba275bbb31ccb7c50
    */
    while (text.indexOf('[http')>0) {
      const start = text.indexOf('[http');
      let newText=text.slice(0,start).concat();
      let restText=text.slice(start).concat();
      let urlLength = restText.indexOf(']');
      let url = restText.slice(1,urlLength);
      if (text.charAt(start+urlLength+1) === '(') {
        restText=text.slice(start+urlLength+1);
        let altLength=restText.indexOf(')');
        let altText=restText.slice(1,altLength);
        text = newText.concat(`<a href="${url}">${altText}</a>`,restText.slice(altLength+1));
      } else {
        text = newText.concat(`<a href="${url}">${url}</a>`,restText.slice(urlLength+1));
      }
    }
    if (text.indexOf('http')>0) {
      const start = text.indexOf('http');
      //alert(text.slice(start));
    }
    //return text;
    
  }

  function getPostAge (posted) {
    const utcNow = Date.now();
    let utcDiff = utcNow-posted*1000;

    //Convert to minutes
    utcDiff = (utcDiff/1000/60).toFixed(0);
    if (utcDiff<60) { return (utcDiff + " minute" + (utcDiff>1 ? "s" : "")) };

    //Convert to hours
    utcDiff = (utcDiff/60).toFixed(0);
    if (utcDiff<24) { return utcDiff + " hour" + (utcDiff>1 ? "s" : "")};

    //Convert to days
    utcDiff = (utcDiff/24).toFixed(0);
    if (utcDiff<7) { return utcDiff + " day" + (utcDiff>1 ? "s" : "")};

    //Convert to weeks
    utcDiff = (utcDiff/7).toFixed(0);
    if (utcDiff<4) { return utcDiff + " week" + (utcDiff>1 ? "s" : "")};

    //Convert to months
    utcDiff = (utcDiff/4).toFixed(0);
    if (utcDiff<12) { return utcDiff + " month" + (utcDiff>1 ? "s" : "")}

    //Return years
    utcDiff = (utcDiff/12).toFixed(0);
    return utcDiff + " year" + (utcDiff>1 ? "s" : "");
  }

  function shortenNum(score) {
    if (score<1000) { return score } ;
    if (score<100000) { return (score/1000).toFixed(1) + "k"}
    if (score<1000000) { return (score/1000).toFixed(0) + "k"}
    if (score<1000000000) return ((score/1000000).toFixed(1) + "M")
    return (score/1000000000).toFixed(1) + "B";
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