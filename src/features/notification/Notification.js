import { useEffect } from "react";

export function Notification ( {msg, fadeOut, setFadeOut}) {

  useEffect (() => {
    setTimeout(() => setFadeOut(), 2500)
  }, [setFadeOut]);

  return (
    <div id="app-notification" className={fadeOut ? "fade-out" : "fade-in"}><div>{msg}</div></div>
  )
}