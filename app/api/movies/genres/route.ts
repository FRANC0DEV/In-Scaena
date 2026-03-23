import { getUserLanguageISO639_1 } from "@/lib/server/get-user-language";
import { getUserRegionISO3166_1 } from "@/lib/server/get-user-region";
import { NextResponse } from "next/server";

export async function GET() {
  const region = await getUserRegionISO3166_1();
  const language = await getUserLanguageISO639_1();
  const searchParams = new URLSearchParams({ region, language });
  const response = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Error fetching genres",
      },
      { status: 500 }
    );
  }

  const data = await response.json();

  return NextResponse.json(data, { status: 200 });
}
