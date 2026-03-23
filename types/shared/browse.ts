export type BrowseSearchParams = MovieSearchParams | TVSeriesSearchParams;

export interface MovieSearchParams {
  type?: (typeof MediaTypeValuesObj)["movie"];
  page?: string;
  genres?: string;
  sortBy?: SortByType;
  filterBy?: MovieFilterByType;
}

export interface TVSeriesSearchParams {
  type: (typeof MediaTypeValuesObj)["tvSeries"];
  page?: string;
  genres?: string;
  sortBy?: SortByType;
  filterBy?: TVSeriesFilterByType;
}

export type MovieFilterByType =
  (typeof MovieFilterByTypeValuesObj)[keyof typeof MovieFilterByTypeValuesObj];

export const MovieFilterByTypeValuesObj = {
  inTheatres: "In Theatres",
  comingSoon: "Coming Soon",
} as const;

export type TVSeriesFilterByType =
  (typeof TVSeriesFilterByTypeValuesObj)[keyof typeof TVSeriesFilterByTypeValuesObj];

export const TVSeriesFilterByTypeValuesObj = {
  airToday: "Air Today",
  onTheAir: "On the Air",
} as const;

type SortByType = {
  by: "Popularity" | "Rating";
  way: "ASC" | "DESC";
};

export const MediaTypeValuesObj = {
  movie: "movie",
  tvSeries: "tvSeries",
} as const;

export type MediaType =
  (typeof MediaTypeValuesObj)[keyof typeof MediaTypeValuesObj];


//TMDB DISCOVER API  
export interface DiscoverQueryResult<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface DiscoverTVSerieObj {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface DiscoverMovieObj {
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