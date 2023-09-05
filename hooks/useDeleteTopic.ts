import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTopic, editTopicTitle } from '@/utils/supabase-client';

export function useDeleteTopicMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    async (params: { topicId: string; quizId: string }) => {
      return deleteTopic(params.topicId).then((result) => {
        return result;
      });
    },
    {
      onSuccess: (data, variables) => {
        queryClient.refetchQueries(['creator_quiz', variables.quizId]);
        return data;
      },
      onError: (error, variables) => {
        return error;
      }
    }
  );
}
