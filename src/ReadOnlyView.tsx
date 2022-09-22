import { Box, Button, Center, HStack, Spinner, Stack, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { FiFileText, FiYoutube } from "react-icons/fi";
import { GiFairyWand } from "react-icons/gi";
import { useQuery } from "react-query";
import { AddQuoteBlockModal } from "./AddQuoteBlockModal";
import { getStepBodyById } from "./api";
import { Editor, editorTools, useEditorProxyStore } from "./Editor";
import { useStepsStore } from "./store";
import { formatSecondsTimestamp } from "./utils";
import { YoutubeVideoContainer } from "./YoutubeVideoContainer";

export const ReadOnlyView = () => {
  const selectedStep = useStepsStore((state) => state.selectedStep);
  const videoRef = useEditorProxyStore((state) => state.videoRef);
  const {
    isOpen: isAddQuoteBlockModalOpen,
    onOpen: onAddQuoteBlockModalOpen,
    onClose: onAddQuoteBlockModalClose,
  } = useDisclosure();
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
        <YoutubeVideoContainer url={selectedStep.content} />
        <AddQuoteBlockModal
          isAddQuoteBlockModalOpen={isAddQuoteBlockModalOpen}
          onAddQuoteBlockModalClose={onAddQuoteBlockModalClose}
          onAddQuoteBlockModalOpen={onAddQuoteBlockModalOpen}
          quoteBlockState={{ id: "", isOpen: false }}
        />
        <Button size="sm" mt={2} leftIcon={<FiFileText />} onClick={onAddQuoteBlockModalOpen}>
          Show Transcripts
        </Button>
        <VStack alignItems="flex-start" spacing={0} mt={3}>
          <Text fontSize="2xl" fontWeight="bold">
            {videoRef?.target?.videoTitle || "-"}
          </Text>
          <HStack fontSize="md" color="blackAlpha.600">
            <FiYoutube />
            <Text as="a" href={videoRef?.target?.playerInfo?.videoUrl || ""} target="_blank">
              {videoRef?.target?.getDuration() ? formatSecondsTimestamp(videoRef?.target?.getDuration() || 0) : "-"}
            </Text>
          </HStack>
        </VStack>
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
