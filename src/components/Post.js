import { Comments } from '../features/comments/Comments';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationMessage } from '../features/notification/notificationSlice';
import { setSelected, setExtraSubreddit, clearExtraSubreddit, selectSubredditNames } from '../features/subreddits/subredditsSlice';
import { getPosts } from '../features/posts/postsSlice';
import { selectDisplayMode } from '../features/displayMode/displayModeSlice';
import { clearSearchTerm } from '../features/searchTerm/searchTermSlice';

export function Post (props) {
  const dispatch = useDispatch();
  const {
    postData,
    gallerySelect,
    showComments,
    setShowComments,
    showShareMenu,
    setShowShareMenu
  } = props;

  const darkMode = useSelector(selectDisplayMode);
  const subredditNames = useSelector(selectSubredditNames);

  function shortenURL(url) {
    const length=7;
    const domEnd = url.slice(8,url.length).indexOf('/')+8;
    return url.slice(8,domEnd+length) + (url.length > domEnd+length ? '...' : '');
  }

  function cleanURL(url) {
    while (url.indexOf('amp;') > 0) {
      url=url.replace('amp;','');
    }
    return url;
  }

  function galleryPrevClickHandler(e) {
    gallerySelect(postData.id,'prev');
  }

  function galleryNextClickHandler(e) {
    gallerySelect(postData.id,'next');
  }

  const emailUrl = `mailto:?subject=Check out "${postData.title}"&body=This is funny, you must check it out!%0A${postData.title}%0Ahttps://www.reddit.com${postData.url}`;
  const embedTxt = `<iframe id="reddit-embed" src="https://www.redditmedia.com${postData.url}?ref_source=embed&amp;ref=share&amp;embed=true" sandbox="allow-scripts allow-same-origin allow-popups" style="border: none;" height="250" width="640" scrolling="no"></iframe>`

  let postContent = '';
  if (postData.type !== 'self') {
    switch (postData.type) {
      case 'link':
        postContent = (
          <div className={postData.content.thumbnail ? "post-content link" : "post-content link left"}>
            <a href={postData.content.link} target="_blank" rel="noreferrer">
              {postData.content.thumbnail ? <img src={postData.content.thumbnail} alt="Post thumbnail" /> : shortenURL(postData.content.link)}
              {!postData.content.thumbnail && <img src={darkMode ? "./icons/linkD.svg" : "./icons/link.svg"} alt="External link" />}
            </a>
          </div>
        );
        break;
      case 'image':
        if (postData.content.mediaCount > 0) {
          postContent = (
            <div className="post-content gallery" id={postData.id}>
            <img src={cleanURL(postData.content.img)} alt="Post" />
            <div className="gallery-info-wrap">
              <div className="gallery-info">
                {postData.content.mediaSelected+1}/{postData.content.mediaCount+1}
              </div>
            </div>
            <div className="gallery-buttons">
              <img className={postData.content.mediaSelected > 0 ? "" : "hidden"} src={darkMode ? './icons/gallery_leftD.svg' : './icons/gallery_left.svg'} onClick={galleryPrevClickHandler} alt="Previous in galery" />
              <img className={postData.content.mediaSelected<postData.content.mediaCount ? "" : "hidden"} src={darkMode ? './icons/gallery_rightD.svg' : './icons/gallery_right.svg'} onClick={galleryNextClickHandler} alt="Next in galery" />
            </div>
          </div>
          )
        } else {
          postContent = (
            <div className="post-content image">
              <img src={postData.content.img} alt="Post" />
            </div>
          );
        }
        break;
      case 'video':
        postContent = (
          <div className="post-content video">
            <video src={postData.content.video} controls preload='auto' alt="Posted video">
              ...
            </video>
          </div>
        );
        break;
      case 'text':
        postContent = (
          <div className="post-content text">
            {postData.content.text.length > 500 ? postData.content.text.slice(0,500)+'...' : postData.content.text}
            {postData.content.text.length > 500 && <a href={"https://www.reddit.com" + postData.url} target="_blank" rel="noreferrer"><img src={darkMode ? "./icons/linkD.svg" : "./icons/link.svg"} alt="Link to original post" /></a>}
          </div>
        );
        break;
      case 'unknown':
      default:
        postContent = (
          <div className="post-content">
            <div>
              Unknown content type
            </div>
          </div>
        );
    }
  }

  const commentsButtonHandler = () => {
    setShowComments(postData.id);
  }

  const shareButtonHandler = () => {
    setShowShareMenu(postData.id);
  }

  const copyLinkButtonHandler = () => {
    dispatch(setNotificationMessage("Link copied to clipboard."))
    navigator.clipboard.writeText("https://www.reddit.com" + postData.url);
  }

  const postCategoryClickHandler = () => {
    let subredditExists = false;
    for (let i=0;i<subredditNames.length;i++) {
      if (subredditNames[i]===postData.category) {
        dispatch(setSelected(i+2));
        dispatch(clearExtraSubreddit());
        dispatch(clearSearchTerm());
        subredditExists = true;
      }
    }
    if (!subredditExists) {
      dispatch(setExtraSubreddit({
        title: postData.category.slice(2),
        display_name: postData.category.slice(2),
        description: "",
        url: '/' + postData.category + '/',
        icon_img: './icons/subr.svg',
        src: "post_subreddit_click"
      }));
      dispatch(setSelected(0));
    };
    dispatch(getPosts('/' + postData.category + '/'));
    document.getElementById("app-top").scrollIntoView({behaviour: "smooth", block: "start"});
  }

  const embedButtonHandler = () => {
    dispatch(setNotificationMessage("Code copied to clipboard."))
    navigator.clipboard.writeText(embedTxt);
  }

  return (
    <div className="post">
      <div className="post-title">
        <a href={"https://www.reddit.com" + postData.url} target="_blank" rel="noreferrer">{postData.title}</a>
      </div>
        {postContent}     
      <div className="post-info">
        <div className="post-subreddit" onClick={postCategoryClickHandler}>
          {postData.category}
        </div>
        <div className="post-author">
          posted by {postData.author} {postData.age} ago
        </div>
      </div>
      <div className="post-footer">
        <div className="post-footer-left">
          <div className="post-votes-container">
              <img src={darkMode ? "./icons/arrow_upD.svg" : "./icons/arrow_up.svg"} alt="" />
              <div className="votes-count">
                {postData.score}
              </div>
              <img src={darkMode ? "./icons/arrow_downD.svg" : "./icons/arrow_down.svg"} alt="" />
          </div>
          <div className="post-comments-container" onClick={commentsButtonHandler}>
            <img src={darkMode ? "./icons/commentsD.svg" : "./icons/comments.svg"} alt="Click for comments" />
            <div className="comments-count">
              {postData.commentsCount}
            </div>
          </div>
        </div>
        <div className="post-footer-right">
          <div className="post-share-button" onClick={shareButtonHandler}>
            <img src={darkMode ? "./icons/shareD.svg" : "./icons/share.svg"} alt="Share post" />
            <div className={"post-share-menu" + (showShareMenu ? "" : " hidden")}>
              <div onClick={copyLinkButtonHandler}><img src={darkMode ? "./icons/shareCopyLinkD.svg" : "./icons/shareCopyLink.svg"} alt="Copy link" />Copy link</div>
              <div><a href={emailUrl}><img src={darkMode ? "./icons/shareEmailD.svg" : "./icons/shareEmail.svg"} alt="Email post" />Email</a></div>
              <div onClick={embedButtonHandler}><img src={darkMode ? "./icons/shareEmbedD.svg" : "./icons/shareEmbed.svg"} alt="Copy code to embed" />Embed</div>
            </div>
          </div>
        </div>
      </div>
      
      {showComments && <Comments url={"https://www.reddit.com" + postData.url} postId={postData.id} setShowComments={setShowComments} />}
    </div>
  )
}