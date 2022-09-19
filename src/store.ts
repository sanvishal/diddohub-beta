import create from "zustand";
import { Step } from "./types";

interface IStepsStore {
  selectedStep: Step | null;
  setSelectedStep: (step: Step) => void;
}

export const useStepsStore = create<IStepsStore>((set) => ({
  selectedStep: null,
  setSelectedStep: (step: Step) => set((state) => ({ selectedStep: step })),
}));
