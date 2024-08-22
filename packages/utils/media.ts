import { MediaType } from "@micro/enums/media";
const customOssDomain = ["oss-preview.ccsmec.com"];
const aliyunOssDomain = ["aliyuncs.com"];
const extensionImage = [".png", ".jpg", ".jpeg", ".JPEG", ".webp"];
const extensionVideo = [".mp4"];
const extensionAudio = [".mp3"];
export const getImgResolution = (src: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      console.log(e);
    };
    img.src = src;
    img.crossOrigin = "anonymous";
  });
};
export const getMediaType = (value: string) => {
  if (extensionImage.some((ext) => value && value.includes(ext))) {
    return MediaType.IMAGE;
  } else if (extensionVideo.some((ext) => value && value.includes(ext))) {
    return MediaType.VIDEO;
  } else if (extensionAudio.some((ext) => value && value.includes(ext))) {
    return MediaType.AUDIO;
  } else {
    return MediaType.IMAGE;
  }
};

export const getMediaThmub = (value: string, p = 50) => {
  if (customOssDomain.some((ext) => value && value.includes(ext))) {
    const thumb = "_thumbnail";
    const pattern = new RegExp(`(${extensionImage.join("|")})`, "i");
    const newVal = value.replace(pattern, thumb + "$1") || "";
    return newVal;
  } else if (aliyunOssDomain.some((ext) => value && value.includes(ext))) {
    const newVal = value + `?x-oss-process=image/resize,p_${p}` || "";
    return newVal;
  } else {
    return value;
  }
};
export const getVideoThmub = (value: string, w = 0, h = 0, t = 0) => {
  if (aliyunOssDomain.some((ext) => value && value.includes(ext))) {
    const newVal =
      value +
        `?x-oss-process=video/snapshot,t_${t},f_jpg,w_${w},h_${h},m_fast` || "";
    return newVal;
  } else {
    return value;
  }
};
