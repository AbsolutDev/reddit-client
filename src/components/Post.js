import { Comments } from '../features/comments/Comments';
import { useDispatch } from 'react-redux';
import { setNotificationMessage } from '../features/notification/notificationSlice';

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
            <a href={postData.content.link} target="_blank">
              {postData.content.thumbnail ? <img src={postData.content.thumbnail}/> : shortenURL(postData.content.link)}
              {!postData.content.thumbnail && <img src="./icons/link.svg" />}
            </a>
          </div>
        );
        break;
      case 'image':
        if (postData.content.mediaCount > 0) {
          postContent = (
            <div className="post-content gallery" id={postData.id}>
            <img src={cleanURL(postData.content.img)} />
            <div className="gallery-info-wrap">
              <div className="gallery-info">
                {postData.content.mediaSelected+1}/{postData.content.mediaCount+1}
              </div>
            </div>
            <div className="gallery-buttons">
              <img className={postData.content.mediaSelected > 0 ? "" : "hidden"} src='./icons/arrow_left.svg' onClick={galleryPrevClickHandler} />
              <img className={postData.content.mediaSelected<postData.content.mediaCount ? "" : "hidden"} src='./icons/arrow_right.svg' onClick={galleryNextClickHandler} />
            </div>
          </div>
          )
        } else {
          postContent = (
            <div className="post-content image">
              <img src={postData.content.img} />
            </div>
          );
        }
        break;
      case 'video':
        postContent = (
          <div className="post-content video">
            <video src={postData.content.video} controls preload='auto'>
              ...
            </video>
          </div>
        );
        break;
      case 'text':
        postContent = (
          <div className="post-content text">
            {postData.content.text.length > 500 ? postData.content.text.slice(0,500)+'...' : postData.content.text}
            {postData.content.text.length > 500 && <a href={"https://www.reddit.com" + postData.url} target="_blank"><img src="./icons/link.svg" /></a>}
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

  const embedButtonHandler = () => {
    dispatch(setNotificationMessage("Code copied to clipboard."))
    navigator.clipboard.writeText(embedTxt);
  }

  return (
    <div className="post">
      <div className="post-title">
        <a href={"https://www.reddit.com" + postData.url} target="_blank">{postData.title}</a>
      </div>
        {postContent}     
      <div className="post-info">
        <div className="post-subreddit">
          {postData.category}
        </div>
        <div className="post-author">
          posted by {postData.author} {postData.age} ago
        </div>
      </div>
      <div className="post-footer">
        <div className="post-footer-left">
          <div className="post-votes-container">
              <img className="light" src="./icons/arrow_upB.svg" />
              <div className="votes-count">
                {postData.score}
              </div>
              <img className="light" src="./icons/arrow_downB.svg" />
          </div>
          <div className="post-comments-container" onClick={commentsButtonHandler}>
            <img className="light" src="./icons/comments.svg" />
            <img className="dark" src="./icons/comments_dark.svg" />
            <div className="comments-count">
              {postData.commentsCount}
            </div>
          </div>
        </div>
        <div className="post-footer-right">
          <div className="post-share-button" onClick={shareButtonHandler}>
            <img className="light" src="./icons/share.svg" />
            <img className="dark" src="./icons/share_dark.svg" />
            <div className={"post-share-menu" + (showShareMenu ? "" : " hidden")}>
              <div onClick={copyLinkButtonHandler}><img src="./icons/shareCopyLink.svg"/>Copy link</div>
              <div><a href={emailUrl}><img src="./icons/shareEmail.svg"/>Email</a></div>
              <div onClick={embedButtonHandler}><img src="./icons/shareEmbed.svg"/>Embed</div>
            </div>
          </div>
        </div>
      </div>
      
      {showComments && <Comments url={"https://www.reddit.com" + postData.url} postId={postData.id} setShowComments={setShowComments} />}
    </div>
  )
}