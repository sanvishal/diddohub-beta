import { Box } from "@chakra-ui/react";
import { useRef } from "react";
import YouTube, { YouTubeEvent } from "react-youtube";
import { useEditorProxyStore } from "./Editor";
import { extractIDFromYoutubeURL } from "./utils";
import { useVideoContext } from "./VideoContext";

export const YoutubeVideoContainer = ({ url }: { url: string }) => {
  const videoRef = useRef<YouTubeEvent>();
  const { setVideoRef } = useVideoContext();
  const setRef = useEditorProxyStore((state) => state.setVideoRef);

  return (
    <Box id="video-iframe">
      <YouTube
        videoId={extractIDFromYoutubeURL(url)}
        onStateChange={(e) => console.log(e)}
        opts={{ height: "500px", width: "100%", rel: 0 }}
        onReady={(e) => {
          // @ts-ignore
          setRef(e);
          videoRef.current = e;
          setVideoRef?.(e);
        }}
      />{" "}
    </Box>
  );
};
