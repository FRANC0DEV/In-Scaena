import { getUserLanguageISO639_1 } from "@/lib/server/get-user-language";
import { getUserRegionISO3166_1 } from "@/lib/server/get-user-region";
import { TVSeriesSearchParams } from "@/types/shared/browse";
import { FC } from "react";
import { CatalogNavigation } from "../client/CatalogNavigation";
import { getUserTimezone } from "@/lib/server/get-user-timezone";

export const SeriesCatalog: FC<{ queryParams: TVSeriesSearchParams }> = async ({
  queryParams,
}) => {
  const processedParams = new URLSearchParams();
  //Default params for query
  processedParams.append("include_adult", "true");

  //defined by our own query params

  //page
  const page = queryParams.page ?? "1";
  processedParams.append("page", page);

  //with_genres
  const genres = queryParams.genres;
  if (genres) {
    processedParams.append("with_genres", genres);
  }

  //sortby
  const sortBy = queryParams.sortBy;

  if (sortBy) {
    switch (sortBy.by) {
      case "Popularity":
        processedParams.append(
          "sort_by",
          `popularity.${sortBy.way.toLowerCase()}`
        );
        break;
      case "Rating":
        processedParams.append(
          "sort_by",
          `vote_average.${sortBy.way.toLowerCase()}`
        );
        //Rating must be fair, so only series with a vote count greater than or equal to 200 are selected
        processedParams.append("vote_count.gte", "200");
        break;
      default:
        throw new Error("Error: Undefined Sorting Method");
    }
  } else {
    //if sortby param is not defined, we sort by popularity.desc by default
    processedParams.append("sort_by", `popularity.desc`);
  }

  //filter_by
  const filterby = queryParams.filterBy;
  //we filter only if the user wants, no default values
  if (filterby) {
    const timezone = await getUserTimezone();
    const todayDate = new Date();
    // Formatea la fecha según la timezone del usuario
    const formatter = new Intl.DateTimeFormat("sv", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const todayDateFormatted = formatter.format(todayDate);
    switch (filterby) {
      case "Air Today":
        processedParams.append("air_date.lte", todayDateFormatted);
        processedParams.append("air_date.gte", todayDateFormatted);
        processedParams.append("timezone", timezone);
        break;
      case "On the Air":
        const nextWeekDate = new Date(todayDate); // create a new date based on the original
        nextWeekDate.setDate(todayDate.getDate() + 7); // increment by one day
        const nextWeekDateFormatted = formatter.format(nextWeekDate);
        processedParams.append("air_date.gte", todayDateFormatted);
        processedParams.append("air_date.lte", nextWeekDateFormatted);
        processedParams.append("timezone", timezone);
        break;
      default:
        throw new Error("Error: Undefined Filtering Method");
    }
  }

  //LANGUAGE & REGION
  const [regionResult, languageResult] = await Promise.allSettled([
    getUserRegionISO3166_1(),
    getUserLanguageISO639_1(),
  ]);

  if (
    regionResult.status === "fulfilled" &&
    languageResult.status === "fulfilled"
  ) {
    processedParams.append(
      "language",
      `${languageResult.value}-${regionResult.value}`
    );
    processedParams.append("region", regionResult.value);
  } else {
    processedParams.append("language", "en-US");
    processedParams.append("region", "US");
  }
  console.log(
    "========================PARAMS DE ENVIO SERIES=================="
  );
  console.log(
    processedParams
      .entries()
      .map(([k, v], _) => `${k}:${v}`)
      .reduce((prev, curr) => prev + "\n" + curr)
  );
  console.log(
    "================================================================"
  );

  //Fetching the results
  const tvSeriesQuery = await fetch(
    `https://api.themoviedb.org/3/discover/tv?${processedParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      },
    }
  );
  const tvSeriesQueryResult = (await tvSeriesQuery.json()) as QueryResult;
  return (
    <>
      <ul>
        {tvSeriesQueryResult.results.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
      <CatalogNavigation
        currentPage={Number(page)}
        totalPages={Math.min(tvSeriesQueryResult.total_pages, 500)}
      />
    </>
  );
};

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
