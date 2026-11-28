
export interface PaginationResult<T> {
  data: T[];
  hasMore: boolean;
  nextCursor: string | null;
}

export function paginateResults<T extends { id: string }>(
  results: T[],
  limit: number
): PaginationResult<T> {
  const hasMore = results.length > limit;

  const data = hasMore
    ? results.slice(0, limit)
    : results;

  return {
    data,
    hasMore,
    nextCursor: hasMore
      ? data[data.length - 1]?.id ?? null
      : null,
  };
}
