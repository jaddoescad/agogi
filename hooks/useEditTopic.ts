import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTopic, editTopicTitle } from '@/utils/supabase-client';

export function useEditTopicTitle() {
  const queryClient = useQueryClient();
  return useMutation(
    async (params: { topicId: string; title: string, quizId: string }) => {
      return editTopicTitle(params.topicId, params.title).then((result) => {
        return result;
      });
    },
    {
      onSuccess: (data, variables) => {
        queryClient.refetchQueries(['creator_quiz', variables.quizId]);
        return data;
      }
    }
  );
}
