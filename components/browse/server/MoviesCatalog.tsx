import "server-only";

import { FC } from "react";
import { CatalogNavigation } from "../client/CatalogNavigation";
import { MovieSearchParams } from "@/types/shared/browse";
import { getMovies } from "@/lib/server/browse/get-movies";

export const MoviesCatalog: FC<{ queryParams: MovieSearchParams }> = async ({
  queryParams,
}) => {
  const {
    results: movies,
    page: currentPage,
    total_pages,
  } = await getMovies(queryParams);
  return (
    <>
      <ul>
        {movies.map((r) => (
          <li key={r.id}>{r.title}</li>
        ))}
      </ul>
      <CatalogNavigation
        currentPage={currentPage}
        totalPages={Math.min(total_pages, 500)}
      />
    </>
  );
};
