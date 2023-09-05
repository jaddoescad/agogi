import { ItemType } from 'types/types';
import {  } from 'utils/supabase-client';

type ReorderFunction = (items: ItemType[], fromIndex: number, toIndex: number, quizId: string) => ItemType[];

export const handleReorder: ReorderFunction = (items, fromIndex, toIndex, quizId) => {
    const reorderedItems = items.slice();
    const [moved] = reorderedItems.splice(fromIndex, 1);
    reorderedItems.splice(toIndex, 0, moved);
  
    const updatedOrder = reorderedItems.map((item) => item.id.toString());
    updateTopicOrder(quizId, updatedOrder)
      .then(() => {
        console.log('Updated order in database successfully!');
      })
      .catch((error) => {
        console.error('Failed to update order:', error);
      });
  
    return reorderedItems;
};
