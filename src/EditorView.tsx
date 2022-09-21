import { Box, Button, Center, HStack, Spinner, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { API, OutputData } from "@editorjs/editorjs";
import { useEffect } from "react";
import { FiCamera, FiCheck } from "react-icons/fi";
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
    saveStepBody(content);
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
        {/* <Button size="sm" mb={2} leftIcon={<FiCamera />} onClick={handleImgDialogOpen}>
          Copy text from video
        </Button> */}
        <YoutubeVideoContainer url={selectedStep.content} />
        <AddQuoteBlockModal
          isAddQuoteBlockModalOpen={isAddQuoteBlockModalOpen}
          onAddQuoteBlockModalClose={handleAddQuoteModalClose}
          onAddQuoteBlockModalOpen={onAddQuoteBlockModalOpen}
          quoteBlockState={quoteBlockState}
        />
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
