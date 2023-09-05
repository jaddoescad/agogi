import { useQuery } from "@tanstack/react-query";
import { getPublishedQuizAndTopics } from "utils/supabase-client";

export function useGetPublishedQuizAndTopics(quizId: string) {
  const key = ["creator_quiz", quizId];
  return useQuery(
    key,
    async () => {
      
      return getPublishedQuizAndTopics(quizId).then(
        (result) => result
      );
    },
    {
      enabled: !!quizId,
      refetchOnWindowFocus: false,
    }
  );
}