const src=['&lt;', '&gt;', '&amp;'];
const rep=['<', '>', '&'];

export default function cleanHtml (text) {
  for (let i=0;i<src.length;i++) {
    if (i===2) {
    }
    while(text.indexOf(src[i])>=0) {
      const start = text.indexOf(src[i]);
      text=text.slice(0,start).concat(rep[i],text.slice(start+src[i].length));
    }
  }
  return text;
}