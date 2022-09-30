export function Post (props) {
  const {
    postData,
    gallerySelect
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
            {postData.content.text.length > 500 && <a href={postData.url} target="_blank"><img src="./icons/link.svg" /></a>}
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

  return (
    <div className="post">
      <div className="post-title">
        <a href={postData.url} target="_blank">{postData.title + ' [' + postData.id + ':' + postData.type + ']'}</a>
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
          <div className="post-comments-container">
            <img className="light" src="./icons/comments.svg" />
            <img className="dark" src="./icons/comments_dark.svg" />
            <div className="comments-count">
              {postData.commentsCount}
            </div>
          </div>
        </div>
        <div className="post-footer-right">
          <img className="light" src="./icons/share.svg" />
          <img className="dark" src="./icons/share_dark.svg" />
        </div>
      </div>
    </div>
  )
}