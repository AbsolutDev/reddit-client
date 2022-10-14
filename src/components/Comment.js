import cleanHtml from "../utils/cleanHtml";
import getAge from "../utils/getAge";

export const Comment = ({ data, showHideReplies, darkMode }) => {
  let repliesLinkTxt;
  let repliesCount = 0;
  let moreRepliesCount = 0;
  let offset = 0;
  let showReplies = data.show_replies;
  if (data.replies) {
    repliesCount = data.replies.length;
    if (showReplies === 0 && repliesCount === 1 && data.replies[0].kind === "more") {
      showReplies = 1;
    }
    if (data.replies[data.replies.length-1].kind === "more") {
      repliesCount--;
      offset = 1;
      moreRepliesCount = data.replies[data.replies.length-1].data.count;
    } 
    if (showReplies > 0) {
      if (data.replies[0].kind !== "more") {
        repliesLinkTxt = 'Hide replies';
      }
    } else {
      repliesLinkTxt = 'View ' + (repliesCount + moreRepliesCount) + (repliesCount + moreRepliesCount > 1 ? ' replies' : ' reply');
    }
  }

  function repliesClickHandler(e) {
    if (e.target.textContent === 'Hide replies') {
      showHideReplies(data.id, 0);
    } else {
      if (data.replies.length - offset - showReplies > 10) {
        showHideReplies(data.id, showReplies + 10);
      } else {
        showHideReplies(data.id, data.replies.length);
      }
    }
  }

  function createReply(reply, index) {
    if (reply.kind==="more") {
      return (
        <div className="reply-more" key={index}>
          <a href={data.url} target="_blank" rel="noreferrer">
            {reply.data.count} {index !== 0 && "more"} repl{reply.data.count > 1 ? "ies" : "y"}
            <img src={darkMode ? "./icons/linkD.svg" : "./icons/link.svg"} alt="External link"/>
          </a>
        </div>
      )
    }
    return (
      <div className="reply"  key={index}>
        <div className="comment-header">
          <div className="comment-author">{reply.data.author}</div>
          <div className="comment-date">{getAge(reply.data.created_utc)}</div>
        </div>
        <div className="comment-body">{reply.data.body}</div>
        <div className="comment-footer">
          <div className="comment-votes">
            <img src={darkMode ? "./icons/arrow_upD.svg" : "./icons/arrow_up.svg"} alt=""/>
              {reply.data.ups}
            <img src={darkMode ? "./icons/arrow_downD.svg" : "./icons/arrow_down.svg"} alt=""/>
          </div>
          <div className="reply-link">
            {reply.data.replies && <a href={"https://www.reddit.com" + reply.data.permalink} target="_blank" rel="noreferrer">Continue this thread<img src={darkMode ? "./icons/linkD.svg" : "./icons/link.svg"} alt="External link" /></a>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="comment" key={data.id}>
      <div className="comment-header">
        <div className="comment-author">{data.author}</div>
        <div className="comment-date">{getAge(data.created)}</div>
      </div>
      <div className="comment-body" dangerouslySetInnerHTML={{__html: cleanHtml(data.body)}}>
      </div>
      <div className="comment-footer">
        <div className="comment-votes">
          <img src={darkMode ? "./icons/arrow_upD.svg":"./icons/arrow_up.svg"} alt="" />
          {data.votes}
          <img src={darkMode ? "./icons/arrow_downD.svg":"./icons/arrow_down.svg"} alt="" />
        </div>
        <div className="comment-replies" onClick={repliesClickHandler}>
          {data.replies && repliesLinkTxt}
        </div>
      </div>
      {showReplies > 0 && data.replies.slice(0,showReplies).map(createReply)}
      <div className="replies-more" onClick={repliesClickHandler}>
        {showReplies > 0 && (showReplies < data.replies.length - offset && "Show " + (data.replies.length - offset - showReplies + moreRepliesCount) + " more replies" )}
      </div>
    </div>
  )
}