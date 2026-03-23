import { FC } from "react";
import { CatalogNavigation } from "../client/CatalogNavigation";
import { MovieSearchParams } from "@/types/shared/browse";
import { getUserRegionISO3166_1 } from "@/lib/server/get-user-region";
import { getUserLanguageISO639_1 } from "@/lib/server/get-user-language";

export const MoviesCatalog: FC<{ queryParams: MovieSearchParams }> = async ({
  queryParams,
}) => {
  const processedParams = new URLSearchParams();

  //Default params for query
  processedParams.append("include_adult", "true");
  processedParams.append("include_video", "false");

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
        //Rating must be fair, so only movies with a vote count greater than or equal to 200 are selected
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
    const todayDate = new Date();
    const todayDateFormatted = todayDate.toISOString().split("T")[0];
    switch (filterby) {
      case "In Theatres":
        const minimumDate = new Date(todayDate);
        minimumDate.setDate(todayDate.getDate() - 30);
        const minimumDateFormatted = minimumDate.toISOString().split("T")[0];
        processedParams.append("with_release_type", ["2", "3"].join("|"));
        processedParams.append("release_date.lte", todayDateFormatted);
        processedParams.append("release_date.gte", minimumDateFormatted);
        break;
      case "Coming Soon":
        const tomorrowDate = new Date(todayDate); // create a new date based on the original
        tomorrowDate.setDate(todayDate.getDate() + 1); // increment by one day
        const tomorrowDateFormatted = tomorrowDate.toISOString().split("T")[0];
        processedParams.append("with_release_type", ["2", "3"].join("|"));
        processedParams.append("release_date.gte", tomorrowDateFormatted);
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
    "=====================PARAMS DE ENVIO PELICULAS=================="
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
  const moviesQuery = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${processedParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      },
    }
  );
  const moviesQueryResult = (await moviesQuery.json()) as QueryResult;
  return (
    <>
      <ul>
        {moviesQueryResult.results.map((r) => (
          <li key={r.id}>{r.title}</li>
        ))}
      </ul>
      <CatalogNavigation
        currentPage={Number(page)}
        totalPages={Math.min(moviesQueryResult.total_pages, 500)}
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
