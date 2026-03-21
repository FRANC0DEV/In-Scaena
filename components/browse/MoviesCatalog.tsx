import { FC } from "react";
import { CatalogNavigation } from "./CatalogNavigation";

export interface QueryResult {
  page: number;
  results: Result[];
  total_pages: number;
  total_results: number;
}

export interface Result {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface MovieCatalogProps {
  page?: number;
  movieGenresIds: string[];
}

export const MoviesCatalog: FC<MovieCatalogProps> = async ({
  page = 1,
  movieGenresIds,
}) => {
  const params = new URLSearchParams();
  /**Default params for query*/
  params.append("include_adult", "true");
  params.append("include_video", "false");
  params.append("sort_by", "popularity.desc");
  params.append("language", "en-US"); //temporarly
  //defined by our own query params
  params.append("page", page.toString());
  params.append("with_genres", movieGenresIds.join(","));
  //Fetching the results
  const moviesQuery = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      },
    }
  );
  const moviesQueryResult = (await moviesQuery.json()) as QueryResult;
  return (
    <>
      <ul>
        {moviesQueryResult.results.map((r) => (
          <li key={r.id}>{r.title}</li>
        ))}
      </ul>
      <CatalogNavigation
        currentPage={page}
        totalPages={Math.min(moviesQueryResult.total_pages, 500)}
      />
    </>
  );
};
