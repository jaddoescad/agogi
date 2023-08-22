import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Spinner
} from '@chakra-ui/react';
import { VscTrash } from 'react-icons/vsc';

interface DeleteConfirmationModalProps {
  questionId: string;
  onDelete: (id: string) => Promise<void>;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  questionId,
  onDelete
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    onClose();
    setIsLoading(true); // Start loading
    await onDelete(questionId);
    setIsLoading(false); // End loading
  };

  return (
    <>
      <IconButton
        variant="ghost"
        onClick={onOpen}
        aria-label='Delete Question'
        icon={isLoading ? <Spinner /> : <VscTrash />}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this question?</ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteConfirmationModal;
