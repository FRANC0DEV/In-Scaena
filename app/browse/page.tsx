import { GenrePicker } from "@/components/browse/client/GenrePicker";
import { MoviesCatalog } from "@/components/browse/server/MoviesCatalog";
import { FC, Suspense } from "react";
import { MediaSelector } from "@/components/browse/client/MediaSelector";
import { SeriesCatalog } from "@/components/browse/server/SeriesCatalog";
import { MovieFilter } from "@/components/browse/client/MovieFilter";
import { BrowseSearchParams } from "@/types/shared/browse";
import { SeriesFilter } from "@/components/browse/client/SeriesFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { getMovieGenres } from "@/lib/server/browse/get-movie-genres";
import { getTvSeriesGenres } from "@/lib/server/browse/get-tvseries-genres";
import ErrorBoundary from "@/components/client/ErrorBoundary";

export default async function BrowsePage(props: {
  searchParams: Promise<BrowseSearchParams>;
}) {
  const searchParams = await props.searchParams;
  const mediaType = searchParams.type || "movie";
  const queryGenres =
    mediaType === "movie" ? getMovieGenres : getTvSeriesGenres;

  const genresQueryPromise = queryGenres();
  return (
    <>
      <h1>
        {mediaType === "movie" ? "Catalogo de Peliculas" : "Catalogo de Series"}
      </h1>
      <p>
        A continuacion se muestran las{" "}
        {mediaType === "movie" ? "peliculas" : "series"} traidas
      </p>
      {/**Searcher must be inside here...*/}

      {/**Sort By Input (Popularity DESC by default)*/}

      {/**Media Selector (movies or series)*/}
      <MediaSelector initialValue={mediaType} />

      {/**Filter*/}
      {mediaType === "movie" ? <MovieFilter /> : <SeriesFilter />}
      <div className="flex flex-row">
        {/**Genre Picker*/}
        <ErrorBoundary fallback={<p>cdnd</p>}>
          <Suspense fallback={<p>Cargando...</p>}>
            <GenrePicker key={mediaType} genresQueryPromise={genresQueryPromise} />
          </Suspense>
        </ErrorBoundary>

        <Suspense fallback={<LoadingSkeleton />}>
          {searchParams.type && searchParams.type === "tvSeries" ? (
            <SeriesCatalog queryParams={searchParams} />
          ) : (
            <MoviesCatalog queryParams={searchParams} />
            // <LoadingSkeleton/>
          )}
        </Suspense>
      </div>
    </>
  );
}

const LoadingSkeleton: FC = () => {
  return (
    <ul className="grid grid-cols-5 gap-2 w-fit ml-auto">
      {Array(20)
        .fill(0)
        .map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
    </ul>
  );
};

const MovieCardSkeleton = () => {
  return (
    <div className="flex flex-col justify-between w-fit gap-2 ml-auto">
      <Skeleton className="w-50 h-75 bg-gray-200 rounded-none" />
      <Skeleton className="w-45 h-5 bg-gray-200 mx-auto" />
    </div>
  );
};
