import { Text, VStack } from "@chakra-ui/react";
import { StepsSideBar } from "./StepsSideBar";
import { useStepsStore } from "./store";

export const StepDetails = () => {
  const selectedStep = useStepsStore((state) => state.selectedStep);

  return (
    <VStack alignItems="flex-start" px={4} my={3} spacing={0} pos="relative">
      <Text fontSize="3xl" fontWeight="bold">
        {selectedStep?.name || "..."}
      </Text>
      <Text color="blackAlpha.600" fontSize="md">
        @vishaltk
      </Text>
      <StepsSideBar />
    </VStack>
  );
};
