import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Database } from "types/types_db";
import { updateQuizTitle } from "utils/supabase-client";

export function useUpdateQuizTitleMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    async (params: { quizId: string, quizTitle: string  }) => {
      return updateQuizTitle(params.quizId ,params.quizTitle).then((result) => {
        return result;
      });
    },
    {
      onSuccess: (data, variables) => {
        queryClient.refetchQueries(["creator_quiz_info", variables.quizId]);
        return data;
      },
    }
  );
}