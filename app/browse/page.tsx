import { GenrePicker } from "@/components/browse/client/GenrePicker";
import { MoviesCatalog } from "@/components/browse/server/MoviesCatalog";
import { FC, Suspense } from "react";
import { ReactQueryProvider } from "@/components/client/ReactQueryProvider";
import { MediaSelector } from "@/components/browse/client/MediaSelector";
import { SeriesCatalog } from "@/components/browse/server/SeriesCatalog";
import { MovieFilter } from "@/components/browse/client/MovieFilter";
import { BrowseSearchParams } from "@/types/shared/browse";
import { SeriesFilter } from "@/components/browse/client/SeriesFilter";

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
        <GenrePicker key={mediaType} mediaType={mediaType} />
        {/**Filter*/}
        {mediaType === "movie" ? <MovieFilter /> : <SeriesFilter />}
      </ReactQueryProvider>
      <Suspense fallback={<LoadingSkeleton />}>
        {searchParams.type && searchParams.type === "tvSeries" ? (
          <SeriesCatalog queryParams={searchParams} />
        ) : (
          <MoviesCatalog queryParams={searchParams} />
        )}
      </Suspense>
    </>
  );
}

const LoadingSkeleton: FC = () => {
  return <div>Loading...</div>;
};
