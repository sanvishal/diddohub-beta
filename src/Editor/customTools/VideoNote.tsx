import { API, BlockToolData, BlockToolConstructorOptions, BlockTool } from "@editorjs/editorjs";
import { YouTubeEvent } from "react-youtube";
import { formatSecondsTimestamp } from "../../utils";
import { useEditorProxyStore } from "../editorProxyStore";
// import { useBearStore } from "../editorProxyStore";
// import { state } from "../store";

interface IVideoNoteBlockData {
  text: string;
  timestamp: number;
}

export default class VideoNote implements BlockTool {
  _data: BlockToolData<IVideoNoteBlockData>;
  _wrapperElement: {
    wrapper: HTMLElement;
    editable: HTMLElement;
    timestamp: HTMLElement;
  };
  api: API;
  readOnly: boolean;
  videoRef: YouTubeEvent | null;
  videoRefStoreUnSubscribe: () => void;
  initialTimestamp: number;

  constructor({ data, api, readOnly }: BlockToolConstructorOptions) {
    this.api = api;
    this.videoRef = useEditorProxyStore.getState().videoRef;
    // subscribe to store, just to make sure
    this.videoRefStoreUnSubscribe = useEditorProxyStore.subscribe(({ videoRef }) => {
      this.videoRef = videoRef;
    });
    this.initialTimestamp = this.videoRef?.target?.getCurrentTime() || 0;

    this._data = this.normalizeData(data);
    this.readOnly = readOnly;

    this._wrapperElement = this.getTag();
  }

  destroy() {
    this.videoRefStoreUnSubscribe();
  }

  static get isReadOnlySupported() {
    return true;
  }

  normalizeData(data: IVideoNoteBlockData) {
    const newData: IVideoNoteBlockData = {
      text: data?.text || "",
      timestamp: data?.timestamp || this.initialTimestamp,
    };
    return newData;
  }

  getTag() {
    const tag = document.createElement("div");
    tag.innerHTML = this._data.text || "";
    tag.classList.add("tool-videonote", "tool-content");
    tag.contentEditable = this.readOnly ? "false" : "true";
    tag.dataset.placeholder = "Add notes @ " + String(formatSecondsTimestamp(this.currentTimeStamp)) + "...";

    const timestampTag = document.createElement("div");
    timestampTag.innerHTML = String(formatSecondsTimestamp(this.currentTimeStamp));
    timestampTag.classList.add("tool-videonote", "tool-timestamp");

    const wrapper = document.createElement("div");
    wrapper.classList.add("tool-videonote", "tool-videonote-wrapper");
    wrapper.appendChild(timestampTag);
    wrapper.appendChild(tag);

    if (!this.readOnly) {
      timestampTag.addEventListener("click", () => this.jumpToTimeStamp());
    } else {
      wrapper.style.cursor = "pointer";
      wrapper.addEventListener("click", () => this.jumpToTimeStamp());
    }

    return {
      wrapper,
      editable: tag,
      timestamp: timestampTag,
    };
  }

  jumpToTimeStamp() {
    this.videoRef?.target.seekTo(this.currentTimeStamp);
  }

  get currentTimeStamp() {
    return this._data.timestamp || 0;
  }

  save(toolsContent: HTMLElement): IVideoNoteBlockData {
    return {
      text: toolsContent.getElementsByClassName("tool-content")?.[0]?.innerHTML || "",
      timestamp: this.currentTimeStamp,
    };
  }

  get data() {
    this._data.text = this._wrapperElement.editable.innerHTML;
    this._data.timestamp = this.currentTimeStamp;

    return this._data;
  }

  set data(data: IVideoNoteBlockData) {
    this._data = this.normalizeData(data);

    if (data.timestamp !== undefined && this._wrapperElement.wrapper.parentNode) {
      const newTag = this.getTag();

      newTag.editable.innerHTML = this._wrapperElement.editable.innerHTML;
      // @ts-ignore
      this._wrapperElement.editable.parentNode.replaceChild(newTag.editable, this._wrapperElement.editable);
      this._wrapperElement = newTag;
    }

    if (data.text !== undefined) {
      this._wrapperElement.editable.innerHTML = this._data.text || "";
    }
  }

  rendered(): void {
    if (this.videoRef) {
      this.videoRef?.target?.pauseVideo();
    }
  }

  render() {
    return this._wrapperElement.wrapper;
  }

  static get toolbox() {
    return {
      icon: "v",
      title: "VideoNote",
    };
  }
}
