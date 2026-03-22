import { GenrePicker } from "@/components/browse/client/GenrePicker";
import { MoviesCatalog } from "@/components/browse/server/MoviesCatalog";
import { FC, Suspense } from "react";
import { ReactQueryProvider } from "@/components/client/ReactQueryProvider";
import { getMovieGenres, getTvSeriesGenres } from "@/lib/requests/genres";
import { MediaSelector } from "@/components/browse/client/MediaSelector";
import { SeriesCatalog } from "@/components/browse/server/SeriesCatalog";

export default async function BrowsePage(props: {
  searchParams: Promise<BrowseSearchParams>;
}) {
  const searchParams = await props.searchParams;
  const mediaType = searchParams.type || "movie";
  return (
    <>
      <h1>
        {mediaType === "movie" ? "Catalogo de Peliculas" : "Catalogo de Series"}
      </h1>
      <p>
        A continuacion se muestran las{" "}
        {mediaType === "movie" ? "peliculas" : "series"} traidas
      </p>
      <ReactQueryProvider>
        {/**Searcher must be inside here...*/}

        {/**Sort By Input (Popularity DESC by default)*/}

        {/**Media Selector (movies or series)*/}
        <MediaSelector initialValue={mediaType} />
        {/**Genre Picker*/}
        <GenrePicker
          key={mediaType}
          queryFn={mediaType === "movie" ? getMovieGenres : getTvSeriesGenres}
          mediaType={mediaType}
        />
        {/**Filter*/}
      </ReactQueryProvider>
      <Suspense fallback={<LoadingSkeleton />}>
        {isMovieParams(searchParams) ? (
          <MoviesCatalog params={searchParams} />
        ) : (
          <SeriesCatalog params={searchParams} />
        )}
      </Suspense>
    </>
  );
}

const LoadingSkeleton: FC = () => {
  return <div>Loading...</div>;
};

const isMovieParams = (
  browseSearchParams: BrowseSearchParams
): browseSearchParams is MovieSearchParams => {
  return (
    browseSearchParams.type === "movie" || browseSearchParams.type === undefined
  );
};

export type BrowseSearchParams = MovieSearchParams | TVSeriesSearchParams;

export interface MovieSearchParams {
  type?: (typeof MediaTypeValuesObj)["movie"];
  page?: number;
  genres?: string;
  sortBy?: SortByType;
  filterBy?: MovieFilterByType;
}

export interface TVSeriesSearchParams {
  type?: (typeof MediaTypeValuesObj)["tvSeries"];
  page?: number;
  genres?: string;
  sortBy?: SortByType;
  filterBy?: TVSeriesFilterByType;
}

type MovieFilterByType = "In Theatres" | "Coming Soon";
type TVSeriesFilterByType = "Air Today" | "On the Air";

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
