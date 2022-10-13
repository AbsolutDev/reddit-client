export function Subreddit(props) {
  const {
    subTitle,
    subURL,
    subId,
    iconURL,
    isSelected,
    onClick,
  } = props;

  function onClickHandler() {
    onClick(subId, subURL);
  }

  return (
    <div className={(isSelected === 'true') ? "subreddit selected" : "subreddit"} onClick={onClickHandler}>
      <img src={iconURL === 'search' ? "./icons/search2.svg" : iconURL} alt="Subreddit icon" />
      <div className="subreddit-name">{subTitle.length > 22 ? subTitle.slice(0,22)+'...' : subTitle}</div>
    </div>
  )
}