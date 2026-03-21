import { MovieGenreFilter } from "@/components/browse/MovieGenreFilter";
import { MoviesCatalog } from "@/components/browse/MoviesCatalog";
import { FC, Suspense } from "react";
import { ReactQueryProvider } from "@/components/client/ReactQueryProvider";

export default async function BrowsePage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const genresIds = searchParams.genres?.split(",") ?? [];
  return (
    <>
      <h1>Catalogo de peliculas</h1>
      <p>A continuacion se muestran las peliculas traidas</p>
      <ReactQueryProvider>
        <MovieGenreFilter />
      </ReactQueryProvider>
      <Suspense fallback={<LoadingSkeleton />}>
        <MoviesCatalog page={page} movieGenresIds={genresIds} />
      </Suspense>
    </>
  );
}

const LoadingSkeleton: FC = () => {
  return <div>Loading...</div>;
};

interface SearchParams {
  page?: string;
  genres?: string;
}
