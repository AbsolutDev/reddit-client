export default function getAge (value) {
  const utcNow = Date.now();
  let utcDiff = utcNow-value*1000;

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