"use client"; /**La funcion getMovieGenres se ejecuta en cliente */

export interface GenresQueryResult {
  genres: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export const getMovieGenres = async () => {
  const response = await fetch("/api/movies/genres");
  const data = await response.json();
  return data as GenresQueryResult;
};

export const getTvSeriesGenres = async () => {
  const response = await fetch("/api/series/genres");
  const data = await response.json();
  return data as GenresQueryResult;
};
