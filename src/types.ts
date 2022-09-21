import { OutputData } from "@editorjs/editorjs";

export enum StepType {
  YOUTUBE = "YOUTUBE",
  VIMEO = "VIMEO",
}

export type YoutubeMeta = {
  duration: number;
};

export type VimeoMeta = {
  duration: number;
};

export type StepContentMeta<T extends StepType> = T extends StepType.YOUTUBE
  ? YoutubeMeta
  : T extends StepType.VIMEO
  ? VimeoMeta
  : Record<string, any>;

export type Step<T extends StepType = any> = {
  id: string;
  name: string;
  content: string;
  type: T;
  contentMeta?: StepContentMeta<T>;
};

export type StepBody = (Step & { body: OutputData | null }) | null;
