import { createContext, useContext, useRef } from "react";
import { YouTubeEvent } from "react-youtube";

export const VideoContext = createContext<{ setVideoRef?: (ref: YouTubeEvent) => void }>({});

export const VideoProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const videoRef = useRef<YouTubeEvent>();

  const setVideoRef = (ref: YouTubeEvent) => {
    videoRef.current = ref;
  };

  return <VideoContext.Provider value={{ setVideoRef }}>{children}</VideoContext.Provider>;
};

export const useVideoContext = () => useContext(VideoContext);
