import React, { useEffect } from 'react';
import classNames from 'classnames';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton
} from '@chakra-ui/react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';

import { Handle } from './components';

import styles from './Item.module.css';
import { Box } from '@chakra-ui/react';
import { useDeleteTopicMutation } from 'hooks/useDeleteTopic';
import { useEditTopicTitle } from 'hooks/useEditTopic';
import { ItemProps } from 'types/types';
import { updateSelectedTopic } from 'utils/supabase-client';
import { useRouter } from 'next/router';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react';
import {MoreOptionsMenuProps, ModalDeleteProps} from 'types/types';

// } = async (quizId: string, topicId: string)
export const Item = React.memo(
  React.forwardRef<HTMLDivElement, ItemProps>(
    (
      {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        handleProps,
        height,
        index,
        listeners,
        onRemove,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        title,
        wrapperStyle,
        quizId,
        topicId,
        selectedTopic,
        setSelectedTopic,
        ...props
      },
      ref
    ) => {
      const [isEditing, setIsEditing] = React.useState(false);
      const [inputValue, setInputValue] = React.useState(
        typeof title === 'string' ? title : ''
      );
      const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

      const router = useRouter();

      const handleEdit = () => {
        setIsEditing((prev) => !prev);
      };

      useEffect(() => {
        if (typeof title === 'string') {
          setInputValue(title);
        }
      }, [title]);

      const handleSave = () => {
        editTopicTitle(
          { topicId: topicId.toString(), title: inputValue, quizId },
          {
            onSuccess: () => {
              setIsEditing(false);
            },
            onError: (error) => {
              // Handle the error, maybe by showing an error message to the user
              console.error('Failed to edit topic title:', error);
            }
          }
        );
      };

      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);
      const [isMenuOpen, setIsMenuOpen] = React.useState(false);
      const deleteTopic = useDeleteTopicMutation();
      const { mutate: editTopicTitle } = useEditTopicTitle();

      return renderItem ? (
        renderItem({
          dragOverlay: Boolean(dragOverlay),
          dragging: Boolean(dragging),
          sorting: Boolean(sorting),
          index,
          fadeIn: Boolean(fadeIn),
          listeners,
          ref,
          style,
          transform,
          transition,
          title
        })
      ) : (
        <Box
          display={'flex'}
          boxSizing="border-box"
          className={classNames(
            !isMenuOpen && styles.Wrapper,
            fadeIn && styles.fadeIn,
            sorting && styles.sorting,
            dragOverlay && styles.dragOverlay
          )}
          style={
            {
              ...wrapperStyle,
              transition: [transition, wrapperStyle?.transition]
                .filter(Boolean)
                .join(', '),
              '--translate-x': transform
                ? `${Math.round(transform.x)}px`
                : undefined,
              '--translate-y': transform
                ? `${Math.round(transform.y)}px`
                : undefined,
              '--scale-x': transform?.scaleX
                ? `${transform.scaleX}`
                : undefined,
              '--scale-y': transform?.scaleY
                ? `${transform.scaleY}`
                : undefined,
              '--index': index,
              '--color': color
            } as React.CSSProperties
          }
          ref={ref}
        >
          <ModalDelete
            isDeleteModalOpen={isDeleteModalOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            deleteTopic={deleteTopic}
            quizId={quizId}
            topicId={topicId}
          />
          <Box
            bg={selectedTopic === topicId ? 'teal' : 'transparent'}
            color="white"
            position="relative"
            display="flex"
            flexGrow={1}
            alignItems="center"
            w="100%"
            padding="3px 5px"
            boxShadow="0 0 0 1px rgba(63, 63, 68, 0.05)"
            outline="none"
            borderRadius="4px"
            boxSizing="border-box"
            listStyleType="none"
            transformOrigin="50% 50%"
            fontWeight="400"
            fontSize="1rem"
            overflowWrap="break-word"
            rounded={'lg'}
            onClick={() => {
              updateSelectedTopic(quizId, topicId.toString());
              setSelectedTopic(topicId.toString());
            }}
            // transition="box-shadow 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)"
            style={{
              boxShadow: '0 0 0 1px rgba(63, 63, 68, 0.05)',
              transition:
                'box-shadow 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22) !important'
            }}
            className={classNames(
              styles.Item,
              dragging && styles.dragging,
              dragOverlay && styles.dragOverlay
            )}
            // style={style}
            data-cypress="draggable-item"
            {...(!handle ? listeners : undefined)}
            {...props}
            tabIndex={!handle ? 0 : undefined}
          >
            <Box>
              {handle ? <Handle {...handleProps} {...listeners} /> : null}
            </Box>
            <Box flex={1}>
              {isEditing ? (
                <input
                  value={inputValue} // This should be the value attribute
                  onChange={(e) => setInputValue(e.target.value)} // Use e.target.value here
                  onBlur={handleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSave();
                    }
                  }}
                  style={{
                    // Add styling to make the input look like the original text.
                    border: 'none',
                    backgroundColor: 'transparent'
                    // Add more styles or remove based on the original text's appearance.
                  }}
                  autoFocus // Automatically focus the input when it appears.
                />
              ) : (
                `${title}`
              )}
            </Box>

            <MoreOptionsMenu
              onOpen={() => setIsMenuOpen(true)}
              onClose={() => setIsMenuOpen(false)}
              onEdit={handleEdit}
              deleteTopic={() => {
                setIsDeleteModalOpen(true);
              }}
            />
          </Box>
        </Box>
      );
    }
  )
);



const MoreOptionsMenu: React.FC<MoreOptionsMenuProps> = ({
  onOpen,
  onClose,
  deleteTopic,
  onEdit
}) => {
  return (
    <Menu onOpen={onOpen} onClose={onClose}>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<BiDotsHorizontalRounded />}
        size="sm"
        variant="ghost"
        color={'white'}
        _hover={{ bg: 'gray.700' }}
        _focus={{ bg: 'gray.700' }}
        _active={{ bg: 'gray.700' }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
      <MenuList background={'gray.900'}>
        <MenuItem
          background={'gray.900'}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          background={'gray.900'}
          onClick={(e) => {
            e.stopPropagation();
            deleteTopic();
          }}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};




const ModalDelete: React.FC<ModalDeleteProps> = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  deleteTopic,
  quizId,
  topicId
}) => {
  return (
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure you want to delete this topic?</ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={() => {
              deleteTopic.mutate(
                { quizId, topicId: topicId.toString() },
                {
                  onError: (error: any) => {
                    alert(error.message);
                  }
                }
              );
              setIsDeleteModalOpen(false); // Close modal after deletion
            }}
          >
            Delete
          </Button>
          <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
