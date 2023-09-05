import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  Active,
  Announcements,
  closestCenter,
  CollisionDetection,
  DragOverlay,
  DndContext,
  DropAnimation,
  KeyboardSensor,
  KeyboardCoordinateGetter,
  Modifiers,
  MouseSensor,
  MeasuringConfiguration,
  PointerActivationConstraint,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
  arrayMove,
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  SortingStrategy,
  rectSortingStrategy,
  AnimateLayoutChanges,
  NewIndexGetter
} from '@dnd-kit/sortable';

import { Item } from './components';
import { useCreateTopicMutation } from 'hooks/useCreateTopic';
import { Box, Button } from '@chakra-ui/react';
import { updateTopicOrder } from 'utils/supabase-client';
import { ItemType } from 'types/types';

export interface Props {
  activationConstraint?: PointerActivationConstraint;
  animateLayoutChanges?: AnimateLayoutChanges;
  adjustScale?: boolean;
  collisionDetection?: CollisionDetection;
  coordinateGetter?: KeyboardCoordinateGetter;
  Container?: any; // To-do: Fix me
  dropAnimation?: DropAnimation | null;
  getNewIndex?: NewIndexGetter;
  handle?: boolean;
  quizId: string;
  itemCount?: number;
  topics?: { id: UniqueIdentifier; title: string }[];
  measuring?: MeasuringConfiguration;
  modifiers?: Modifiers;
  renderItem?: any;
  removable?: boolean;
  reorderItems?: typeof arrayMove;
  strategy?: SortingStrategy;
  style?: React.CSSProperties;
  useDragOverlay?: boolean;
  topicsOrder?: string[];
  selectedTopic: string;
  setSelectedTopic: React.Dispatch<React.SetStateAction<string>>;
  getItemStyles?(args: {
    id: UniqueIdentifier;
    index: number;
    isSorting: boolean;
    isDragOverlay: boolean;
    overIndex: number;
    isDragging: boolean;
  }): React.CSSProperties;
  wrapperStyle?(args: {
    active: Pick<Active, 'id'> | null;
    index: number;
    isDragging: boolean;
    id: UniqueIdentifier;
  }): React.CSSProperties;
  isDisabled?(id: UniqueIdentifier): boolean;
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5'
      }
    }
  })
};

