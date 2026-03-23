"use client";

import { GenresQueryResult } from "@/types/client/genres";

export const getMovieGenres = async () => {
  const response = await fetch("/api/movies/genres");
  const data = await response.json();
  return data as GenresQueryResult;
};

