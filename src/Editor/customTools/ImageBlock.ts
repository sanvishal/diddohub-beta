import {
  API,
  BlockTool,
  BlockToolConstructorOptions,
  FilePasteEvent,
  HTMLPasteEventDetail,
  PasteEvent,
} from "@editorjs/editorjs";
import { AllHTMLAttributes } from "react";

interface ImageBlockDOM {
  wrapper: HTMLElement | null;
  imageHolder: HTMLElement | null;
  image: HTMLImageElement | null;
  caption: HTMLElement | null;
}

export default class ImageBlock implements BlockTool {
  api: API;
  readOnly: boolean;
  blockIndex: number;
  CSS: Record<string, string>;
  nodes: ImageBlockDOM;
  _data: any;

  constructor({ data, config, api, readOnly }: BlockToolConstructorOptions) {
    /**
     * Editor.js API
     */
    this.api = api;
    this.readOnly = readOnly;

    /**
     * When block is only constructing,
     * current block points to previous block.
     * So real block index will be +1 after rendering
     *
     * @todo place it at the `rendered` event hook to get real block index without +1;
     * @type {number}
     */
    this.blockIndex = this.api.blocks.getCurrentBlockIndex() + 1;

    /**
     * Styles
     */
    this.CSS = {
      baseClass: this.api.styles.block,
      loading: this.api.styles.loader,
      input: this.api.styles.input,
      wrapper: "simple-image",
      imageHolder: "simple-image__picture",
      caption: "simple-image__caption",
    };

    this.nodes = {
      wrapper: null,
      imageHolder: null,
      image: null,
      caption: null,
    };

    this.data = {
      url: data.url || "",
      caption: data.caption || "",
    };
  }

  render() {
    const wrapper = this._make("div", [this.CSS.baseClass, this.CSS.wrapper]),
      loader = this._make("div", [this.CSS.loading]),
      imageHolder = this._make("div", [this.CSS.imageHolder]),
      image = this._make("img") as HTMLImageElement,
      caption = this._make("div", [this.CSS.input, this.CSS.caption], {
        contentEditable: !this.readOnly,
        innerHTML: this.data.caption || "",
      });

    caption.dataset.placeholder = "Enter a caption";

    wrapper.appendChild(loader);

    if (this.data.url) {
      image.src = this.data.url;
    }

    image.onload = () => {
      wrapper.classList.remove(this.CSS.loading);
      imageHolder.appendChild(image);
      wrapper.appendChild(imageHolder);
      wrapper.appendChild(caption);
      loader.remove();
    };

    image.onerror = (e: any) => {
      // TODO use api.Notifies.show() to show error notification
      console.error("Failed to load an image", e);
    };

    this.nodes.imageHolder = imageHolder;
    this.nodes.wrapper = wrapper;
    this.nodes.image = image;
    this.nodes.caption = caption;

    return wrapper;
  }

  save(blockContent: HTMLElement) {
    const image = blockContent.querySelector("img"),
      caption = blockContent.querySelector("." + this.CSS.input);

    if (!image) {
      return this.data;
    }

    return Object.assign(this.data, {
      url: image.src,
      caption: caption?.innerHTML ?? "",
    });
  }

  static get sanitize() {
    return {
      url: {},
      caption: {
        br: true,
      },
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  onPaste(event: PasteEvent) {
    console.log(event);
    switch (event.type) {
      case "tag": {
        const img = (event.detail as HTMLPasteEventDetail).data as HTMLImageElement;

        this.data = {
          url: img.src,
        };
        break;
      }

      case "pattern": {
        const { data: text } = event.detail as HTMLPasteEventDetail;

        this.data = {
          url: text,
        };
        break;
      }
    }
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = Object.assign({}, this.data, data);

    if (this.nodes.image) {
      this.nodes.image.src = this.data.url;
    }

    if (this.nodes.caption) {
      this.nodes.caption.innerHTML = this.data.caption;
    }
  }

  static get pasteConfig() {
    return {
      patterns: {
        image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png|webp)$/i,
      },
      tags: ["img"],
    };
  }

  _make(tagName: string, classNames: string[] = [], attributes: AllHTMLAttributes<HTMLElement> & { innerHTML?: string } = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      // @ts-ignore
      el[attrName] = attributes[attrName];
    }

    return el;
  }
}
