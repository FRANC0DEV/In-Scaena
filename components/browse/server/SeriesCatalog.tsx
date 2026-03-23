import "server-only";

import { FC } from "react";
import { TVSeriesSearchParams } from "@/types/shared/browse";
import { CatalogNavigation } from "../client/CatalogNavigation";
import { getTvSeries } from "@/lib/server/browse/get-tvseries";

export const SeriesCatalog: FC<{ queryParams: TVSeriesSearchParams }> = async ({
  queryParams,
}) => {
  const {
    results: tvSeries,
    page: currentPage,
    total_pages,
  } = await getTvSeries(queryParams);
  return (
    <>
      <ul>
        {tvSeries.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
      <CatalogNavigation
        currentPage={currentPage}
        totalPages={Math.min(total_pages, 500)}
      />
    </>
  );
};
