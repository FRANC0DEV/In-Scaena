// lib/server/get-movie-genres.ts
import "server-only";
import { getUserLanguageISO639_1 } from "@/lib/server/get-user-language";
import { getUserRegionISO3166_1 } from "@/lib/server/get-user-region";
import { GenresQueryResult } from "@/types/server/genres";

export async function getMovieGenres() {
  const region = await getUserRegionISO3166_1();
  const language = await getUserLanguageISO639_1();

  const searchParams = new URLSearchParams({
    region,
    language,
  });

  const response = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?${searchParams.toString()}`,
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
