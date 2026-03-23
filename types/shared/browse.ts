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
