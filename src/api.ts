import { OutputData } from "@editorjs/editorjs";
import { Step, StepType } from "./types";
import { delay } from "./utils";

const steps: Step[] = [
  { id: "some", name: "JS Closures", content: "https://www.youtube.com/watch?v=vE3LOHU0OV8", type: StepType.YOUTUBE },
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
    // {
    //   type: "videoNote",
    //   data: {
    //     text: "a dummy video note",
    //     timestamp: 1234,
    //   },
    // },
  ],
};

const dummyTranscript = [
  { text: "Turborepo in 2 minutes twenty.", timestamp: 33 },
  { text: "Let's go.", timestamp: 2300 },
  { text: "Turborepo understands your monorepo.", timestamp: 3566 },
  {
    text: "It understands that packages/shared\nneeds to be built",
    timestamp: 6033,
  },
  {
    text: "before\napps/web and apps/docs can be built.",
    timestamp: 9233,
  },
  {
    text: "And if you were to run\nthis kind of using a normal task runner,",
    timestamp: 12500,
  },
  { text: "it would look like this.", timestamp: 15633 },
  { text: "You would run all the lint tasks first,", timestamp: 16733 },
  {
    text: "then all of the build task first,\nthen all of the tests afterwards.",
    timestamp: 18533,
  },
  { text: "Kind of.", timestamp: 21633 },
  {
    text: "There's no way to schedule\nthis better here.",
    timestamp: 22166,
  },
  {
    text: "But with Turborepo,\nit automatically schedules it",
    timestamp: 24733,
  },
  {
    text: "for maximum parallelization\nand maximum concurrency.",
    timestamp: 27800,
  },
  {
    text: "So you end up with like all the lint\nand tests running together",
    timestamp: 31233,
  },
  {
    text: "with the first build and the second build\nruns immediately afterwards.",
    timestamp: 34433,
  },
  {
    text: "Turborepo\nalso never does the same work twice.",
    timestamp: 38100,
  },
  {
    text: "So if you run a build\nand it looks at all of the inputs",
    timestamp: 41833,
  },
  { text: "to that build, you know, the source", timestamp: 45633 },
  {
    text: "files, the environment variables\nand it makes a hash out of them.",
    timestamp: 46966,
  },
  {
    text: "If it doesn't find that in its cache,\nthen what it can do",
    timestamp: 51133,
  },
  {
    text: "is it just runs the build\nand then stores it in its cache for later.",
    timestamp: 54666,
  },
  { text: "That means the next time", timestamp: 58200 },
  {
    text: "that you run that build on the same source\n" + "files, the same environment variables.",
    timestamp: 59300,
  },
  { text: "It just doesn't do the build.", timestamp: 63500 },
  {
    text: "It restores what it had from the cache,\nmeaning you get these crazy",
    timestamp: 64800,
  },
  {
    text: "like 80 millisecond build times on stuff\nyou've already built before.",
    timestamp: 68766,
  },
  {
    text: "This cache is pretty cool when it's local.",
    timestamp: 72966,
  },
  { text: "You know what?", timestamp: 75066 },
  {
    text: "It's just local to your machine\nbecause it means your test,",
    timestamp: 75366,
  },
  {
    text: "your linting will run faster\nbut it's really good in multiplayer mode.",
    timestamp: 77433,
  },
  {
    text: "So imagine this one is you,\nthis one is your colleague,",
    timestamp: 81433,
  },
  {
    text: "and this one is your,\nyour CI, for instance on Vercel.",
    timestamp: 83533,
  },
  { text: "Here, they're all running kind of.", timestamp: 87233 },
  { text: "They've all got to run the same build.", timestamp: 89066 },
  {
    text: "But what if they shared\nthe same remote cache?",
    timestamp: 90533,
  },
  {
    text: "Well,\nwhat this does is Turborepo allows you",
    timestamp: 93766,
  },
  {
    text: "to build a remote cache, ships\nby default on Vercel.",
    timestamp: 96533,
  },
  {
    text: "And so you can run the build\nfor your first time on your machine.",
    timestamp: 100133,
  },
  {
    text: "Then it will get picked up\nby the colleague.",
    timestamp: 102866,
  },
  {
    text: "They'll get the 80 millisecond build time\n" + "and then you'll see I will too.",
    timestamp: 104500,
  },
  { text: "So this is what Turborepo does.", timestamp: 108566 },
  {
    text: "It speeds up your tasks with concurrency\n" + "and makes sure you never need to do the",
    timestamp: 110166,
  },
  { text: "same work twice.", timestamp: 113966 },
];

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

export const getTranscripts = async (id: string) => {
  await delay(700);
  return dummyTranscript;
};
