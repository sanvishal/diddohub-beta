import { useRef } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { useEditorProxyStore } from "./Editor";
import { extractIDFromYoutubeURL } from "./utils";
import { useVideoContext } from "./VideoContext";

export const VideoContainer = ({ url }: { url: string }) => {
  const videoRef = useRef<YouTubeEvent>();
  const { setVideoRef } = useVideoContext();
  const setRef = useEditorProxyStore((state) => state.setVideoRef);

  return (
    <YouTube
      videoId={extractIDFromYoutubeURL(url)}
      onStateChange={(e) => console.log(e)}
      opts={{ height: "500px", width: "100%", rel: 0 }}
      id="video-iframe"
      onReady={(e) => {
        // @ts-ignore
        setRef(e);
        videoRef.current = e;
        setVideoRef?.(e);
      }}
    />
  );
};
