import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Database } from "types/types_db";
import { uploadImageUrl } from "utils/supabase-client";

export function useUpdateQuizImage() {
  const queryClient = useQueryClient();

  return useMutation(
    async (params: { quizId: string, imageUrl: string  }) => {
      return uploadImageUrl(params.quizId ,params.imageUrl).then((result) => {
        return result.data;
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