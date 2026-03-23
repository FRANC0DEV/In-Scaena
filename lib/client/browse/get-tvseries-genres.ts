"use client";

import { GenresQueryResult } from "@/types/client/genres";

export const getTvSeriesGenres = async () => {
  const response = await fetch("/api/series/genres");
  const data = await response.json();
  return data as GenresQueryResult;
};
