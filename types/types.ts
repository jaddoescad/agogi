import Stripe from 'stripe';
import type { Transform } from '@dnd-kit/utilities';
import { UniqueIdentifier } from '@dnd-kit/core';

export interface PageMeta {
  title: string;
  description: string;
  cardImage: string;
}

export interface Customer {
  id: string /* primary key */;
  stripe_customer_id?: string;
}

export type RadioButtonWrapperProps = {
  value: string;
  currentAnswer: string;
  onChange: (newValue: string | number) => void;
  isDisabled: boolean;
  label: string;
};

export type ControlButtonsProps = {
  handlePreviousQuestion: () => void;
  handleNextQuestion: () => void;
  submitted: boolean;
  currentQuestionIndex: number;
  questions: any[]; // You may want to replace 'any' with a more specific type if you know the shape of your questions
  handleReset: () => void;
};

export type QuestionNavigationProps = {
  topicTitle: string;
  topicsOrder: (string | number)[];
  selectedTopic: string | number;
  goToNextTopic: () => void;
  goToPreviousTopic: () => void;
};

export type PreviewQuizProps = {
  quizId?: string;
  topics: any[]; // You might want to define a more specific type here.
  title: string;
  selectedTopic: string ;
  setSelectedTopic: React.Dispatch<SetStateAction<string | null>>;
  questions: Question[]; // You've imported `Question` type, so I'm using it here.
  topicTitle: string;
  topicsOrder: (string)[]; // I'm assuming it's an array of either strings or numbers.
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<SetStateAction<number>>;
  feedback: string | null;
  setFeedback: React.Dispatch<SetStateAction<string | null>>;
  answers: string[];
  setAnswers: React.Dispatch<React.SetStateAction<string[]>>;
  submitted: boolean;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  isQuestionLoading: boolean;
  va?: any
};

export interface Product {
  id: string /* primary key */;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Stripe.Metadata;
}

export interface ProductWithPrice extends Product {
  prices?: Price[];
}

export interface UserDetails {
  id: string /* primary key */;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url?: string;
  billing_address?: Stripe.Address;
  payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
}

export interface Price {
  id: string /* primary key */;
  product_id?: string /* foreign key to products.id */;
  active?: boolean;
  description?: string;
  unit_amount?: number;
  currency?: string;
  type?: Stripe.Price.Type;
  interval?: Stripe.Price.Recurring.Interval;
  interval_count?: number;
  trial_period_days?: number | null;
  metadata?: Stripe.Metadata;
  products?: Product;
}

export interface PriceWithProduct extends Price {}

export interface Subscription {
  id: string /* primary key */;
  user_id: string;
  status?: Stripe.Subscription.Status;
  metadata?: Stripe.Metadata;
  price_id?: string /* foreign key to prices.id */;
  quantity?: number;
  cancel_at_period_end?: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at?: string;
  cancel_at?: string;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  prices?: Price;
}


export type MultipleChoiceQuestion = {
  id : string;
  type: 'multiple-choice';
  question: string;
  choices: string[];
  correctAnswer: number; // The correct answer would be one of the choices.
};

export type Question = MultipleChoiceQuestion;

export interface ShownAnswers {
  [key: number]: boolean;
}

export type Message = {
  message: string;
  type: string;
};

export type RequestData = {
  quizType: string;
  message: string;
  quizId: string;
  topicId: string;
};

export type QuizType = 'true/false' | 'multiple-choice';
import type { Active, CollisionDetection, DraggableSyntheticListeners, DropAnimation, KeyboardCoordinateGetter, MeasuringConfiguration, Modifiers, PointerActivationConstraint } from '@dnd-kit/core';
import { AnimateLayoutChanges, NewIndexGetter, SortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { SetStateAction } from 'react';

export interface ItemProps {
  dragOverlay?: boolean;
  color?: string;
  disabled?: boolean;
  dragging?: boolean;
  handle?: boolean;
  handleProps?: any;
  height?: number;
  index?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  wrapperStyle?: React.CSSProperties;
  title: React.ReactNode;
  quizId: string;
  topicId: UniqueIdentifier;
  selectedTopic: string;
  setSelectedTopic: React.Dispatch<React.SetStateAction<string>>;
  onRemove?(): void;
  renderItem?(args: {
    dragOverlay: boolean;
    dragging: boolean;
    sorting: boolean;
    index: number | undefined;
    fadeIn: boolean;
    listeners: DraggableSyntheticListeners;
    ref: React.Ref<HTMLElement>;
    style: React.CSSProperties | undefined;
    transform: ItemProps['transform'];
    transition: ItemProps['transition'];
    title: ItemProps['title'];
  }): React.ReactElement;
}

export type ItemType = {
  id: UniqueIdentifier;
  title: string;
};


export type ModalDeleteProps = {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  deleteTopic: any; // You may want to further specify this type based on how you've structured your mutations.
  quizId: string;
  topicId: UniqueIdentifier;
};

export type MoreOptionsMenuProps = {
  onOpen: () => void;
  onClose: () => void;
  deleteTopic: () => void;
  onEdit: () => void;
};


export interface SortableProps {
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

export interface SortableItemProps {
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

export type SideBarProps = {
  topicList: any[]; // Replace any with the actual type if you know it
  quizId: string; // Depending on what your quizId is
  topicsOrder: any[]; // Replace any with the actual type if you know it
  selectedTopic: any; // Replace any with the actual type if you know it
  setSelectedTopic: (topic: any) => void; // Replace any with the actual type if you know it
};