export function Sortable({
  activationConstraint,
  animateLayoutChanges,
  adjustScale = false,
  collisionDetection = closestCenter,
  coordinateGetter = sortableKeyboardCoordinates,
  dropAnimation = dropAnimationConfig,
  getItemStyles = () => ({}),
  getNewIndex,
  handle = false,
  quizId,
  topics,
  topicsOrder,
  selectedTopic,
  isDisabled = () => false,
  measuring,
  modifiers,
  removable,
  renderItem,
  setSelectedTopic,
  reorderItems = arrayMove,
  strategy = rectSortingStrategy,
  style,
  useDragOverlay = true,
  wrapperStyle = () => ({})
}: Props) {
  const [items, setItems] = useState<ItemType[]>([]);

  const handleReorder = (fromIndex: number, toIndex: number) => {
    setItems((items) => {
      const reorderedItems = reorderItems(items, fromIndex, toIndex);
      const updatedOrder = reorderedItems.map((item) => item.id.toString());
      updateTopicOrder(quizId, updatedOrder)
        .then(() => {
          console.log('Updated order in database successfully!');
        })
        .catch((error) => {
          console.error('Failed to update order:', error);
        });

      return reorderedItems;
    });
  };

  useEffect(() => {
    if (!topics || !topicsOrder) return;
    setItems(
      topicsOrder
        .map((order) => topics.find((topic) => topic.id === order)!)
        .filter(Boolean)
    );
  }, [topics, topicsOrder]);

  const createTopic = useCreateTopicMutation();

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint
    }),
    useSensor(TouchSensor, {
      activationConstraint
    }),
    useSensor(KeyboardSensor, {
      // Disable smooth scrolling in Cypress automated tests
      // scrollBehavior: 'Cypress' in window ? 'auto' : undefined,
      //next js check window
      scrollBehavior:
        typeof window !== 'undefined' && 'Cypress' in window
          ? 'auto'
          : undefined,
      coordinateGetter
    })
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This code will only run after the component is mounted on the client side.
    setIsMounted(true);
  }, []);

  const isFirstAnnouncement = useRef(true);
  const getIndex = (id: UniqueIdentifier) =>
    items.findIndex((topic) => topic.id === id);
  const getPosition = (id: UniqueIdentifier) => getIndex(id) + 1;
  const activeIndex = activeId ? getIndex(activeId) : -1;
  const handleRemove = removable
    ? (id: UniqueIdentifier) =>
        setItems((prevItems) => prevItems.filter((topic) => topic.id !== id))
    : undefined;


  const handleAddTopic = () => {
    createTopic.mutate(
      { quizId: quizId },
      {
        onSuccess: (data) => {
          setItems((prevItems) => [...prevItems, data]);
        }
      }
    );
  };
  useEffect(() => {
    if (!activeId) {
      isFirstAnnouncement.current = true;
    }
  }, [activeId]);

  useEffect(() => {
    console.log("sh",selectedTopic)
  }, [selectedTopic])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={({ active }) => {
        if (!active) {
          return;
        }

        setActiveId(active.id);
      }}
      onDragEnd={({ over }) => {
        setActiveId(null);

        if (over) {
          const overIndex = getIndex(over.id);
          if (activeIndex !== overIndex) {
            handleReorder(activeIndex, overIndex);
          }
        }
      }}
      onDragCancel={() => setActiveId(null)}
      measuring={measuring}
      modifiers={modifiers}
    >
      <Box
        display="flex"
        width="100%"
        boxSizing="border-box"
        justifyContent={'center'}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={strategy}
        >
          <Box
            w={'100%'}
            p={4}
            display={'flex'}
            flexDirection={'column'}
            gap={4}
          >
            {items.map((item, index) => (
              <SortableItem
                key={item.id}
                id={item.id}
                quizId={quizId}
                selectedTopic={selectedTopic}
                title={item.title}
                handle={handle}
                index={index}
                style={getItemStyles}
                wrapperStyle={wrapperStyle}
                setSelectedTopic={setSelectedTopic}
                disabled={isDisabled(item.id)}
                renderItem={renderItem}
                onRemove={handleRemove}
                animateLayoutChanges={animateLayoutChanges}
                useDragOverlay={useDragOverlay}
                getNewIndex={getNewIndex}
              />
            ))}
            <Button background={'transparent'} color='white' onClick={handleAddTopic}>+ Add Topic</Button>
            {/* Here's the new button */}
          </Box>
        </SortableContext>
      </Box>
      {isMounted && useDragOverlay
        ? createPortal(
            <DragOverlay
              adjustScale={adjustScale}
              dropAnimation={dropAnimation}
            >
              {activeId ? (
                <Item
                  title={items[activeIndex].title}
                  handle={handle}
                  renderItem={renderItem}
                  setSelectedTopic={setSelectedTopic}
                  wrapperStyle={wrapperStyle({
                    active: { id: activeId },
                    index: activeIndex,
                    isDragging: true,
                    id: items[activeIndex].id
                  })}
                  quizId={quizId}
                  selectedTopic={selectedTopic}
                  topicId={items[activeIndex].id}
                  style={getItemStyles({
                    id: items[activeIndex].id,
                    index: activeIndex,
                    isSorting: activeId !== null,
                    isDragging: true,
                    overIndex: -1,
                    isDragOverlay: true
                  })}
                  dragOverlay
                />
              ) : null}
            </DragOverlay>,
            document.body
          )
        : null}
    </DndContext>
  );
}

interface SortableItemProps {
  animateLayoutChanges?: AnimateLayoutChanges;
  disabled?: boolean;
  getNewIndex?: NewIndexGetter;
  id: UniqueIdentifier;
  title: string;
  index: number;
  handle: boolean;
  useDragOverlay?: boolean;
  quizId: string;
  setSelectedTopic: React.Dispatch<React.SetStateAction<string>>;
  selectedTopic: string;
  onRemove?(id: UniqueIdentifier): void;
  style(values: any): React.CSSProperties;
  renderItem?(args: any): React.ReactElement;
  wrapperStyle?(args: {
    active: Pick<Active, 'id'> | null;
    index: number;
    isDragging: boolean;
    id: UniqueIdentifier;
  }): React.CSSProperties;
}

export function SortableItem({
  disabled,
  animateLayoutChanges,
  getNewIndex,
  handle,
  id,
  index,
  onRemove,
  style,
  renderItem,
  useDragOverlay,
  wrapperStyle,
  title,
  quizId,
  setSelectedTopic,
  selectedTopic
}: SortableItemProps) {
  const {
    active,
    attributes,
    isDragging,
    isSorting,
    listeners,
    overIndex,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition
  } = useSortable({
    id,
    animateLayoutChanges,
    disabled,
    getNewIndex
  });

  return (
    <Item
      ref={setNodeRef}
      title={title}
      disabled={disabled}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      quizId={quizId}
      selectedTopic={selectedTopic}
      setSelectedTopic={setSelectedTopic}
      topicId={id}
      handleProps={
        handle
          ? {
              ref: setActivatorNodeRef
            }
          : undefined
      }
      renderItem={renderItem}
      index={index}
      style={style({
        index,
        id,
        isDragging,
        isSorting,
        overIndex
      })}
      onRemove={onRemove ? () => onRemove(id) : undefined}
      transform={transform}
      transition={transition}
      wrapperStyle={wrapperStyle?.({ index, isDragging, active, id })}
      listeners={listeners}
      data-index={index}
      data-id={id}
      dragOverlay={!useDragOverlay && isDragging}
      {...attributes}
    />
  );
}
