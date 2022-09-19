import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
  Text,
  Box,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { FiCheck, FiType, FiYoutube } from "react-icons/fi";
import { useMutation, useQueryClient } from "react-query";
import { addStep } from "./api";
import { StepType } from "./types";

export interface IAddStepModal {
  isAddModalOpen: boolean;
  onAddModalClose: () => void;
  onAddModalOpen: () => void;
}

export const AddStepModal = ({ isAddModalOpen, onAddModalClose, onAddModalOpen }: IAddStepModal) => {
  const [stepInput, setStepInput] = useState<{ name: string; link: string }>({ name: "", link: "" });
  const queryClient = useQueryClient();

  const stepInputOnChange = (key: keyof typeof stepInput, value: string) => setStepInput({ ...stepInput, [key]: value });

  const { mutate: handleAdd, isLoading: isAdding } = useMutation(
    () => addStep({ type: StepType.YOUTUBE, id: nanoid(7), content: stepInput.link, name: stepInput.name }),
    {
      onSuccess() {
        queryClient.invalidateQueries(["steps"]);
        onAddModalClose();
      },
    }
  );

  return (
    <Modal isOpen={isAddModalOpen} onClose={onAddModalClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Step</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} alignItems="flex-start">
            <Box w="full">
              <Text mb={1} color="blackAlpha.700">
                Step Name
              </Text>
              <InputGroup>
                <InputLeftAddon padding="0 12px" borderLeftRadius="full" color="blackAlpha.600" children={<FiType />} />
                <Input
                  colorScheme="messenger"
                  rounded="full"
                  type="text"
                  placeholder="Give it a descriptive name..."
                  onChange={(e) => stepInputOnChange("name", e.target.value)}
                ></Input>
              </InputGroup>
            </Box>
            <Box w="full">
              <Text mb={1} color="blackAlpha.700">
                YouTube Link
              </Text>
              <InputGroup>
                <InputLeftAddon padding="0 12px" borderLeftRadius="full" color="blackAlpha.600" children={<FiYoutube />} />
                <Input
                  colorScheme="messenger"
                  rounded="full"
                  type="text"
                  placeholder="Make sure its a YouTube video link"
                  onChange={(e) => stepInputOnChange("link", e.target.value)}
                ></Input>
              </InputGroup>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter mt={10} mb={2}>
          <Button variant="solid" mr={3} onClick={onAddModalClose} rounded="full" w="100px" fontWeight="normal">
            Close
          </Button>
          <Button
            variant="solid"
            colorScheme="messenger"
            onClick={() => handleAdd()}
            rounded="full"
            w="140px"
            leftIcon={<FiCheck strokeWidth={3} />}
            isLoading={isAdding}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
