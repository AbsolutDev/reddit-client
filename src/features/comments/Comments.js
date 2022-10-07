import React, { useEffect,  } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getComments, setDisplayedComments, setDisplayedReplies, selectComments, selectCommentsLoadingStatus, selectDisplayComments } from './commentsSlice';
import { Comment } from '../../components/Comment';
import getAge from '../../utils/getAge';
import shortenNum from '../../utils/shortenNum';

export const Comments = ({url, postId, setShowComments}) => {
  const allComments = useSelector(selectComments);
  const loadingStatus = useSelector(selectCommentsLoadingStatus);
  const displayComments = useSelector(selectDisplayComments);
  const dispatch = useDispatch();

  useEffect (() => {
    dispatch(getComments(url));
  }, []);

  if (loadingStatus || allComments.length === 0 ) {
    return (
      <div className="comments">
        Loading, please wait...
      </div>
    )
  }

  let commentsCount = allComments.length;
  let moreCommentsCount = 0;
  let offset = 0;
  if (allComments[commentsCount-1].kind === 'more') {
    offset = 1;
    commentsCount--;
    moreCommentsCount = allComments[commentsCount].data.count;
  }

  const commentsButtonHandler = (e) => {
    setShowComments(postId);
    e.target.parentNode.parentNode.parentNode.scrollIntoView({behaviour: "smooth", block: "start"});
  }

  const moreCommentsButtonHandler = () => {
    dispatch(setDisplayedComments(Math.min(displayComments + 10,allComments.length)));
  }

  function showHideReplies(commentId, repliesCount) {
    dispatch(setDisplayedReplies({id: commentId, replies: repliesCount}));
  }

  function createComment(comment, ix) {
    if (comment.kind === "more") {
      return (
        <div className="comments-more" key={ix}>
          <a href={url} target="_blank">
            {comment.data.count} {ix !== 0 && "more"} comment{comment.data.count > 1 && "s"}
            <img src="./icons/link.svg" />
          </a>
        </div>
      )
    }
    let commentData = {
      body: comment.data.body,
      body_html: comment.data.body_html,
      created: comment.data.created_utc,
      author: comment.data.author,
      votes: shortenNum(comment.data.score),
      url: "https://www.reddit.com" + comment.data.permalink,
      id: comment.data.comment_id
    };

    if (comment.data.replies.data) {
      commentData.replies =  comment.data.replies.data.children;
      commentData.show_replies = comment.data.show_replies;
    }

    return (
      <Comment data={commentData} key={ix} showHideReplies={showHideReplies} />
    )
  }
  
  return (
    <div className="comments">
      <div className="comments-close-container">
        <div className="comments-close" onClick={commentsButtonHandler}>
          X Close comments
        </div>
      </div>
      {allComments.slice(0,displayComments).map(createComment)}
      <div className="comments-more" onClick={moreCommentsButtonHandler}>
        {allComments.length - 1 - offset> displayComments && "Show " + (allComments.length - displayComments - offset + moreCommentsCount) + " more comment" + (allComments.length - displayComments - offset - 1 + moreCommentsCount> 1 ? "s." : ".")}
      </div>
    </div>
  )
}