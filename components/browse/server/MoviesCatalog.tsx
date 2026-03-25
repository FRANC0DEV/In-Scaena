import "server-only";

import { FC } from "react";
import { CatalogNavigation } from "../client/CatalogNavigation";
import { MovieSearchParams } from "@/types/shared/browse";
import { getMovies } from "@/lib/server/browse/get-movies";
import { MovieCard } from "../client/MovieCard";

export const MoviesCatalog: FC<{ queryParams: MovieSearchParams }> = async ({
  queryParams,
}) => {
  const {
    results: movies,
    page: currentPage,
    total_pages,
  } = await getMovies(queryParams);
  return (
    <div className="flex flex-col ml-auto">
      <ul className="grid grid-cols-5 gap-2 w-fit">
        {movies.map((r) => (
          <MovieCard {...r} key={r.id} />
        ))}
      </ul>
      <CatalogNavigation
        currentPage={currentPage}
        totalPages={Math.min(total_pages, 500)}
      />
    </div>
  );
};
