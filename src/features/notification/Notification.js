import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearNotificationMessage } from "./notificationSlice";

export function Notification ( {msg, fadeOut, setFadeOut}) {

  useEffect (() => {
    setTimeout(() => setFadeOut(), 2000)
  }, []);

  return (
    <div id="app-notification" className={fadeOut ? "fade-out" : "fade-in"}>{msg}</div>
  )
}