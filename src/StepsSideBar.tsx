import { Box, Button, Center, HStack, Spinner, Text, useDisclosure, useOutsideClick, VStack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight, FiPlus, FiYoutube } from "react-icons/fi";
import { useQuery } from "react-query";
import { AddStepModal } from "./AddStepModal";
import { getSteps } from "./api";
import { useStepsStore } from "./store";
import { Step } from "./types";

const StepItem = ({ step }: { step: Step }) => {
  const selectedStep = useStepsStore((state) => state.selectedStep);
  const setSelectedStep = useStepsStore((state) => state.setSelectedStep);

  return (
    <Box
      bg={selectedStep?.id === step.id ? "blackAlpha.100" : "transparent"}
      border="1px solid"
      borderColor={selectedStep?.id === step.id ? "blackAlpha.200" : "transparent"}
      _hover={{ bg: selectedStep?.id === step.id ? "blackAlpha.100" : "blackAlpha.50" }}
      transition="background 0.12s ease-in-out"
      minH="60px"
      maxH="60px"
      borderRadius={4}
      px={2}
      py={1}
      w="full"
      mt={2}
      cursor="pointer"
      onClick={() => setSelectedStep(step)}
    >
      <HStack alignItems="flex-start" spacing={2}>
        <Center w={8} h={8} bg="red.100" borderRadius="full" mt={1}>
          <FiYoutube color="red" />
        </Center>
        <VStack alignItems="flex-start" spacing={0}>
          <Text fontSize="lg">{step.name}</Text>
          <Text fontSize="sm" color="blackAlpha.700">
            12:24
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export const StepsSideBar = () => {
  const ref = useRef<any>();
  const setSelectedStep = useStepsStore((state) => state.setSelectedStep);
  const sidebarWidth = 400;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isOpen: isAddModalOpen, onClose: onAddModalClose, onOpen: onAddModalOpen } = useDisclosure();

  useOutsideClick({
    ref: ref,
    enabled: !isAddModalOpen,
    handler: onClose,
  });

  const { data: steps, isLoading } = useQuery(["steps"], () => getSteps(), {
    refetchOnWindowFocus: false,
    onSuccess(steps) {
      if (steps && steps.length) {
        setSelectedStep(steps[0]);
      }
    },
  });

  return (
    <>
      <Box pos="absolute" right={0}>
        <HStack spacing={2} cursor="pointer" role="group" onClick={onOpen} opacity={isOpen ? 0 : 1}>
          <Text color="blackAlpha.600">Show Steps</Text>
          <Center
            bg="accent"
            p={2}
            borderLeftRadius={3}
            transition="padding 0.2s ease-in-out"
            _groupHover={{
              paddingRight: "16px",
            }}
          >
            <FiChevronLeft color="white" strokeWidth={4} />
          </Center>
        </HStack>
      </Box>
      <Box
        pos="absolute"
        right={0}
        zIndex={1300}
        ref={ref}
        transform={`translateX(${isOpen ? "0px" : sidebarWidth + 8 + "px"})`}
        transition="transform 0.2s ease-in-out"
      >
        <Box
          h="calc(100vh - (40px + 16px + 12px + 8px))"
          w={`${sidebarWidth}px`}
          mr={1}
          bg="gray.50"
          boxShadow="md"
          borderRadius={6}
          border="1px solid"
          borderColor="blackAlpha.400"
          pos="relative"
        >
          <Center
            bg="accent"
            pos="absolute"
            cursor="pointer"
            p={2}
            borderRadius={3}
            left="-36px"
            onClick={onClose}
            display={!isOpen ? "none" : "block"}
          >
            <FiChevronRight color="white" strokeWidth={4} />
          </Center>
          <VStack h="100%" w="100%" alignItems="flex-start">
            <Box p={3} flexGrow={1} w="full">
              <VStack spacing={0} alignItems="flex-start">
                <Text fontWeight="bold" fontSize="xl">
                  Javascript - confusing concepts
                </Text>
                <Text color="blackAlpha.500" fontSize="md">
                  @vishaltk • 10 steps
                </Text>
              </VStack>
              <Box mt={3} w="full">
                <Center w="full">
                  {isLoading && !steps && <Spinner colorScheme="messenger" mt={20} opacity="0.5" />}
                  {!isLoading && steps && steps?.length === 0 && (
                    <Text mt={10} opacity="0.5" textAlign="center">
                      No steps!
                    </Text>
                  )}
                </Center>
                <VStack w="full" alignItems="flex-start">
                  {!isLoading &&
                    steps &&
                    steps?.length &&
                    steps.map((step) => {
                      return <StepItem key={step.id} step={step} />;
                    })}
                </VStack>
              </Box>
            </Box>
            <Box p={3} w="full">
              <Button
                colorScheme="messenger"
                rounded="full"
                size="lg"
                w="full"
                leftIcon={<FiPlus strokeWidth={3} />}
                pos="relative"
                onClick={onAddModalOpen}
              >
                Add Step
                <HStack ml={2} fontWeight="normal" fontSize="xs" opacity={0.7} pos="absolute" right="15px">
                  <Center as="span" bg="whiteAlpha.300" w={5} h={5} fontWeight="bold" borderRadius={4}>
                    ⌘
                  </Center>
                  <Center as="span" bg="whiteAlpha.300" w={5} h={5} fontWeight="bold" borderRadius={4}>
                    ⇧
                  </Center>
                  <Center as="span" bg="whiteAlpha.300" w={5} h={5} fontWeight="bold" borderRadius={4}>
                    S
                  </Center>
                </HStack>
              </Button>
            </Box>
          </VStack>
        </Box>
        <AddStepModal isAddModalOpen={isAddModalOpen} onAddModalClose={onAddModalClose} onAddModalOpen={onAddModalOpen} />
      </Box>
    </>
  );
};
