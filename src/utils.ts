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
