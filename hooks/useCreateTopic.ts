import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTopic } from '@/utils/supabase-client';

export function useCreateTopicMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    async (params: { quizId: string }) => {
      return createTopic(params.quizId).then((result) => {
        return result;
      });
    },
    {
      onSuccess: (data, variables) => {
        queryClient.refetchQueries(['creator_course', variables.quizId]);

        return data;
      }
    }
  );
}
