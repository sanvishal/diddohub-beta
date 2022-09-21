import { API, BlockToolData, BlockToolConstructorOptions, BlockTool, BlockAPI } from "@editorjs/editorjs";
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

  constructor({ data, api, readOnly, block }: BlockToolConstructorOptions) {
    this.api = api;
    this.block = block;

    this._data = this.normalizeData(data);
    this.readOnly = readOnly;

    this._wrapperElement = this.getTag();
    this.initialTimestamp = 0;
  }

  static get isReadOnlySupported() {
    return true;
  }

  rendered(): void {
    if (!this.readOnly && this.block) {
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
    // console.log(this.videoRef);
    // this.videoRef?.target.seekTo(this.currentTimeStamp);
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
