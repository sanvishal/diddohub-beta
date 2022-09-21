export const formatSecondsTimestamp = (d: number) => {
  d = Number(d);
  let h = Math.floor(d / 3600);
  let m = Math.floor((d % 3600) / 60);
  let s = Math.floor((d % 3600) % 60);

  const paddedH = String(h).padStart(2, "0");
  const paddedM = String(m).padStart(2, "0");
  const paddedS = String(s).padStart(2, "0");

  return h > 0 ? [paddedH, paddedM, paddedS].join(":") : [paddedM, paddedS].join(":");
};

export const delay = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

// https://stackoverflow.com/a/27728417/14806010
export const extractIDFromYoutubeURL = (url: string): string => {
  const regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(regex);
  if (match && match?.length) {
    return match[1] || "";
  }

  return "";
};

export const findNearestTranscriptByTimeStamp = (ts: number, transcripts: { timestamp: number; text: string }[]) => {
  try {
    if (transcripts && transcripts?.length) {
      let smallestDiff = Infinity;
      let nearestTranscript = null;
      let siblingTranscripts = [
        { timestamp: 0, text: "x" },
        { timestamp: 0, text: "x" },
      ];
      for (let i = 0; i < transcripts.length; i++) {
        const diff = Math.abs(ts - transcripts[i].timestamp / 1000);
        if (smallestDiff > diff) {
          smallestDiff = diff;
          nearestTranscript = transcripts[i];
          if (i - 1 >= 0) {
            siblingTranscripts[0] = transcripts[i - 1];
          }
          if (i + 1 < transcripts.length) {
            siblingTranscripts[1] = transcripts[i + 1];
          }
        }
      }

      if (!nearestTranscript) {
        return null;
      }

      if (siblingTranscripts[0].text === "x" && siblingTranscripts[0].timestamp === 0) {
        siblingTranscripts[0] = nearestTranscript;
      }

      if (siblingTranscripts[1].text === "x" && siblingTranscripts[1].timestamp === 0) {
        siblingTranscripts[1] = nearestTranscript;
      }

      return { currentTranscript: nearestTranscript, nearestTranscripts: [nearestTranscript, ...siblingTranscripts] };
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  return null;
};
