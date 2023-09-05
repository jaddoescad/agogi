import { useQuery } from "@tanstack/react-query";
import { Database } from "types/types_db";
import { getQuizInfo } from "utils/supabase-client";

export function useGetQuizInfo(quizId: string) {
  const key = ["creator_quiz_info", quizId];
  return useQuery(
    key,
    async () => {
      
      return getQuizInfo(quizId).then(
        (result) => result
      );
    },
    {
      enabled: !!quizId,
      refetchOnWindowFocus: false,
    }
  );
}