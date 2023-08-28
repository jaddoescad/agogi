import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Database } from "types/types_db";
import { getQuizAndTopics } from "utils/supabase-client";

export function useGetQuizAndTopics(quizId: string) {
  const key = ["creator_quiz", quizId];

  return useQuery(
    key,
    async () => {
      
      return getQuizAndTopics(quizId).then(
        (result) => result
      );
    },
    {
      enabled: !!quizId,
      refetchOnWindowFocus: false,
    }
  );
}