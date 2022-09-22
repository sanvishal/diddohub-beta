import { Box, Button, Center, HStack, Spinner, Stack, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { API, OutputData } from "@editorjs/editorjs";
import { useEffect } from "react";
import { FiCamera, FiCheck, FiFileText, FiYoutube } from "react-icons/fi";
import { GiFairyWand } from "react-icons/gi";
import { useMutation, useQuery } from "react-query";
import { editStepById, getStepBodyById } from "./api";
import { Editor, editorTools, useEditorProxyStore } from "./Editor";
import { useStepsStore } from "./store";
import { YoutubeVideoContainer } from "./YoutubeVideoContainer";
import { AddQuoteBlockModal } from "./AddQuoteBlockModal";

export const EditorView = () => {
  const {
    isOpen: isAddQuoteBlockModalOpen,
    onOpen: onAddQuoteBlockModalOpen,
    onClose: onAddQuoteBlockModalClose,
  } = useDisclosure();
  const selectedStep = useStepsStore((state) => state.selectedStep);
  const videoRef = useEditorProxyStore((state) => state.videoRef);
  const [quoteBlockState, addQuoteBlock] = [
    useEditorProxyStore((state) => state.quoteBlockState),
    useEditorProxyStore((state) => state.addQuoteBlock),
  ];
  const {
    data: stepBody,
    isFetching,
    isRefetching,
    refetch,
  } = useQuery(["stepBody", selectedStep?.id, "editor"], () => getStepBodyById(selectedStep?.id || ""), {
    refetchOnWindowFocus: false,
    enabled: false,
    refetchOnMount: true,
  });

  const { mutate: saveStepBody, isLoading: isSaving } = useMutation((content: OutputData) =>
    editStepById(selectedStep?.id || "", content)
  );

  useEffect(() => {
    if (selectedStep) {
      refetch();
    }
  }, [selectedStep]);

  const handleOnChange = async (api: API) => {
    const content = await api.saver.save();
    const cleanedBlocks: OutputData["blocks"] = [];
    content.blocks?.forEach((block) => {
      if (block.type === "quote") {
        if (block.data?.text?.trim()?.length !== 0) {
          cleanedBlocks.push(block);
        }
      } else {
        cleanedBlocks.push(block);
      }
    });
    const cleanedContent = { ...content };
    cleanedContent.blocks = cleanedBlocks;
    saveStepBody(cleanedContent);
  };

  useEffect(() => {
    if (quoteBlockState.isOpen) {
      onAddQuoteBlockModalOpen();
    }
  }, [quoteBlockState.isOpen]);

  const handleAddQuoteModalClose = () => {
    onAddQuoteBlockModalClose();
    addQuoteBlock({ isOpen: false, id: "" });
  };

  return selectedStep ? (
    <Stack
      w="full"
      alignItems="flex-start"
      pt="30px"
      px={4}
      spacing={0}
      direction={{ base: "column", md: "row" }}
      key={selectedStep.id}
      pos="relative"
    >
      <Box w={{ base: "100%", md: "50%" }} pos="relative">
        <YoutubeVideoContainer url={selectedStep.content} />
        <AddQuoteBlockModal
          isAddQuoteBlockModalOpen={isAddQuoteBlockModalOpen}
          onAddQuoteBlockModalClose={handleAddQuoteModalClose}
          onAddQuoteBlockModalOpen={onAddQuoteBlockModalOpen}
          quoteBlockState={quoteBlockState}
        />
        <Button size="sm" mt={2} leftIcon={<FiFileText />} onClick={onAddQuoteBlockModalOpen}>
          Show Transcripts
        </Button>
        <Button size="sm" mt={2} ml={2} leftIcon={<GiFairyWand />}>
          AI Summarization
        </Button>
        <VStack alignItems="flex-start" spacing={0} mt={3}>
          <Text fontSize="2xl" fontWeight="bold">
            {videoRef?.target?.videoTitle || "-"}
          </Text>
          <HStack fontSize="md" color="blackAlpha.600">
            <FiYoutube />
            <Text as="a" href={videoRef?.target?.playerInfo?.videoUrl || "-"}>
              {videoRef?.target?.getVideoData()?.author || "-"}
            </Text>
          </HStack>
        </VStack>
      </Box>
      <Box
        w={{ base: "100%", md: "calc(50% - 30px)" }}
        h={{ base: "auto", md: "calc(100vh - (40px + 16px + 12px + 12px + 70px + 30px + 20px))" }}
        overflow="auto"
      >
        {isFetching || isRefetching ? (
          <Center>
            <Spinner mt={10} />
          </Center>
        ) : (
          <>
            <Editor tools={editorTools} readOnly={false} initialData={stepBody || undefined} onChange={handleOnChange} />
            <Box pos="absolute" top="16px" left="calc(50% + 60px)" p={1} opacity="0.7">
              <HStack>
                {isSaving ? (
                  <Spinner
                    sx={{
                      "--spinner-size": "0.8rem",
                    }}
                  />
                ) : (
                  <Center bg="green.300" rounded="full" w="16px" h="16px" p={0.5}>
                    <FiCheck color="white" strokeWidth={2} />
                  </Center>
                )}
                <Text fontSize="sm">{isSaving ? "Saving..." : "Saved"}</Text>
              </HStack>
            </Box>
          </>
        )}
      </Box>
    </Stack>
  ) : (
    <Center mt={20} h="200px">
      <Text fontSize="4xl" color="blackAlpha.400">
        Select or Add a step from right pane
      </Text>
    </Center>
  );
};
