export default function shortenNum(value) {
  if (value<1000) { return value } ;
  if (value<9951) { return (value/1000).toFixed(1) + "k"}
  if (value<999500) { return (value/1000).toFixed(0) + "k"}
  if (value<999500000) return ((value/1000000).toFixed(0) + "M")
  return (value/1000000000).toFixed(1) + "B";
}