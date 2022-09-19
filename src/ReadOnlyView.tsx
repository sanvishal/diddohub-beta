import { Box, Center, Spinner, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { getStepBodyById } from "./api";
import { Editor, editorTools } from "./Editor";
import { useStepsStore } from "./store";
import { VideoContainer } from "./VideoContainer";

export const ReadOnlyView = () => {
  const selectedStep = useStepsStore((state) => state.selectedStep);
  const {
    data: stepBody,
    isFetching,
    isRefetching,
    refetch,
  } = useQuery(["stepBody", selectedStep?.id, "readOnly"], () => getStepBodyById(selectedStep?.id || ""), {
    refetchOnWindowFocus: false,
    enabled: Boolean(selectedStep),
    refetchOnMount: true,
  });

  useEffect(() => {
    if (selectedStep) {
      refetch();
    }
  }, [selectedStep]);

  return selectedStep ? (
    <Stack
      w="full"
      alignItems="flex-start"
      pt="30px"
      px={4}
      spacing={0}
      direction={{ base: "column", md: "row" }}
      key={selectedStep.id}
    >
      <Box w={{ base: "100%", md: "50%" }}>
        <VideoContainer url={selectedStep.content} />
      </Box>
      <Box
        w={{ base: "100%", md: "50%" }}
        h={{ base: "auto", md: "calc(100vh - (40px + 16px + 12px + 12px + 70px + 30px + 20px))" }}
        overflow="auto"
      >
        {isFetching || isRefetching ? (
          <Center>
            <Spinner mt={10} />
          </Center>
        ) : (
          <Editor tools={editorTools} readOnly initialData={stepBody || undefined} />
        )}
      </Box>
    </Stack>
  ) : (
    <Center mt={20} h="200px">
      <Text fontSize="4xl" color="blackAlpha.400">
        Select step from right pane
      </Text>
    </Center>
  );
};
