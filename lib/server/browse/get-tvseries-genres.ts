import { GenresQueryResult } from "@/types/server/genres";
import { getUserRegionISO3166_1 } from "../get-user-region";
import { getUserLanguageISO639_1 } from "../get-user-language";

export async function getTvSeriesGenres() {
  const region = await getUserRegionISO3166_1();
  const language = await getUserLanguageISO639_1();
  const searchParams = new URLSearchParams({ region, language });
  const response = await fetch(
    `https://api.themoviedb.org/3/genre/tv/list?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching genres");
  }

  const data = await response.json();

  return data as GenresQueryResult;
}
