import { FC } from "react";
import { CatalogNavigation } from "../client/CatalogNavigation";
import { BrowseSearchParams, MovieSearchParams } from "@/app/browse/page";

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

type RawMovieParams = Omit<MovieSearchParams, "type">

// type ResolvedMovieParams = RemoveOptional<RawMovieParams>

interface MovieCatalogProps { 
  params: RawMovieParams
};


export const MoviesCatalog: FC<MovieCatalogProps> = async ({
  params:{
    page=1,
    genres=""
  }
}) => {
  const params = new URLSearchParams();
  /**Default params for query*/
  params.append("include_adult", "true");
  params.append("include_video", "false");
  params.append("language", "en-US"); //temporarly

  //defined by our own query params
  params.append("page", page.toString());
  params.append("sort_by", "popularity.desc");
  params.append("with_genres", genres);
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


// const ResolveUndefinedParams = (rawParams: RawParams):ResolvedMovieParams => {

// }

// // Quita el ? (opcionalidad) de todos los campos
// type RemoveOptional<T> = {
//   [K in keyof T]-?: T[K];
// };