import { useMemo } from "react";
import { useTopicsQuery } from "../../generated/graphql";

export function useTopics() {
  const { data: topicsResponse } = useTopicsQuery({
    skip: typeof window === "undefined",
  });

  const topics = useMemo(() => topicsResponse?.topics || [], [topicsResponse]);

  return {
    topics,
  };
}
