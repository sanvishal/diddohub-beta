import { OutputData } from "@editorjs/editorjs";
import { Step, StepType } from "./types";
import { delay } from "./utils";

const steps: Step[] = [
  { id: "some", name: "JS Closures", content: "https://youtu.be/qikxEIxsXco", type: StepType.YOUTUBE },
  {
    id: "2342345",
    name: "Scope Chain, How do they work?",
    content: "https://www.youtube.com/watch?v=uH-tVP8MUs8",
    type: StepType.YOUTUBE,
  },
];

let dummyStepBody: OutputData = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "header",
      data: {
        text: "This is my awesome editor!!",
        level: 1,
      },
    },
    {
      type: "videoNote",
      data: {
        text: "a dummy video note",
        timestamp: 1234,
      },
    },
  ],
};

export const addStep = async (step: Step) => {
  await delay(2000);
  steps.push(step);
};

export const getSteps = async () => {
  await delay(1000);
  return steps;
};

export const editStepById = async (id: string, stepBody: OutputData) => {
  await delay(500);
  dummyStepBody = stepBody;
  return dummyStepBody;
};

export const getStepBodyById = async (id: string) => {
  await delay(700);
  return dummyStepBody;
};
