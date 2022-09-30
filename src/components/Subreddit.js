export function Subreddit(props) {
  const {
    subTitle,
    subURL,
    subDescription,
    subId,
    iconURL,
    isSelected,
    onClick
  } = props;

  function onClickHandler() {
    onClick(subId, subURL);
  }

  return (
    <div className={(isSelected === 'true') ? "subreddit selected" : "subreddit"} onClick={onClickHandler}>
      <img src={iconURL} />
      <div className="subreddit-name">{subTitle.length > 22 ? subTitle.slice(0,22)+'...' : subTitle}</div>
    </div>
  )
}