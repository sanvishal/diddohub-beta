import { API, BlockToolData, BlockToolConstructorOptions, BlockTool, BlockAPI } from "@editorjs/editorjs";
import { YouTubeEvent } from "react-youtube";
import { formatSecondsTimestamp } from "../../utils";
import { useEditorProxyStore } from "../editorProxyStore";
// import { useBearStore } from "../editorProxyStore";
// import { state } from "../store";

interface IQuoteBlockData {
  text: string;
  timestamp: number;
}

export default class QuoteBlock implements BlockTool {
  _data: BlockToolData<IQuoteBlockData>;
  _wrapperElement: {
    wrapper: HTMLElement;
    editable: HTMLElement;
    timestamp: HTMLElement;
  };
  api: API;
  readOnly: boolean;
  initialTimestamp: number;
  block: BlockAPI | undefined;
  videoRef: YouTubeEvent | null;

  constructor({ data, api, readOnly, block }: BlockToolConstructorOptions) {
    this.api = api;
    this.block = block;

    this._data = this.normalizeData(data);
    this.readOnly = readOnly;

    this._wrapperElement = this.getTag();
    this.initialTimestamp = 0;
    this.videoRef = useEditorProxyStore.getState().videoRef;
  }

  static get isReadOnlySupported() {
    return true;
  }

  rendered(): void {
    this.videoRef = useEditorProxyStore.getState().videoRef;
    if (!this.readOnly && this.block && this._data.text === "" && this.currentTimeStamp === 0) {
      useEditorProxyStore.getState().addQuoteBlock({
        isOpen: true,
        id: this.block.id,
      });
    }
  }

  normalizeData(data: IQuoteBlockData) {
    const newData: IQuoteBlockData = {
      text: data?.text || "",
      timestamp: data?.timestamp || this.initialTimestamp,
    };
    return newData;
  }

  getTag() {
    const tag = document.createElement("div");
    let quotedText = this._data.text.trim() || "";
    if (quotedText.length > 0) {
      if (quotedText[0] === "“") {
        quotedText = quotedText.substring(1);
      }

      if (quotedText[quotedText.length - 1] === "”") {
        quotedText = quotedText.substring(0, quotedText.length - 1);
      }

      quotedText = "“" + quotedText + "”";
    }
    tag.innerHTML = quotedText || "";
    tag.classList.add("tool-quote", "tool-content");

    const timestampTag = document.createElement("div");
    timestampTag.innerHTML = "— " + String(formatSecondsTimestamp(this.currentTimeStamp));
    timestampTag.classList.add("tool-quote", "tool-timestamp");

    const wrapper = document.createElement("div");
    wrapper.classList.add("tool-quote", "tool-quote-wrapper");
    wrapper.appendChild(tag);
    wrapper.appendChild(timestampTag);

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
    if (this.videoRef) {
      this.videoRef?.target.seekTo(this.currentTimeStamp);
    }
  }

  get currentTimeStamp() {
    return this._data.timestamp || 0;
  }

  save(toolsContent: HTMLElement): IQuoteBlockData {
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

  set data(data: IQuoteBlockData) {
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

  render() {
    return this._wrapperElement.wrapper;
  }

  static get toolbox() {
    return {
      icon: "Q",
      title: "Quote Transcript",
    };
  }
}
